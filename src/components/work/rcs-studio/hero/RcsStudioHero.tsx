"use client";

import { createContext, useContext, useEffect, useId, useReducer, useRef, useState, type Dispatch, type MouseEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useHeroFooter } from "@/components/case/HeroStage";
import {
  AgentInfo,
  AndroidPhone,
  BANNER_CLEARANCE,
  Composer,
  ConversationPanel,
  DemoBanner,
  MessageBubble,
  MessagesHeader,
  PANEL_PADDING,
  RichCard,
  RichCardCarousel,
  SuggestionChips,
  ThreadIntro,
  Timestamp,
  TypingIndicator,
  type BubbleStatus,
} from "@/components/phone";
import {
  BadgeCheck,
  BotMessageSquare,
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  ClipboardCheck,
  Clock,
  Info,
  Rocket,
  RotateCcw,
  SkipForward,
  Sparkles,
} from "lucide-react";
import {
  AGENT,
  AUTO_OPT_IN,
  END_CARD,
  FORM_DEFAULTS,
  FRAMES,
  HAPPY_PATH,
  OPTIONS,
  PHONE_COPY,
  PREFILL,
  REVIEW_TIMELINE,
  SIGNUP_SUCCESS,
  STATUS,
  STEP_LABELS,
  money,
  type Field,
  type HappyMoment,
  type Status,
  type Step,
  type Values,
} from "./script";

/**
 * RCS Studio hero: one self-driving story in a 16:9 stage, mock data only, frameless.
 * Journey: demo RCS → sign up → provision (brand, agent, campaign) → submit → live.
 *
 * Each phase draws its own card on the page ground:
 *  - demo RCS, provisioning, submitted, live: a 50/50 card (panel left, Android phone right
 *    on a tinted pane), stacking below 768px
 *  - sign up: a narrow centered card, no phone
 * The card animates its size between phases with a layout transition.
 * Step progression, Replay, and Skip to live belong to the stage footer (useHeroFooter), not the panes.
 * The phone is the shared kit in src/components/phone (Google Messages RCS UI).
 *
 * One state machine (a flat list of frames) drives both modes:
 *  - interactive: the viewer advances with real controls; a few frames auto-advance (a reply arriving)
 *  - autoplay: every frame advances on its own timer and the story loops
 * `HeroView` is purely presentational, so the stills render it in fixed states with no timers.
 *
 * Google's agent limits are enforced where a field exists: display name 40, description 100,
 * suggestion labels 25. The logo hint says 224×224 PNG or JPEG; any image is accepted.
 *
 * The thread (demo and live) is one ordering flow: opener, a carousel of three deal cards,
 * two action chips, the viewer taps a card's button, an upsell card, the viewer taps
 * "Yes, and checkout" (or "No thanks"), and an order confirmation card with two chips. Each
 * thread's progress is a `Thread` in state: the deal picked, then whether the add-on was taken.
 *
 * The happy path (HAPPY_PATH in script.ts) names the one control to click at each moment.
 * A capture-phase click handler on the prototype root compares every click against it: a
 * click on that control, on any form control or label, or on a control marked `data-control`
 * (Replay, the color swatch, the tooltip) passes; anything else pulses the current target.
 *
 * All demo copy and timings (the agent, the chips and replies, the form values, the frames)
 * live in ./script.ts so they can be edited without touching the state machine.
 */

/* ---------------------------------------------------------------- limits */

const MAX = { name: 40, description: 100 } as const;

/** one form row: every field in a form shares this border, radius, and type size */
const ROW = "bubble-sm border text-[13px] text-ink";

/**
 * Scoped CSS that the Tailwind layer cannot win against the site's unlayered `:focus-visible`
 * rule: a focused input gets one 1.5 px portfolio-blue outline drawn over its border (no second
 * ring); a row that wraps controls (`data-row`) draws that same outline instead of the control
 * inside it; and the happy-path pulse, two pulses of a 2 px outline in 1.2 s.
 */
const HERO_CSS =
  "[data-rcs-hero] :is(input,select,textarea):focus-visible{outline:1.5px solid var(--accent);outline-offset:-1px}" +
  "[data-rcs-hero] [data-row]:has(:focus-visible){outline:1.5px solid var(--accent);outline-offset:-1px}" +
  "[data-rcs-hero] [data-row] :is(input,select,textarea):focus-visible{outline:none}" +
  "@keyframes rcs-hint{0%,100%{box-shadow:0 0 0 0 transparent}50%{box-shadow:0 0 0 2px var(--accent)}}";

/** how long the happy-path pulse shows, in ms (two pulses) */
const HINT_MS = 1200;
/** row height and padding: 44 px in the demo form, 36 px in the denser provisioning forms */
const rowSize = (tall?: boolean) => (tall ? "h-11 px-3" : "h-9 px-2.5");
/** the two-to-three-line textarea rows (description, sample message); the demo form's logo zone matches it */
const MULTI_H = "h-14";

/* ---------------------------------------------------------------- frames */

/** FRAMES, the copy, and the timings live in script.ts; the hero only looks frames up */
const at = (step: Step, phase: string) => FRAMES.findIndex((f) => f.step === step && f.phase === phase);

const F = {
  /** the first frame of the thread: the agent is typing */
  yours: at("yours", "typing1"),
  yoursOpener: at("yours", "opener"),
  yoursTyping2: at("yours", "typing2"),
  yoursCarousel: at("yours", "carousel"),
  /** the chips are out; the viewer can tap a card's button */
  yoursChips: at("yours", "chips"),
  yoursTapped: at("yours", "tap"),
  /** the upsell card is out; the viewer can check out */
  yoursUpsell: at("yours", "upsell"),
  yoursCheckout: at("yours", "checkout"),
  yoursConfirmed: at("yours", "confirmed"),
  yoursName: at("yours", "name"),
  yoursColor: at("yours", "color"),
  yoursLogo: at("yours", "logo"),
  yoursCta: at("yours", "cta"),
  signup: at("signup", "empty"),
  signupFilled: at("signup", "password"),
  signupSuccess: at("signup", "success"),
  brand: at("brand", "empty"),
  agent: at("agent", "prefilled"),
  campaign: at("campaign", "filled"),
  campaignInvalid: at("campaign", "invalid"),
  campaignFixed: at("campaign", "fixed"),
  submitted: at("submitted", "reviewing"),
  live: at("live", "live"),
  liveTapped: at("live", "tapped"),
  liveUpsell: at("live", "upsell"),
  liveCheckout: at("live", "checkout"),
  liveConfirmed: at("live", "confirmed"),
};

/**
 * The frames that reveal each part of a thread, per mode. The demo thread builds up over its
 * opening frames; the live thread shows the opener, carousel, and chips at once.
 */
type ThreadFrames = { opener: number; carousel: number; chips: number; upsell: number; confirmed: number; typing: number[] };
const THREAD_FRAMES: Record<"yours" | "live", ThreadFrames> = {
  yours: { opener: F.yoursOpener, carousel: F.yoursCarousel, chips: F.yoursChips, upsell: F.yoursUpsell, confirmed: F.yoursConfirmed, typing: [F.yours, F.yoursTyping2] },
  live: { opener: F.live, carousel: F.live, chips: F.live, upsell: F.liveUpsell, confirmed: F.liveConfirmed, typing: [] },
};

const STEP_ORDER: Step[] = ["yours", "signup", "brand", "agent", "campaign", "submitted", "live"];
const FOOTER_STEPS = STEP_ORDER.map((st) => STEP_LABELS[st]);
/** the first frame of each step, for the footer's step arrows */
const STEP_START = STEP_ORDER.map((st) => FRAMES.findIndex((f) => f.step === st));

/** the three provisioning steps, with the icon each wears in the pane header */
const PROVISION_STEPS: { step: Step; icon: typeof Building2 }[] = [
  { step: "brand", icon: Building2 },
  { step: "agent", icon: BotMessageSquare },
  { step: "campaign", icon: ClipboardCheck },
];

/* ------------------------------------------------------------- mock data */

type Logo =
  | { kind: "none" }
  | { kind: "mark" }
  | {
      kind: "upload";
      src: string;
      w: number;
      h: number;
      bytes: number;
      name: string;
    };

/** fields the later steps prefill from the agent name chosen in step 1 */
function derive(v: Values): Values {
  const name = v.agentName.trim() || PREFILL.fallbackName;
  const site = PREFILL.site(slug(name));
  return {
    ...v,
    email: PREFILL.email(site),
    legalName: PREFILL.legalName(name),
    website: site,
    contact: PREFILL.email(site),
    description: PREFILL.description(name).slice(0, MAX.description),
    sample: PREFILL.sample(name),
  };
}

const FILLED_AT: Record<Field, number> = {
  agentName: 0,
  color: 0,
  name: at("signup", "name"),
  email: at("signup", "email"),
  password: at("signup", "password"),
  legalName: at("brand", "legalName"),
  website: at("brand", "website"),
  contact: at("brand", "contact"),
  description: F.agent,
  useCase: F.campaign,
  sample: F.campaign,
  volume: F.campaign,
  optIn: F.campaignFixed,
};

/* --------------------------------------------------------------- helpers */

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function monogram(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  return words
    .slice(0, 2)
    .map((w) => w.replace(/[^\p{L}\p{N}]/gu, "").charAt(0))
    .join("")
    .toUpperCase();
}

function normalizeHex(hex: string) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  return m ? `#${m[1].toUpperCase()}` : null;
}

/* ----------------------------------------------------------- state machine */

/** one thread's progress: the deal card tapped (index), then whether the add-on was taken */
type Thread = { deal: number | null; addon: boolean | null };
const UNTAPPED: Thread = { deal: null, addon: null };

type State = { i: number; yours: Thread; live: Thread; values: Values; logo: Logo; run: number };
type Action =
  | { type: "NEXT" }
  | { type: "GOTO"; i: number }
  /** a card's "Get this deal" */
  | { type: "TAP"; deal: number; now?: boolean }
  /** the upsell's "Yes, and checkout" (addon true) or "No thanks" (false) */
  | { type: "CHECKOUT"; addon: boolean; now?: boolean }
  | { type: "SET"; field: Field; value: string }
  | { type: "LOGO"; logo: Logo }
  /** the form's own Replay: the thread plays again from the top, fields kept */
  | { type: "RESET_THREAD" }
  | { type: "RESET" };

function initial(i = 0, run = 0): State {
  return {
    i,
    yours: UNTAPPED,
    live: UNTAPPED,
    values: { ...FORM_DEFAULTS },
    logo: { kind: "none" },
    run,
  };
}

const DEALS = PHONE_COPY.deals;

/** side effects of landing on a frame (autoplay script and prefill) */
function enter(s: State, i: number): State {
  const f = FRAMES[i];
  const n: State = { ...s, i };
  // landing on the top of a thread (Replay, the footer's step arrows) starts it untapped
  if (f.step === "yours" && f.phase === "typing1") n.yours = UNTAPPED;
  if (f.step === "live" && f.phase === "live") n.live = UNTAPPED;
  // autoplay picks a different deal each run, and always takes the add-on
  if (f.step === "yours" && f.phase === "tap" && s.yours.deal === null) n.yours = { deal: s.run % DEALS.length, addon: null };
  if (f.step === "yours" && f.phase === "checkout" && s.yours.addon === null) n.yours = { ...n.yours, addon: true };
  if (f.step === "live" && f.phase === "tapped" && s.live.deal === null) n.live = { deal: s.run % DEALS.length, addon: null };
  if (f.step === "live" && f.phase === "checkout" && s.live.addon === null) n.live = { ...n.live, addon: true };
  if (f.step === "yours" && f.phase === "color") n.values = { ...n.values, color: AGENT.color };
  if (f.step === "yours" && f.phase === "logo") n.logo = { kind: AGENT.logo };
  if (f.step === "signup" && f.phase === "empty") n.values = derive(n.values);
  if (f.step === "live" && !s.values.sample) n.values = derive(n.values);
  return n;
}

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "NEXT":
      if (s.i >= FRAMES.length - 1) return initial(0, s.run + 1);
      return enter(s, s.i + 1);
    case "GOTO":
      return enter(s, a.i);
    case "TAP": {
      const step = FRAMES[s.i].step;
      if (step === "yours" && s.i >= F.yoursChips && s.yours.deal === null)
        return { ...s, yours: { deal: a.deal, addon: null }, i: a.now ? F.yoursUpsell : F.yoursTapped };
      if (s.i === F.live) return { ...s, live: { deal: a.deal, addon: null }, i: a.now ? F.liveUpsell : F.liveTapped };
      return s;
    }
    case "CHECKOUT": {
      const step = FRAMES[s.i].step;
      if (step === "yours" && s.i >= F.yoursUpsell && s.yours.deal !== null && s.yours.addon === null)
        return { ...s, yours: { ...s.yours, addon: a.addon }, i: a.now ? F.yoursConfirmed : F.yoursCheckout };
      if (s.i === F.liveUpsell && s.live.addon === null)
        return { ...s, live: { ...s.live, addon: a.addon }, i: a.now ? F.liveConfirmed : F.liveCheckout };
      return s;
    }
    case "SET":
      return { ...s, values: { ...s.values, [a.field]: a.value } };
    case "LOGO":
      return { ...s, logo: a.logo };
    case "RESET_THREAD":
      if (FRAMES[s.i].step !== "yours") return s;
      return { ...s, yours: UNTAPPED, i: F.yours };
    case "RESET":
      return initial(0, s.run + 1);
  }
}

/** value a field displays: frame-driven in autoplay/stills, viewer-driven when interactive */
function shown(s: State, timed: boolean, f: Field): string {
  if (!timed) return s.values[f];
  if (s.i < FILLED_AT[f]) return "";
  return f === "optIn" ? AUTO_OPT_IN : s.values[f];
}

/* --------------------------------------------------------------- the hero */

export function RcsStudioHero({ autoplay = false }: { autoplay?: boolean }) {
  const reduced = useReducedMotion();
  const [s, dispatch] = useReducer(reducer, 0, initial);
  const footer = useHeroFooter();
  const step = FRAMES[s.i].step;
  const stepIndex = STEP_ORDER.indexOf(step);

  /** steps, Replay, and Skip to live go to the stage footer (ReducedHero publishes its own) */
  useEffect(() => {
    if (reduced) return;
    footer.set({
      steps: FOOTER_STEPS,
      current: stepIndex,
      onStep: (k) => {
        const i = STEP_START[k];
        if (i !== undefined && i >= 0) dispatch({ type: "GOTO", i });
      },
      actions: [
        {
          label: "Replay",
          icon: <RotateCcw size={12} aria-hidden="true" />,
          onClick: () => dispatch({ type: "RESET" }),
        },
        {
          label: "Skip to live",
          icon: <SkipForward size={12} aria-hidden="true" />,
          onClick: () => dispatch({ type: "GOTO", i: F.live }),
          hidden: autoplay || step === "live",
        },
      ],
    });
    return () => footer.set(null);
  }, [footer, reduced, stepIndex, step, autoplay]);

  useEffect(() => {
    if (reduced) return;
    const f = FRAMES[s.i];
    if (!(autoplay || f.auto)) return;
    const t = setTimeout(() => dispatch({ type: "NEXT" }), f.ms);
    return () => clearTimeout(t);
  }, [autoplay, reduced, s.i, s.run]);

  /** autoplay: the agent name types itself out during the "name" frame */
  useEffect(() => {
    if (reduced || !autoplay || s.i !== F.yoursName) return;
    let k = 0;
    const t = setInterval(() => {
      dispatch({ type: "SET", field: "agentName", value: AGENT.name.slice(0, k) });
      if (k >= AGENT.name.length) clearInterval(t);
      k += 1;
    }, 65);
    return () => clearInterval(t);
  }, [autoplay, reduced, s.i, s.run]);

  if (reduced) return <ReducedHero />;
  return <HeroView s={s} timed={autoplay} dispatch={dispatch} inert={autoplay} />;
}

/** reduced motion: no timers; final state plus a step list, phone still tappable */
function ReducedHero() {
  const [live, setLive] = useState<Thread>(UNTAPPED);
  const footer = useHeroFooter();
  useEffect(() => {
    footer.set({
      steps: FOOTER_STEPS,
      current: STEP_ORDER.length - 1,
      actions: [
        {
          label: "Replay",
          icon: <RotateCcw size={12} aria-hidden="true" />,
          onClick: () => setLive(UNTAPPED),
          hidden: live.deal === null,
        },
      ],
    });
    return () => footer.set(null);
  }, [footer, live]);
  const base = initial();
  const i = live.deal === null ? F.live : live.addon === null ? F.liveUpsell : F.liveConfirmed;
  const s: State = { ...base, values: derive(base.values), i, live };
  const dispatch: Dispatch<Action> = (a) => {
    if (a.type === "TAP") setLive({ deal: a.deal, addon: null });
    if (a.type === "CHECKOUT") setLive((t) => ({ ...t, addon: a.addon }));
    if (a.type === "RESET") setLive(UNTAPPED);
  };
  return (
    <HeroView
      s={s}
      timed={false}
      dispatch={dispatch}
      still
      left={
        <div className="grid gap-4">
          <div className="label text-accent">RCS Studio · the journey</div>
          <ol className="grid gap-1.5 text-[13.5px] text-body">
            {STEP_ORDER.map((st, k) => (
              <li key={st} className="flex items-center gap-2.5">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-ok-soft text-ok">
                  <Check size={12} aria-hidden="true" />
                </span>
                <span>
                  <span className="label mr-2 text-[10.5px]">{k + 1}</span>
                  {STEP_LABELS[st]}
                </span>
              </li>
            ))}
          </ol>
          <EndCard />
        </div>
      }
    />
  );
}

/* --------------------------------------------------------------- stills */

function still(i: number, overrides: Partial<State> = {}): State {
  const base = initial(i);
  return {
    ...base,
    values: derive({ ...base.values, agentName: AGENT.name, color: AGENT.color }),
    logo: { kind: "mark" },
    yours: { deal: 1, addon: true },
    live: { deal: 1, addon: true },
    ...overrides,
  };
}

export const rcsStudioStills: { render: ReactNode; caption: string }[] = [
  {
    render: <HeroView s={still(F.yoursConfirmed)} timed still focus="phone" />,
    caption: "Demo RCS: name, logo, and brand color, previewed live on the phone.",
  },
  {
    render: <HeroView s={still(F.signupFilled)} timed still focus="panel" />,
    caption: "Sign up to save the agent. The phone steps aside.",
  },
  {
    render: <HeroView s={still(F.agent)} timed still focus="panel" />,
    caption: "Provisioning: agent details prefilled from step 1, with Google's limits inline.",
  },
  {
    render: <HeroView s={still(F.submitted)} timed still focus="panel" />,
    caption: "Submitted. Carrier review stands in for one to three weeks.",
  },
  {
    render: <HeroView s={still(F.liveConfirmed)} timed still focus="phone" />,
    caption: "Live: the same conversation, now from your own agent.",
  },
];

/* ------------------------------------------------------------ happy path */

type Target = HappyMoment["target"];
type Hint = { id: Target; nonce: number } | null;
const HintContext = createContext<Hint>(null);

/** the one control to click next, from the state; null while the story moves on its own */
function happyTarget(s: State): Target | null {
  switch (FRAMES[s.i].step) {
    case "yours":
      if (s.i < F.yoursChips) return null;
      if (s.yours.deal === null) return "card-cta";
      if (s.i < F.yoursUpsell) return null;
      return s.yours.addon === null ? "checkout" : "make-live";
    case "signup":
      return s.i === F.signupSuccess ? null : "create-account";
    case "brand":
    case "agent":
      return "continue";
    case "campaign":
      return s.values.optIn ? "submit" : "opt-in";
    case "submitted":
      return null;
    case "live":
      if (s.i === F.live && s.live.deal === null) return "card-cta";
      if (s.i === F.liveUpsell && s.live.addon === null) return "checkout";
      return null;
  }
}

/** matches a click against the controls that never trigger the hint */
const LEGIT = "input, select, textarea, label, [data-control]";

/**
 * The happy-path pulse. Render it inside a `relative` element that carries `data-target={id}`;
 * it shows only while that id is the hinted one. The nonce as key restarts the animation on
 * every new hint. Reduced motion: a static outline for the same time.
 */
function HintRing({ id, className = "inset-0 rounded-[inherit]" }: { id: Target; className?: string }) {
  const hint = useContext(HintContext);
  const reduced = useReducedMotion();
  if (!hint || hint.id !== id) return null;
  return (
    <span
      key={hint.nonce}
      aria-hidden="true"
      className={`pointer-events-none absolute ${className}`}
      style={reduced ? { boxShadow: "0 0 0 2px var(--accent)" } : { animation: `rcs-hint ${HINT_MS / 2}ms ease-in-out 2` }}
    />
  );
}

/* ------------------------------------------------------------------ view */

type ViewProps = {
  s: State;
  /** frame-driven field reveal (autoplay and stills) */
  timed: boolean;
  /** no entrance animations, no shimmer, no layout transitions */
  still?: boolean;
  /** autoplay: controls are visible but not operable */
  inert?: boolean;
  dispatch?: Dispatch<Action>;
  /** which column survives below 768px (stills only) */
  focus?: "phone" | "panel";
  /** replaces the flow panel */
  left?: ReactNode;
};

const noop: Dispatch<Action> = () => {};

function HeroView({ s, timed, still = false, inert = false, dispatch = noop, focus, left }: ViewProps) {
  const step = FRAMES[s.i].step;
  const hasPhone = step !== "signup" && step !== "brand";
  const panelCls = focus === "phone" ? "hidden md:flex" : "flex";
  const phoneCls = focus === "phone" ? "grid" : "hidden md:grid";
  const interactive = !still && !inert;

  /** the happy-path hint: which target pulses, and a nonce so a repeat click pulses again */
  const [hint, setHint] = useState<Hint>(null);
  useEffect(() => {
    if (!hint) return;
    const t = setTimeout(() => setHint(null), HINT_MS);
    return () => clearTimeout(t);
  }, [hint]);
  const moment = hint ? HAPPY_PATH.find((m) => m.step === step && m.target === hint.id) : undefined;

  /**
   * Capture phase, so it sees every click first: a click on the current target, on a form
   * control or its label, or on a `data-control` passes; anything else pulses the target.
   */
  function onClickCapture(e: MouseEvent<HTMLDivElement>) {
    if (!interactive) return;
    const id = happyTarget(s);
    if (!id) return;
    const el = e.target instanceof Element ? e.target : null;
    if (!el) return;
    if (el.closest(`[data-target="${id}"]`) || el.closest(LEGIT)) return;
    setHint({ id, nonce: Date.now() });
  }

  return (
    <HintContext.Provider value={interactive ? hint : null}>
    <div
      inert={inert}
      className={`absolute inset-0 flex items-center justify-center p-3 md:p-4 ${still ? "bg-bg" : ""}`}
      data-step={step}
      data-rcs-hero=""
      onClickCapture={interactive ? onClickCapture : undefined}
    >
      <style href="rcs-hero" precedence="default">
        {HERO_CSS}
      </style>
      {interactive && (
        <span className="sr-only" aria-live="polite">
          {hint && moment ? `Next: ${moment.clicks}.` : ""}
        </span>
      )}
      <motion.div
        layout={!still}
        transition={{ layout: { type: "spring", stiffness: 260, damping: 32 } }}
        className={`bubble relative grid max-h-full w-full grid-rows-[minmax(0,1fr)] overflow-hidden border border-rule bg-surface shadow-[var(--shadow)] ${
          hasPhone
            ? "h-full max-w-[1040px] grid-cols-1 md:grid-cols-2"
            : step === "brand"
              ? "h-auto max-w-[480px] grid-cols-1"
              : "h-auto max-w-[400px] grid-cols-1"
        }`}
      >
        <motion.div layout={still ? false : "position"} className={`${panelCls} min-h-0 min-w-0 flex-col overflow-y-auto px-4 py-4 md:px-6 md:py-6`}>
          <div className="my-auto">{left ?? <FlowPanel s={s} timed={timed} still={still} dispatch={dispatch} />}</div>
        </motion.div>

        <AnimatePresence initial={false} mode="popLayout">
          {hasPhone && (
            <motion.div
              key="phone"
              layout={!still}
              initial={still ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={still ? undefined : { opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`${phoneCls} min-h-0 min-w-0 place-items-center overflow-hidden border-rule bg-accent-soft/40 p-4 md:border-l md:p-6`}
            >
              <Phone s={s} timed={timed} still={still} dispatch={dispatch} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
    </HintContext.Provider>
  );
}

/* ------------------------------------------------------------ flow panel */

type PanelProps = { s: State; timed: boolean; still: boolean; dispatch: Dispatch<Action> };

function FlowPanel({ s, timed, still, dispatch }: PanelProps) {
  const step = FRAMES[s.i].step;
  const group = step === "yours" ? "yours" : step === "signup" ? "signup" : step === "live" ? "live" : "provision";

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={group}
        initial={still ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={still ? undefined : { opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="grid max-w-[440px] gap-4"
      >
        {group === "yours" && <DemoRcs s={s} timed={timed} still={still} dispatch={dispatch} />}
        {group === "signup" && <SignUp s={s} timed={timed} still={still} dispatch={dispatch} />}
        {group === "provision" && <Provision s={s} timed={timed} still={still} dispatch={dispatch} />}
        {group === "live" && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="label">Provisioning</div>
                <div className="truncate text-[15px] font-semibold text-ink">{s.values.agentName}</div>
              </div>
              <StatusPill status={STATUS.live} />
            </div>
            <EndCard />
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------- 1. demo RCS */

function DemoRcs({ s, timed, still, dispatch }: PanelProps) {
  const pressed = timed && s.i === F.yoursCta;

  return (
    <>
      <div>
        <h3 className="text-[clamp(18px,2vw,24px)] font-bold text-ink">{STEP_LABELS.yours}</h3>
        <p className="mt-2 max-w-[36ch] text-[14px] text-body">See what your RCS agent would look like.</p>
      </div>
      <form
        className="grid gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          dispatch({ type: "GOTO", i: F.signup });
        }}
      >
        <Field
          s={s}
          timed={timed}
          dispatch={dispatch}
          field="agentName"
          label="Business name"
          maxLength={MAX.name}
          tall
          highlight={timed && s.i === F.yoursName}
          placeholder="What customers will see"
        />
        <LogoField s={s} timed={timed} dispatch={dispatch} tall highlight={timed && s.i === F.yoursLogo} />
        <ColorField
          value={s.values.color}
          onChange={(v) => dispatch({ type: "SET", field: "color", value: v })}
          readOnly={timed}
          tall
          highlight={timed && s.i === F.yoursColor}
        />
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Secondary still={still} onClick={() => dispatch({ type: "RESET_THREAD" })} icon={<RotateCcw size={14} aria-hidden="true" />}>
            Replay
          </Secondary>
          <Primary type="submit" still={still} pressed={pressed} target="make-live" icon={<Rocket size={14} aria-hidden="true" />}>
            Make it live
          </Primary>
        </div>
      </form>
    </>
  );
}

/**
 * The logo slot, as a mask: a square with rounded corners (pass the size and radius in
 * `className`), `overflow: hidden`, and no background, so a transparent PNG stays transparent,
 * a round logo shows as a circle, and a square image gets its corners rounded. The image sits
 * inside with `object-fit: contain`. With no logo, the brand-color square with the monogram.
 */
function LogoMark({ logo, color, name, className = "" }: { logo: Logo; color: string; name: string; className?: string }) {
  return (
    <span aria-hidden="true" className={`grid aspect-square shrink-0 place-items-center overflow-hidden bg-transparent ${className}`}>
      {logo.kind === "upload" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo.src} alt="" className="h-full w-full object-contain" />
      ) : logo.kind === "mark" ? (
        <GeneratedMark color={color} />
      ) : (
        <span className="grid h-full w-full place-items-center font-bold text-white" style={{ background: color }}>
          {monogram(name)}
        </span>
      )}
    </span>
  );
}

/** a simple fork-and-knife mark, drawn in JSX so autoplay has a logo to drop in */
function GeneratedMark({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 224 224" className="h-full w-full" aria-hidden="true">
      <rect width="224" height="224" fill={color} />
      <g fill="none" stroke="#fff" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round">
        <path d="M74 52v34a18 18 0 0 0 36 0V52" />
        <path d="M92 52v34" />
        <path d="M92 104v68" />
        <path d="M150 52v120" />
      </g>
      <path d="M150 52c-26 24-30 62-2 86z" fill="#fff" />
    </svg>
  );
}

/**
 * The logo drop zone: one form row like the others, with a small preview at the left and a
 * link-styled prompt. Any image is accepted as is (Google's 224×224 rule is only a hint).
 */
function LogoField({
  s,
  timed,
  dispatch,
  highlight,
  tall,
  compact,
}: {
  s: State;
  timed: boolean;
  dispatch: Dispatch<Action>;
  highlight?: boolean;
  tall?: boolean;
  /** the provisioning step: the hint says the logo came from step 1 */
  compact?: boolean;
}) {
  const id = useId();
  const [drag, setDrag] = useState(false);
  const logo = s.logo;

  function load(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const src = typeof reader.result === "string" ? reader.result : "";
      if (!src) return;
      const img = new Image();
      img.onload = () =>
        dispatch({ type: "LOGO", logo: { kind: "upload", src, w: img.naturalWidth, h: img.naturalHeight, bytes: file.size, name: file.name } });
      img.src = src;
    };
    reader.readAsDataURL(file);
  }

  const prompt = drag ? "Drop it here" : logo.kind === "upload" ? "Replace or drop a file" : "Upload or drop a file";

  return (
    <div className="grid gap-1">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="label text-[10.5px]">
          Logo
        </label>
        <span id={`${id}-rule`} className="text-[10.5px] text-muted">
          {compact ? (
            <span className="inline-flex items-center gap-1 text-accent">
              <Sparkles size={11} aria-hidden="true" /> From step 1
            </span>
          ) : (
            "224×224 · PNG or JPEG"
          )}
        </span>
      </div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          load(e.dataTransfer.files[0]);
        }}
        data-row=""
        className={`${ROW} ${tall ? `${MULTI_H} px-3` : rowSize()} flex items-center gap-3 border-dashed transition-colors ${
          drag || highlight ? "border-accent bg-accent-soft/40 ring-2 ring-accent-soft" : "border-rule bg-bg"
        }`}
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={logo.kind === "upload" ? logo.src : logo.kind}
            initial={timed && !highlight ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <LogoMark logo={logo} color={s.values.color} name={s.values.agentName} className={`${tall ? "h-9 w-9 rounded-lg text-[13px]" : "h-6 w-6 rounded-md text-[11px]"}`} />
          </motion.div>
        </AnimatePresence>
        <label
          htmlFor={id}
          className={`min-w-0 truncate font-medium text-accent underline-offset-2 transition-colors duration-150 ${
            timed ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:underline"
          }`}
        >
          {prompt}
        </label>
        <input
          id={id}
          type="file"
          accept="image/*"
          className="sr-only"
          disabled={timed}
          aria-describedby={`${id}-rule`}
          onChange={(e) => {
            load(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}

/**
 * The brand color: one form row with a round swatch at the left that opens the native color
 * picker (an invisible `<input type="color">` sits over it), a subtle divider, then the hex
 * text input. Both stay in sync: typing a valid hex recolors the swatch, picking recolors the
 * text. The row draws the single focus outline for whichever input has focus.
 */
function ColorField({
  value,
  onChange,
  readOnly,
  highlight,
  tall,
}: {
  value: string;
  onChange: (hex: string) => void;
  readOnly: boolean;
  highlight?: boolean;
  tall?: boolean;
}) {
  const id = useId();
  const [draft, setDraft] = useState(value);
  const [seen, setSeen] = useState(value);
  if (value !== seen) {
    setSeen(value);
    setDraft(value);
  }

  function commit(raw: string) {
    setDraft(raw);
    const hex = normalizeHex(raw);
    if (hex) onChange(hex);
  }

  const swatch = normalizeHex(value) ?? AGENT.defaultColor;

  return (
    <div className="grid gap-1">
      <label htmlFor={id} className="label text-[10.5px]">
        Brand color
      </label>
      <div
        data-row=""
        className={`${ROW} ${rowSize(tall)} flex items-center gap-2.5 bg-bg transition-colors ${
          highlight ? "border-accent ring-2 ring-accent-soft" : "border-rule"
        }`}
      >
        <span
          data-control=""
          className={`relative shrink-0 rounded-full shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--ink)_18%,transparent)] transition-[background] duration-150 ${
            tall ? "h-7 w-7" : "h-6 w-6"
          }`}
          style={{ background: swatch }}
        >
          <input
            type="color"
            aria-label="Pick a brand color"
            value={swatch.toLowerCase()}
            onChange={(e) => commit(e.target.value)}
            disabled={readOnly}
            className="absolute inset-0 h-full w-full cursor-pointer rounded-full opacity-0 disabled:cursor-not-allowed"
          />
        </span>
        <span aria-hidden="true" className="h-5 w-px shrink-0 bg-rule" />
        <input
          id={id}
          type="text"
          aria-label="Brand color hex"
          value={draft}
          onChange={(e) => commit(e.target.value)}
          readOnly={readOnly}
          maxLength={7}
          spellCheck={false}
          autoComplete="off"
          className="num min-w-0 flex-1 bg-transparent uppercase outline-none"
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ 2. sign up */

function SignUp({ s, timed, still, dispatch }: PanelProps) {
  const go = (i: number) => dispatch({ type: "GOTO", i });
  return (
    <>
      <div>
        <h3 className="text-[clamp(18px,2vw,22px)] font-bold text-ink">Save {s.values.agentName.trim() || "your agent"}.</h3>
        <p className="mt-1.5 text-[13.5px] text-body">An account keeps your agent while we set it up.</p>
      </div>
      {s.i === F.signupSuccess ? (
        <Success title={SIGNUP_SUCCESS.title} body={SIGNUP_SUCCESS.body} still={still} />
      ) : (
        <form
          className="grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            go(F.signupSuccess);
          }}
        >
          <Field s={s} timed={timed} dispatch={dispatch} field="name" label="Name" />
          <Field s={s} timed={timed} dispatch={dispatch} field="email" label="Work email" type="email" />
          <Field s={s} timed={timed} dispatch={dispatch} field="password" label="Password" type="password" />
          <div className="flex justify-end">
            <Primary type="submit" still={still} target="create-account">
              Create account
            </Primary>
          </div>
        </form>
      )}
    </>
  );
}

/* ---------------------------------------------------------- 3. provision */

function Provision({ s, timed, still, dispatch }: PanelProps) {
  const step = FRAMES[s.i].step;
  const go = (i: number) => dispatch({ type: "GOTO", i });
  const status: Status = step === "submitted" ? STATUS.submitted : STATUS.draft;
  const stepAt = PROVISION_STEPS.findIndex((p) => p.step === step);
  const StepIcon = PROVISION_STEPS[Math.max(stepAt, 0)].icon;
  const optIn = shown(s, timed, "optIn");
  const invalid = s.i === F.campaignInvalid;

  function submitCampaign() {
    if (!optIn) go(F.campaignInvalid);
    else go(F.submitted);
  }

  return (
    <>
      <div className="grid gap-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="label">Provisioning</div>
          <StatusPill status={status} />
        </div>
        {stepAt >= 0 ? (
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
              <StepIcon size={16} aria-hidden="true" />
            </span>
            <span className="text-[15px] font-semibold text-ink">{STEP_LABELS[step]}</span>
            <span className="ml-auto text-[12px] text-muted">
              Step {stepAt + 1} of {PROVISION_STEPS.length}
            </span>
          </div>
        ) : (
          <div className="truncate text-[15px] font-semibold text-ink">{s.values.agentName}</div>
        )}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={still ? false : { opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={still ? undefined : { opacity: 0, x: -10 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="grid gap-3"
        >
          {step === "brand" && (
            <form
              className="grid gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                go(F.agent);
              }}
            >
              <p className="text-[12.5px] text-muted">The company behind the agent.</p>
              <Field s={s} timed={timed} dispatch={dispatch} field="legalName" label="Legal name" />
              <Field
                s={s}
                timed={timed}
                dispatch={dispatch}
                field="website"
                label="Website"
                hint={
                  shown(s, timed, "website") ? (
                    <span className="inline-flex items-center gap-1 text-accent">
                      <Sparkles size={12} aria-hidden="true" /> We&apos;ll prefill the rest from this site.
                    </span>
                  ) : undefined
                }
              />
              <Field s={s} timed={timed} dispatch={dispatch} field="contact" label="Contact email" type="email" />
              <div className="flex justify-end">
                <Primary type="submit" still={still} target="continue">
                  Continue
                </Primary>
              </div>
            </form>
          )}

          {step === "agent" && (
            <form
              className="grid gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                go(F.campaign);
              }}
            >
              <p className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 text-[12px] text-ink">
                <Sparkles size={12} aria-hidden="true" className="text-accent" />
                Prefilled from step 1 and {s.values.website}. Check it and continue.
              </p>
              <Field s={s} timed={timed} dispatch={dispatch} field="agentName" label="Display name" maxLength={MAX.name} />
              <LogoField s={s} timed={timed} dispatch={dispatch} compact />
              <ColorField value={s.values.color} onChange={(v) => dispatch({ type: "SET", field: "color", value: v })} readOnly={timed} />
              <Field s={s} timed={timed} dispatch={dispatch} field="description" label="Description" multiline maxLength={MAX.description} />
              <div className="flex justify-end">
                <Primary type="submit" still={still} target="continue">
                  Continue
                </Primary>
              </div>
            </form>
          )}

          {step === "campaign" && (
            <form
              className="grid gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                submitCampaign();
              }}
            >
              <p className="text-[12.5px] text-muted">The promise to carriers: what you&apos;ll send and to whom.</p>
              <Field s={s} timed={timed} dispatch={dispatch} field="useCase" label="Use case" options={OPTIONS.useCases} />
              <Field s={s} timed={timed} dispatch={dispatch} field="sample" label="Sample message" multiline />
              <Field
                s={s}
                timed={timed}
                dispatch={dispatch}
                field="optIn"
                label="Opt-in method"
                options={OPTIONS.optIns}
                placeholder="Choose one"
                target="opt-in"
                error={invalid ? "Choose how customers opt in. Carriers reject campaigns without one." : undefined}
                onChange={(v) => {
                  dispatch({ type: "SET", field: "optIn", value: v });
                  if (invalid) go(F.campaignFixed);
                }}
              />
              <Field
                s={s}
                timed={timed}
                dispatch={dispatch}
                field="volume"
                label="Expected volume"
                options={OPTIONS.volumes}
                tooltip="A ballpark is fine. Carriers use it to size your throughput, and you can raise it later."
                tooltipOpen={timed && s.i === F.campaign}
              />
              <div className="flex justify-end">
                <Primary type="submit" still={still} target="submit">
                  Submit for review
                </Primary>
              </div>
            </form>
          )}

          {step === "submitted" && <Timeline still={still} />}
        </motion.div>
      </AnimatePresence>
    </>
  );
}

function StatusPill({ status }: { status: Status }) {
  const cls = status === STATUS.live ? "bg-ok-soft text-ok" : status === STATUS.submitted ? "bg-warn-soft text-warn" : "bg-raised text-muted";
  return (
    <span aria-live="polite" className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ${cls}`}>
      {status === STATUS.live && <BadgeCheck size={13} aria-hidden="true" />}
      {status === STATUS.submitted && <Clock size={12} aria-hidden="true" />}
      <span className="sr-only">Status: </span>
      {status}
    </span>
  );
}

function Timeline({ still }: { still: boolean }) {
  const rows = REVIEW_TIMELINE;
  return (
    <ol className="grid gap-0" aria-label="Review timeline">
      {rows.map((r, k) => (
        <li key={r.label} className="grid grid-cols-[18px_1fr] gap-x-3">
          <span className="tl-marker" data-line={k === 0 ? "down" : k === rows.length - 1 ? "up" : undefined}>
            <span className="tl-dot" data-filled={r.state === "done" ? "true" : "false"} />
          </span>
          <div className="pb-4">
            <div className={`text-[13.5px] font-semibold ${r.state === "todo" ? "text-muted" : "text-ink"}`}>{r.label}</div>
            <div className="text-[12px] text-muted">{r.sub}</div>
            {r.state === "active" && (
              <div className="relative mt-2 h-1.5 w-40 overflow-hidden rounded-full bg-raised" aria-hidden="true">
                {still ? (
                  <div className="h-full w-1/3 rounded-full bg-accent" />
                ) : (
                  <motion.div
                    className="h-full w-1/3 rounded-full bg-accent"
                    animate={{ x: ["-100%", "300%"] }}
                    transition={{ repeat: Infinity, duration: 1.3, ease: "easeInOut" }}
                  />
                )}
              </div>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

function EndCard() {
  return (
    <div className="bubble border border-ok/40 bg-ok-soft/60 p-4">
      <div className="inline-flex items-center gap-1.5 text-[15px] font-bold text-ink">
        <BadgeCheck size={16} aria-hidden="true" className="text-ok" /> {END_CARD.title}
      </div>
      <p className="mt-1 text-[13px] text-body">{END_CARD.body}</p>
    </div>
  );
}

function Success({ title, body, still }: { title: string; body: string; still: boolean }) {
  return (
    <motion.div
      initial={still ? false : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bubble grid gap-1 border border-ok/40 bg-ok-soft/60 p-4"
      aria-live="polite"
    >
      <div className="inline-flex items-center gap-1.5 text-[15px] font-bold text-ink">
        <span className="grid h-5 w-5 place-items-center rounded-full bg-ok text-white">
          <Check size={12} aria-hidden="true" />
        </span>
        {title}
      </div>
      <p className="text-[13px] text-body">{body}</p>
    </motion.div>
  );
}

function Primary({
  children,
  onClick,
  type = "button",
  still,
  disabled,
  pressed,
  icon,
  target,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  still: boolean;
  disabled?: boolean;
  /** autoplay: show the button as if being pressed */
  pressed?: boolean;
  icon?: ReactNode;
  /** the happy-path id when this button is the thing to click next */
  target?: Target;
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      data-target={target}
      initial={still ? false : { opacity: 0 }}
      animate={{ opacity: 1, scale: pressed ? 0.96 : 1 }}
      className={`relative inline-flex w-fit items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-[13px] font-semibold text-white transition-colors duration-150 enabled:hover:bg-[color-mix(in_srgb,var(--accent)_85%,var(--ink))] disabled:cursor-not-allowed disabled:opacity-50 ${
        pressed ? "ring-4 ring-accent-soft" : ""
      }`}
    >
      {icon}
      {children}
      {!icon && <ChevronRight size={14} aria-hidden="true" />}
      {target && <HintRing id={target} />}
    </motion.button>
  );
}

/** the quiet companion to Primary, same height, for actions that do not advance the story */
function Secondary({ children, onClick, still, icon }: { children: ReactNode; onClick: () => void; still: boolean; icon?: ReactNode }) {
  return (
    <motion.button
      type="button"
      data-control=""
      onClick={onClick}
      initial={still ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      className="inline-flex w-fit items-center gap-1.5 rounded-full border border-rule bg-surface px-4 py-[7px] text-[13px] font-semibold text-ink transition-colors duration-150 hover:border-accent hover:text-accent"
    >
      {icon}
      {children}
    </motion.button>
  );
}

/* ----------------------------------------------------------------- field */

function Field({
  s,
  timed,
  dispatch,
  field,
  label,
  type = "text",
  multiline,
  options,
  placeholder,
  hint,
  error,
  tooltip,
  tooltipOpen,
  maxLength,
  tall,
  highlight,
  onChange,
  target,
}: {
  s: State;
  timed: boolean;
  dispatch: Dispatch<Action>;
  field: Field;
  label: string;
  type?: "text" | "email" | "password";
  multiline?: boolean;
  options?: readonly string[];
  placeholder?: string;
  hint?: ReactNode;
  error?: string;
  tooltip?: string;
  tooltipOpen?: boolean;
  /** Google's character limit, shown as a live counter */
  maxLength?: number;
  /** the 44 px row of the demo form (provisioning forms use the denser 36 px row) */
  tall?: boolean;
  highlight?: boolean;
  onChange?: (v: string) => void;
  /** the happy-path id when this field is the thing to use next */
  target?: Target;
}) {
  const id = useId();
  const value = shown(s, timed, field);
  const active = highlight ?? (timed && s.i === FILLED_AT[field]);
  const set = onChange ?? ((v: string) => dispatch({ type: "SET", field, value: maxLength ? v.slice(0, maxLength) : v }));
  /** focus draws one 1.5 px accent outline (HERO_CSS); the autoplay highlight is the soft ring */
  const box = `${ROW} w-full bg-bg placeholder:text-muted/70 ${
    error ? "border-warn" : active ? "border-accent ring-2 ring-accent-soft" : "border-rule"
  }`;
  const describedBy = [error ? `${id}-err` : null, hint ? `${id}-hint` : null].filter(Boolean).join(" ") || undefined;

  return (
    <div className="grid gap-1">
      <div className="flex items-center gap-1">
        <label htmlFor={id} className="label text-[10.5px]">
          {label}
        </label>
        {tooltip && (
          <span className="group relative inline-flex">
            <button
              type="button"
              data-control=""
              aria-label={`About ${label.toLowerCase()}`}
              aria-describedby={`${id}-tip`}
              className="grid h-4 w-4 place-items-center rounded-full text-muted transition-colors duration-150 hover:bg-raised hover:text-ink"
            >
              <Info size={12} aria-hidden="true" />
            </button>
            <span
              role="tooltip"
              id={`${id}-tip`}
              className={`bubble-sm pointer-events-none absolute top-full left-0 z-10 mt-1 w-56 border border-rule bg-surface px-2.5 py-1.5 text-[11.5px] normal-case tracking-normal text-body shadow-[var(--shadow)] transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 ${
                tooltipOpen ? "opacity-100" : "opacity-0"
              }`}
            >
              {tooltip}
            </span>
          </span>
        )}
        {maxLength && (
          <span className={`num ml-auto text-[10.5px] ${value.length >= maxLength ? "text-warn" : "text-muted"}`} aria-live="polite">
            <span className="sr-only">{label}: </span>
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      {options ? (
        <div className="relative bubble-sm" data-target={target}>
          <select
            id={id}
            value={value}
            onChange={(e) => set(e.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={`${box} ${rowSize(tall)} appearance-none pr-8`}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <ChevronDown size={14} aria-hidden="true" className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-muted" />
          {target && <HintRing id={target} />}
        </div>
      ) : multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => set(e.target.value)}
          readOnly={timed}
          rows={2}
          maxLength={maxLength}
          aria-describedby={describedBy}
          className={`${box} ${MULTI_H} resize-none px-2.5 py-2 leading-snug`}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => set(e.target.value)}
          readOnly={timed}
          placeholder={placeholder}
          maxLength={maxLength}
          autoComplete="off"
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`${box} ${rowSize(tall)}`}
        />
      )}
      {error && (
        <p id={`${id}-err`} role="alert" className="inline-flex items-center gap-1 text-[11.5px] text-warn">
          <CircleAlert size={12} aria-hidden="true" /> {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-[11.5px] text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------- phone */

type Msg = {
  id: string;
  from: "agent" | "user";
  kind?: "text" | "ghost" | "carousel" | "chips" | "upsell" | "confirmation" | "after-chips";
  text?: string;
  status?: BubbleStatus;
};

/** the ordering flow as a list of messages, from one thread's state at frame `i` */
function threadMessages(t: Thread, i: number, at: ThreadFrames, opener: string): { messages: Msg[]; typing: boolean } {
  const messages: Msg[] = [];
  const upsellOut = i >= at.upsell && t.deal !== null;
  const confirmedOut = i >= at.confirmed && t.addon !== null;
  if (i >= at.opener) messages.push({ id: "opener", from: "agent", text: opener });
  if (i >= at.carousel) messages.push({ id: "carousel", from: "agent", kind: "carousel" });
  if (i >= at.chips) messages.push({ id: "chips", from: "agent", kind: "chips" });
  if (t.deal !== null) messages.push({ id: "pick", from: "user", text: DEALS[t.deal].reply, status: upsellOut ? "read" : "delivered" });
  if (upsellOut) messages.push({ id: "upsell", from: "agent", kind: "upsell" });
  if (t.addon !== null)
    messages.push({ id: "answer", from: "user", text: t.addon ? PHONE_COPY.upsell.yes : PHONE_COPY.upsell.no, status: confirmedOut ? "read" : "delivered" });
  if (confirmedOut) messages.push({ id: "confirmation", from: "agent", kind: "confirmation" }, { id: "after", from: "agent", kind: "after-chips" });
  const typing = at.typing.includes(i) || (t.deal !== null && !upsellOut) || (t.addon !== null && !confirmedOut);
  return { messages, typing };
}

const noAction = () => {};

/**
 * The Android phone, built from the shared kit. Three screens:
 *  - yours and live: a Google Messages thread on the full-height conversation panel. The
 *    thread opens from the top like a new business thread: the agent intro (logo, name and
 *    badge, description, divider), the day divider, then typing, the opener, typing, the deal
 *    carousel, and the two action chips under it. A card's button sends the user's reply (right,
 *    brand color), then typing, then the upsell card; "Yes, and checkout" sends the next reply,
 *    typing, and the confirmation card with its chips. The demo banner floats over the top of
 *    the column; the column scrolls edge to edge and keeps the newest content in view; the
 *    composer is pinned under a divider.
 *  - brand and agent steps: the agent details screen, filling in as the form does
 *  - campaign and submitted: the sample message, or a ghost bubble until it exists
 */
function Phone({ s, timed, still, dispatch }: { s: State; timed: boolean; still: boolean; dispatch: Dispatch<Action> }) {
  const step = FRAMES[s.i].step;
  const mode = step === "yours" ? "yours" : step === "live" ? "live" : "preview";
  const infoScreen = step === "brand" || step === "agent";
  const reduced = useReducedMotion();
  const scroller = useRef<HTMLDivElement>(null);

  const name = s.values.agentName.trim();
  const color = normalizeHex(s.values.color) ?? AGENT.defaultColor;
  const sample = shown(s, timed, "sample");

  let messages: Msg[] = [];
  let typing = false;
  let thread: Thread = UNTAPPED;
  /** the card buttons and chips are live only while the thread waits on the viewer */
  let canPick = false;
  let canCheckout = false;

  if (mode === "yours") {
    thread = s.yours;
    ({ messages, typing } = threadMessages(thread, s.i, THREAD_FRAMES.yours, PHONE_COPY.opener));
    canPick = s.i >= F.yoursChips && thread.deal === null;
    canCheckout = s.i >= F.yoursUpsell && thread.deal !== null && thread.addon === null;
  } else if (mode === "live") {
    thread = s.live;
    ({ messages, typing } = threadMessages(thread, s.i, THREAD_FRAMES.live, s.values.sample));
    canPick = s.i === F.live && thread.deal === null;
    canCheckout = s.i === F.liveUpsell && thread.addon === null;
  } else {
    messages.push(sample ? { id: "sample", from: "agent", text: sample } : { id: "ghost", from: "agent", kind: "ghost", text: PHONE_COPY.ghost });
  }

  const headerName = name || PREFILL.fallbackName;
  const verified = mode !== "preview";
  /** the badge alone marks a verified agent; the status line only shows before it is */
  const subtitle = verified ? undefined : step === "submitted" ? PHONE_COPY.subtitle.review : PHONE_COPY.subtitle.preview;
  /** the intro's one-liner: the agent description once it exists, else the prefill it will get */
  const intro = (s.values.description || PREFILL.description(headerName)).slice(0, MAX.description);
  const logo = (size: string) => <LogoMark logo={s.logo} color={color} name={name} className={`h-full w-full ${size}`} />;
  const enter = still ? false : { opacity: 0, y: 8 };
  const deal = thread.deal !== null ? DEALS[thread.deal] : null;
  const total = deal ? deal.price + (thread.addon ? PHONE_COPY.upsell.price : 0) : 0;

  /** keep the newest content in view as the thread grows */
  const count = messages.length + (typing ? 1 : 0);
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: still || reduced ? "auto" : "smooth" });
  }, [count, mode, still, reduced]);

  if (infoScreen) {
    return (
      <AndroidPhone brandColor={color} theme="auto" fit="contain" label="Phone preview">
        <AgentInfo
          logo={logo("text-[28px]")}
          name={headerName}
          description={shown(s, timed, "description") || undefined}
          website={shown(s, timed, "website") || undefined}
          email={shown(s, timed, "contact") || undefined}
          placeholders={PHONE_COPY.info}
        />
      </AndroidPhone>
    );
  }

  const banner = mode !== "preview";

  function render(m: Msg) {
    switch (m.kind) {
      case "carousel":
        return (
          <div className="relative w-full" data-target="card-cta" data-control="">
            <RichCardCarousel
              label="This week's deals"
              bleed={PANEL_PADDING}
              cardWidth="72%"
              disabled={!canPick}
              cards={DEALS.map((d, k) => ({
                title: d.title,
                meta: money(d.price),
                description: d.text,
                mediaHeight: "short",
                suggestions: [
                  {
                    label: d.cta,
                    onSelect: canPick ? () => dispatch({ type: "TAP", deal: k, now: still }) : undefined,
                    overlay: <HintRing id="card-cta" />,
                  },
                ],
              }))}
            />
          </div>
        );
      case "chips":
        return (
          <div className="w-full" data-control="">
            {/* real actions (open a map, open the menu), inert in the prototype, and never dimmed: they stay in place after the pick */}
            <SuggestionChips label="Suggested actions" bleed={PANEL_PADDING} suggestions={PHONE_COPY.dealChips} onSelect={noAction} />
          </div>
        );
      case "upsell":
        return (
          <div className="w-[92%]" data-target="checkout" data-control="">
            <RichCard
              title={PHONE_COPY.upsell.title}
              meta={`+${money(PHONE_COPY.upsell.price)}`}
              description={PHONE_COPY.upsell.text}
              mediaHeight="short"
              disabled={!canCheckout}
              suggestions={[
                {
                  label: PHONE_COPY.upsell.yes,
                  onSelect: canCheckout ? () => dispatch({ type: "CHECKOUT", addon: true, now: still }) : undefined,
                  overlay: <HintRing id="checkout" />,
                },
                { label: PHONE_COPY.upsell.no, onSelect: canCheckout ? () => dispatch({ type: "CHECKOUT", addon: false, now: still }) : undefined },
              ]}
            />
          </div>
        );
      case "confirmation":
        return (
          <RichCard
            width="92%"
            title={PHONE_COPY.confirmation.title(PHONE_COPY.confirmation.orderNumber)}
            meta={money(total)}
            mediaHeight="short"
            description={
              <ul className="m-0 list-none p-0">
                {deal && <li>{deal.title}</li>}
                {thread.addon && <li>{PHONE_COPY.confirmation.addon}</li>}
                <li>{PHONE_COPY.confirmation.pickup}</li>
              </ul>
            }
            suggestions={[{ label: PHONE_COPY.confirmation.track, kind: "url", onSelect: noAction }]}
          />
        );
      case "after-chips":
        return (
          <div className="w-full" data-control="">
            <SuggestionChips label="Suggested replies" bleed={PANEL_PADDING} suggestions={PHONE_COPY.afterChips} onSelect={noAction} />
          </div>
        );
      default:
        return (
          <MessageBubble from={m.from} ghost={m.kind === "ghost"} status={m.status}>
            {m.text}
          </MessageBubble>
        );
    }
  }

  return (
    <AndroidPhone brandColor={color} theme="auto" fit="contain" label="Phone preview">
      <MessagesHeader logo={logo("text-[15px]")} name={headerName} verified={verified} subtitle={subtitle} />
      <ConversationPanel composer={<Composer />} banner={banner ? <DemoBanner /> : undefined}>
        {/* fills the panel edge to edge, so content clips only at the panel's top and the composer's divider */}
        <div
          ref={scroller}
          data-ph-scroller=""
          aria-live="polite"
          className="flex min-h-0 flex-1 flex-col gap-2 overflow-x-hidden overflow-y-auto"
          style={{ padding: `${banner ? BANNER_CLEARANCE : PANEL_PADDING}px ${PANEL_PADDING}px ${PANEL_PADDING}px`, scrollbarWidth: "none" }}
        >
          <ThreadIntro logo={logo("text-[28px]")} name={headerName} description={intro} verified={verified} />
          <Timestamp>{PHONE_COPY.timestamp}</Timestamp>
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={`${mode}-${m.id}`}
                initial={enter}
                animate={{ opacity: 1, y: 0 }}
                exit={still ? undefined : { opacity: 0 }}
                transition={{ duration: 0.26, ease: "easeOut" }}
                className={`flex w-full shrink-0 flex-col ${m.from === "user" ? "items-end" : "items-start"}`}
              >
                {render(m)}
              </motion.div>
            ))}
          </AnimatePresence>
          {typing && (
            <motion.div initial={enter} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="flex w-full shrink-0 flex-col items-start">
              <TypingIndicator logo={logo("text-[10px]")} />
            </motion.div>
          )}
        </div>
      </ConversationPanel>
    </AndroidPhone>
  );
}
