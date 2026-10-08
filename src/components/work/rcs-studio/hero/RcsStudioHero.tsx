"use client";

import { useEffect, useId, useReducer, useState, type Dispatch, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useHeroFooter } from "@/components/case/HeroStage";
import {
  AgentInfo,
  AndroidPhone,
  Composer,
  ConversationPanel,
  DemoBanner,
  MessageBubble,
  MessagesHeader,
  PANEL_PADDING,
  RichCard,
  SuggestionChips,
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
  LIVE_CHIPS,
  OPTIONS,
  PHONE_COPY,
  PREFILL,
  REVIEW_TIMELINE,
  SIGNUP_SUCCESS,
  STATUS,
  STEP_LABELS,
  YOURS_CHIPS,
  type Chip,
  type Field,
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
 * suggested-reply labels 25. The logo hint says 224×224 PNG or JPEG; any image is accepted.
 *
 * All demo copy and timings (the agent, the chips and replies, the form values, the frames)
 * live in ./script.ts so they can be edited without touching the state machine.
 */

/* ---------------------------------------------------------------- limits */

const MAX = { name: 40, description: 100 } as const;

/** one form row: every field in a form shares this border, radius, and type size */
const ROW = "bubble-sm border text-[13px] text-ink";
/** row height and padding: 44 px in the demo form, 36 px in the denser provisioning forms */
const rowSize = (tall?: boolean) => (tall ? "h-11 px-3" : "h-9 px-2.5");

/* ---------------------------------------------------------------- frames */

/** FRAMES, the copy, and the timings live in script.ts; the hero only looks frames up */
const at = (step: Step, phase: string) => FRAMES.findIndex((f) => f.step === step && f.phase === phase);

const F = {
  yours: at("yours", "idle"),
  yoursTapped: at("yours", "tap"),
  yoursReplied: at("yours", "replied"),
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
  liveReplied: at("live", "replied"),
};

const STEP_ORDER: Step[] = ["yours", "signup", "brand", "agent", "campaign", "submitted", "live"];
const FOOTER_STEPS = STEP_ORDER.map((st) => STEP_LABELS[st]);

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

type State = { i: number; chip: number | null; liveChip: number | null; values: Values; logo: Logo; run: number };
type Action =
  | { type: "NEXT" }
  | { type: "GOTO"; i: number }
  | { type: "TAP"; chip: number; now?: boolean }
  | { type: "SET"; field: Field; value: string }
  | { type: "LOGO"; logo: Logo }
  /** the form's own Replay: back to the greeting and card, chips tappable again, fields kept */
  | { type: "RESET_THREAD" }
  | { type: "RESET" };

function initial(i = 0, run = 0): State {
  return {
    i,
    chip: null,
    liveChip: null,
    values: { ...FORM_DEFAULTS },
    logo: { kind: "none" },
    run,
  };
}

/** side effects of landing on a frame (autoplay script and prefill) */
function enter(s: State, i: number): State {
  const f = FRAMES[i];
  const n: State = { ...s, i };
  if (f.step === "yours" && f.phase === "tap" && s.chip === null) n.chip = s.run % YOURS_CHIPS.length;
  if (f.step === "yours" && f.phase === "color") n.values = { ...n.values, color: AGENT.color };
  if (f.step === "yours" && f.phase === "logo") n.logo = { kind: AGENT.logo };
  if (f.step === "signup" && f.phase === "empty") n.values = derive(n.values);
  if (f.step === "live" && !s.values.sample) n.values = derive(n.values);
  if (f.step === "live" && f.phase === "tapped" && s.liveChip === null) n.liveChip = s.run % LIVE_CHIPS.length;
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
      if (step === "yours" && s.chip === null) return { ...s, chip: a.chip, i: a.now ? F.yoursReplied : F.yoursTapped };
      if (s.i === F.live) return { ...s, liveChip: a.chip, i: a.now ? F.liveReplied : F.liveTapped };
      return s;
    }
    case "SET":
      return { ...s, values: { ...s.values, [a.field]: a.value } };
    case "LOGO":
      return { ...s, logo: a.logo };
    case "RESET_THREAD":
      if (FRAMES[s.i].step !== "yours") return s;
      return { ...s, chip: null, i: F.yours };
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
  const [liveChip, setLiveChip] = useState<number | null>(null);
  const footer = useHeroFooter();
  useEffect(() => {
    footer.set({
      steps: FOOTER_STEPS,
      current: STEP_ORDER.length - 1,
      actions: [
        {
          label: "Replay",
          icon: <RotateCcw size={12} aria-hidden="true" />,
          onClick: () => setLiveChip(null),
          hidden: liveChip === null,
        },
      ],
    });
    return () => footer.set(null);
  }, [footer, liveChip]);
  const base = initial();
  const s: State = { ...base, values: derive(base.values), i: liveChip === null ? F.live : F.liveReplied, liveChip };
  const dispatch: Dispatch<Action> = (a) => {
    if (a.type === "TAP") setLiveChip(a.chip);
    if (a.type === "RESET") setLiveChip(null);
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
    chip: 0,
    liveChip: 0,
    ...overrides,
  };
}

export const rcsStudioStills: { render: ReactNode; caption: string }[] = [
  {
    render: <HeroView s={still(F.yoursReplied)} timed still focus="phone" />,
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
    render: <HeroView s={still(F.liveReplied)} timed still focus="phone" />,
    caption: "Live: the same conversation, now from your own agent.",
  },
];

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

  return (
    <div inert={inert} className={`absolute inset-0 flex items-center justify-center p-3 md:p-4 ${still ? "bg-bg" : ""}`} data-step={step}>
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
          <Primary type="submit" still={still} pressed={pressed} icon={<Rocket size={14} aria-hidden="true" />}>
            Make it live
          </Primary>
        </div>
      </form>
    </>
  );
}

/** the logo slot: uploaded image, generated mark, or a monogram on the brand color */
function LogoMark({ logo, color, name, className = "" }: { logo: Logo; color: string; name: string; className?: string }) {
  return (
    <span aria-hidden="true" className={`grid shrink-0 place-items-center overflow-hidden bg-white ${className}`}>
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
        className={`${ROW} ${rowSize(tall)} flex items-center gap-2.5 border-dashed transition-colors has-[:focus-visible]:border-accent has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent-soft ${
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
            <LogoMark logo={logo} color={s.values.color} name={s.values.agentName} className={`${tall ? "h-7 w-7" : "h-6 w-6"} rounded-md border border-rule text-[11px]`} />
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

/** the brand color: one form row with the native swatch at the left and the hex beside it */
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

  return (
    <div className="grid gap-1">
      <label htmlFor={id} className="label text-[10.5px]">
        Brand color
      </label>
      <div
        className={`${ROW} ${rowSize(tall)} flex items-center gap-2.5 bg-bg transition-colors has-[:focus-visible]:border-accent ${
          highlight ? "border-accent ring-2 ring-accent-soft" : "border-rule"
        }`}
      >
        <input
          id={id}
          type="color"
          value={(normalizeHex(value) ?? AGENT.defaultColor).toLowerCase()}
          onChange={(e) => commit(e.target.value)}
          disabled={readOnly}
          className="h-6 w-6 shrink-0 cursor-pointer appearance-none rounded-md border-0 bg-transparent p-0 disabled:cursor-not-allowed [&::-moz-color-swatch]:rounded-md [&::-moz-color-swatch]:border-0 [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0"
        />
        <input
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
          <Primary type="submit" still={still}>
            Create account
          </Primary>
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
              <Primary type="submit" still={still}>
                Continue
              </Primary>
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
              <Primary type="submit" still={still}>
                Continue
              </Primary>
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
              <Primary type="submit" still={still}>
                Submit for review
              </Primary>
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
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  still: boolean;
  disabled?: boolean;
  /** autoplay: show the button as if being pressed */
  pressed?: boolean;
  icon?: ReactNode;
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      initial={still ? false : { opacity: 0 }}
      animate={{ opacity: 1, scale: pressed ? 0.96 : 1 }}
      className={`inline-flex w-fit items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-[13px] font-semibold text-white transition-colors duration-150 enabled:hover:bg-[color-mix(in_srgb,var(--accent)_85%,var(--ink))] disabled:cursor-not-allowed disabled:opacity-50 ${
        pressed ? "ring-4 ring-accent-soft" : ""
      }`}
    >
      {icon}
      {children}
      {!icon && <ChevronRight size={14} aria-hidden="true" />}
    </motion.button>
  );
}

/** the quiet companion to Primary, same height, for actions that do not advance the story */
function Secondary({ children, onClick, still, icon }: { children: ReactNode; onClick: () => void; still: boolean; icon?: ReactNode }) {
  return (
    <motion.button
      type="button"
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
}) {
  const id = useId();
  const value = shown(s, timed, field);
  const active = highlight ?? (timed && s.i === FILLED_AT[field]);
  const set = onChange ?? ((v: string) => dispatch({ type: "SET", field, value: maxLength ? v.slice(0, maxLength) : v }));
  const box = `${ROW} w-full bg-bg outline-none placeholder:text-muted/70 focus-visible:border-accent ${
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
        <div className="relative">
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
          className={`${box} resize-none px-2.5 py-1.5 leading-snug`}
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

type Msg = { id: string; from: "agent" | "user"; kind?: "card" | "ghost"; text: string; status?: BubbleStatus };

const CARD = PHONE_COPY.card;

/**
 * The Android phone, built from the shared kit. Three screens:
 *  - yours and live: a Google Messages thread on the full-height conversation panel: the demo
 *    banner, the greeting, a rich card, suggested replies, the tapped reply as a user bubble,
 *    the typing indicator, then the agent's answer, with the composer pinned under a divider
 *  - brand and agent steps: the agent info screen, filling in as the form does (no banner)
 *  - campaign and submitted: the sample message, or a ghost bubble until it exists
 */
function Phone({ s, timed, still, dispatch }: { s: State; timed: boolean; still: boolean; dispatch: Dispatch<Action> }) {
  const step = FRAMES[s.i].step;
  const mode = step === "yours" ? "yours" : step === "live" ? "live" : "preview";
  const infoScreen = step === "brand" || step === "agent";

  const name = s.values.agentName.trim();
  const color = normalizeHex(s.values.color) ?? AGENT.defaultColor;
  const sample = shown(s, timed, "sample");

  let messages: Msg[] = [];
  let chips: Chip[] = [];
  let chipsEnabled = false;
  let picked: number | null = null;
  let typing = false;

  if (mode === "yours") {
    const replied = s.i >= F.yoursReplied && s.chip !== null;
    messages = [
      {
        id: "greet",
        from: "agent",
        text: PHONE_COPY.greeting(name || PHONE_COPY.fallbackName),
      },
      { id: "card", from: "agent", kind: "card", text: CARD.text },
    ];
    if (s.chip !== null) messages.push({ id: "me", from: "user", text: YOURS_CHIPS[s.chip].label, status: replied ? "read" : "delivered" });
    if (replied) messages.push({ id: "reply", from: "agent", text: YOURS_CHIPS[s.chip as number].reply });
    typing = s.chip !== null && !replied;
    chips = YOURS_CHIPS;
    chipsEnabled = s.chip === null;
    picked = s.chip;
  } else if (mode === "live") {
    const tapped = s.i >= F.liveTapped && s.liveChip !== null;
    const replied = s.i >= F.liveReplied && s.liveChip !== null;
    messages = [
      { id: "greet", from: "agent", text: s.values.sample },
      { id: "card", from: "agent", kind: "card", text: CARD.text },
    ];
    if (tapped) messages.push({ id: "me", from: "user", text: LIVE_CHIPS[s.liveChip as number].label, status: replied ? "read" : "delivered" });
    if (replied) messages.push({ id: "reply", from: "agent", text: LIVE_CHIPS[s.liveChip as number].reply });
    typing = tapped && !replied;
    chips = LIVE_CHIPS;
    chipsEnabled = s.i === F.live;
    picked = s.liveChip;
  } else {
    messages = sample ? [{ id: "sample", from: "agent", text: sample }] : [{ id: "ghost", from: "agent", kind: "ghost", text: PHONE_COPY.ghost }];
  }

  const headerName = name || PREFILL.fallbackName;
  const verified = mode !== "preview";
  /** the badge alone marks a verified agent; the status line only shows before it is */
  const subtitle = verified ? undefined : step === "submitted" ? PHONE_COPY.subtitle.review : PHONE_COPY.subtitle.preview;
  const logo = (size: string) => <LogoMark logo={s.logo} color={color} name={name} className={`h-full w-full ${size}`} />;
  const enter = still ? false : { opacity: 0, y: 8 };

  return (
    <AndroidPhone brandColor={color} theme="auto" fit="contain" label="Phone preview">
      <MessagesHeader logo={logo("text-[15px]")} name={headerName} verified={verified} subtitle={subtitle} />
      {infoScreen ? (
        <AgentInfo
          logo={logo("text-[28px]")}
          name={headerName}
          description={shown(s, timed, "description") || undefined}
          website={shown(s, timed, "website") || undefined}
          email={shown(s, timed, "contact") || undefined}
        />
      ) : (
        <ConversationPanel composer={<Composer />}>
          {mode !== "preview" && <DemoBanner />}
          <div className="flex min-h-0 flex-1 flex-col justify-end gap-2 overflow-hidden" aria-live="polite">
            <Timestamp>{PHONE_COPY.timestamp}</Timestamp>
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={`${mode}-${m.id}`}
                  initial={enter}
                  animate={{ opacity: 1, y: 0 }}
                  exit={still ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.26, ease: "easeOut" }}
                  className={`flex w-full flex-col ${m.from === "user" ? "items-end" : "items-start"}`}
                >
                  {m.kind === "card" ? (
                    <RichCard title={CARD.title} meta={CARD.meta} description={m.text} mediaHeight="short" width="86%" />
                  ) : (
                    <MessageBubble from={m.from} ghost={m.kind === "ghost"} status={m.status}>
                      {m.text}
                    </MessageBubble>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {typing && (
              <motion.div initial={enter} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="flex w-full flex-col items-start">
                <TypingIndicator />
              </motion.div>
            )}
          </div>
          <SuggestionChips
            label="Suggested replies"
            bleed={PANEL_PADDING}
            suggestions={chips.map((c, k) => ({ label: c.label, selected: picked === k }))}
            onSelect={(k) => dispatch({ type: "TAP", chip: k, now: still })}
            disabled={!chipsEnabled}
          />
        </ConversationPanel>
      )}
    </AndroidPhone>
  );
}
