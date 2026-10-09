"use client";

import { createContext, useContext, useEffect, useId, useReducer, useRef, useState, type Dispatch, type MouseEvent, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useHeroFooter } from "@/components/case/HeroStage";
import { setPov } from "@/components/case/povStore";
import {
  Activity,
  BadgeCheck,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  History,
  KeyRound,
  LayoutDashboard,
  Mail,
  Monitor,
  Plus,
  RadioTower,
  RotateCcw,
  ShieldCheck,
  SkipForward,
  Sparkles,
  Table2,
} from "lucide-react";
import { BeforeDiagram, DIAGRAM, RCS_BOX, VisionDiagram, type TipHandler } from "./diagram";
import {
  ADMIN_COPY,
  AUTO_EXPAND,
  COUNTERS,
  CUSTOMER,
  DEFAULT_USE_CASE,
  DIAGRAM_TITLES,
  EMAIL,
  END_CARD,
  FRAMES,
  HALF,
  HALF_LABELS,
  HAPPY_PATH,
  POV_LABEL,
  REQUEST_FIELDS,
  SCREENS,
  STATUS,
  STEP_LABELS,
  STEP_ORDER,
  SUBMISSIONS,
  TALLY_MAX,
  USE_CASES,
  WRAP,
  type Half,
  type HappyMoment,
  type Screen,
  type ScreenIcon,
  type Status,
  type Step,
  type Submission,
  type SubmissionId,
  type Tally,
  type UseCase,
} from "./script";

/**
 * Vibes Admin hero: one self-driving story in a 16:9 stage, mock data only, frameless.
 * Journey: the old process as a diagram → a request arrives → the old way, fourteen screens
 * → the vision → the same request → Vibes Admin, one request and five submissions → live.
 *
 * Each phase draws its own card on the page ground:
 *  - before, a request, the vision: a full-stage card with the diagram; the email card floats
 *    in its corner
 *  - the old way: a narrow centered card, one mock screen at a time, a tally in its corner,
 *    then a short interstitial that sums the old way up and hands over to the vision
 *  - Vibes Admin, live: a full-stage two-pane card (the request left, submissions right)
 *
 * The two halves (HALF in script.ts): steps 1 to 3 are the before, steps 4 to 7 the after.
 * Every card opens with a BEFORE or AFTER stamp band, the page's POV badge follows the half
 * (povStore), and the before half is toned down: the card surfaces mixed toward gray and
 * everything slightly desaturated (`data-half` on the root, see HERO_CSS).
 * The card animates its size between phases with a layout spring; panes are keyed by phase
 * and only fade in (no exit gate, so a footer jump can never leave a stale pane behind).
 * Step progression, Replay, and Skip to vision belong to the stage footer (useHeroFooter).
 *
 * One state machine (a flat list of frames in script.ts) drives both modes:
 *  - interactive: the viewer advances with real controls; a few frames auto-advance (an email
 *    arriving, carriers reviewing)
 *  - autoplay: every frame advances on its own timer and the story loops
 * `HeroView` is purely presentational, so the stills render it in fixed states with no timers.
 *
 * The zoom (step 2): the diagram sits in a wrapper whose aspect ratio equals the SVG viewBox,
 * so viewBox fractions are element fractions. Zooming is one CSS transform on that wrapper:
 * the origin at the RCS lane's center, a scale that fits the lane, and a translate that moves
 * that center to the middle of the card. The rest of the diagram dims.
 *
 * The happy path (HAPPY_PATH in script.ts) names the one control to click at each moment.
 * A capture-phase click handler on the prototype root compares every click against it: a
 * click on that control, on any form control or label, or on a control marked `data-control`
 * (diagram steps, submission rows, Add buttons) passes; anything else pulses the current target.
 */

/* ---------------------------------------------------------------- style */

/**
 * Scoped CSS the Tailwind layer cannot win against the site's unlayered `:focus-visible`
 * rule: a focused select gets one 1.5 px accent outline inside its border; and the
 * happy-path pulse, two pulses of a 2 px outline in 1.2 s.
 */
const HERO_CSS =
  "[data-va-hero] :is(input,select):focus-visible{outline:1.5px solid var(--accent);outline-offset:-1px}" +
  "@keyframes va-hint{0%,100%{box-shadow:0 0 0 0 transparent}50%{box-shadow:0 0 0 2px var(--accent)}}" +
  // the before half: surfaces mixed toward the cool gray of --muted, then a touch desaturated.
  // The mixes are computed on the root (a token cannot reference itself) and applied one level down.
  "[data-va-hero]>*{transition:filter .5s ease}" +
  "[data-va-hero][data-half=before]{--va-surface:color-mix(in srgb,var(--surface) 88%,var(--muted));" +
  "--va-bg:color-mix(in srgb,var(--bg) 90%,var(--muted));--va-raised:color-mix(in srgb,var(--raised) 88%,var(--muted))}" +
  "[data-va-hero][data-half=before]>*{--surface:var(--va-surface);--bg:var(--va-bg);--raised:var(--va-raised);filter:saturate(.72)}";

/** how long the happy-path pulse shows, in ms (two pulses) */
const HINT_MS = 1200;

/** the shared card chrome */
const CARD = "bubble relative overflow-hidden border border-rule bg-surface shadow-[var(--shadow)]";

/* ---------------------------------------------------------------- frames */

const at = (step: Step, phase: string) => FRAMES.findIndex((f) => f.step === step && f.phase === phase);

const F = {
  before: at("before", "diagram"),
  email: at("request", "email"),
  zoom: at("request", "zoom"),
  /** the first old-way screen; screen k is F.old + k */
  old: at("old", "s1"),
  /** the interstitial that closes the old way */
  wrap: at("old", "wrap"),
  vision: at("vision", "diagram"),
  email2: at("request2", "email"),
  draft: at("admin", "draft"),
  expand: at("admin", "expand"),
  added: at("admin", "added"),
  submitting: at("admin", "submitting"),
  reviewing: at("admin", "reviewing"),
  live: at("live", "live"),
};

const FOOTER_STEPS = STEP_ORDER.map((st) => STEP_LABELS[st]);
/** the first frame of each step, for the footer's step arrows */
const STEP_START = STEP_ORDER.map((st) => FRAMES.findIndex((f) => f.step === st));

const ALL_MISSING = SUBMISSIONS.flatMap((s) => s.missing.map((m) => m.id));

/* --------------------------------------------------------- state machine */

type State = {
  i: number;
  run: number;
  /** the submission row that is open */
  expanded: SubmissionId | null;
  /** the missing fields that have been added */
  added: string[];
  useCase: UseCase;
};

type Action =
  | { type: "NEXT" }
  | { type: "GOTO"; i: number }
  | { type: "TOGGLE"; id: SubmissionId }
  | { type: "ADD"; id: string }
  | { type: "USE_CASE"; value: UseCase }
  | { type: "RESET" };

function initial(i = 0, run = 0): State {
  return { i, run, expanded: null, added: [], useCase: DEFAULT_USE_CASE };
}

/** side effects of landing on a frame (the autoplay script) */
function enter(s: State, i: number): State {
  const f = FRAMES[i];
  const n: State = { ...s, i };
  if (f.step === "admin" && f.phase === "draft") {
    n.expanded = null;
    n.added = [];
  }
  if (f.step === "admin" && f.phase === "expand") n.expanded = AUTO_EXPAND;
  if (f.step === "admin" && (f.phase === "added" || f.phase === "submitting")) n.added = ALL_MISSING;
  return n;
}

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "NEXT":
      if (s.i >= FRAMES.length - 1) return initial(0, s.run + 1);
      return enter(s, s.i + 1);
    case "GOTO":
      return enter(s, a.i);
    case "TOGGLE":
      return { ...s, expanded: s.expanded === a.id ? null : a.id };
    case "ADD":
      return s.added.includes(a.id) ? s : { ...s, added: [...s.added, a.id] };
    case "USE_CASE":
      return { ...s, useCase: a.value };
    case "RESET":
      return initial(0, s.run + 1);
  }
}

/* --------------------------------------------------------------- the hero */

export function VibesAdminHero({ autoplay = false }: { autoplay?: boolean }) {
  const reduced = useReducedMotion();
  const [s, dispatch] = useReducer(reducer, 0, initial);
  const footer = useHeroFooter();
  const step = FRAMES[s.i].step;
  const stepIndex = STEP_ORDER.indexOf(step);

  /** steps, Replay, and Skip to vision go to the stage footer (ReducedHero publishes its own) */
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
          label: "Skip to vision",
          icon: <SkipForward size={12} aria-hidden="true" />,
          onClick: () => dispatch({ type: "GOTO", i: F.vision }),
          hidden: autoplay || stepIndex >= 3,
        },
      ],
    });
    return () => footer.set(null);
  }, [footer, reduced, stepIndex, autoplay]);

  /** the page's POV badge follows the half: "Operations · Before" in gray, "Operations · After" in blue */
  useEffect(() => {
    if (reduced) return;
    const half = HALF[step];
    setPov({ label: POV_LABEL, phase: HALF_LABELS[half], tone: half === "before" ? "muted" : "accent" });
  }, [reduced, step]);
  useEffect(() => () => setPov(null), []);

  useEffect(() => {
    if (reduced) return;
    const f = FRAMES[s.i];
    if (!(autoplay || f.auto)) return;
    const t = setTimeout(() => dispatch({ type: "NEXT" }), f.ms);
    return () => clearTimeout(t);
  }, [autoplay, reduced, s.i, s.run]);

  if (reduced) return <ReducedHero />;
  return <HeroView s={s} timed={autoplay} dispatch={dispatch} inert={autoplay} />;
}

/** reduced motion: no timers; the final state plus a step list */
function ReducedHero() {
  const footer = useHeroFooter();
  useEffect(() => {
    footer.set({ steps: FOOTER_STEPS, current: STEP_ORDER.length - 1 });
    return () => footer.set(null);
  }, [footer]);
  return (
    <HeroView
      s={still(F.live)}
      timed={false}
      still
      left={
        <div className="grid gap-4">
          <div className="label text-accent">Vibes Admin · the journey</div>
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
        </div>
      }
    />
  );
}

/* ---------------------------------------------------------------- stills */

function still(i: number, overrides: Partial<State> = {}): State {
  return { ...initial(i), added: ALL_MISSING, ...overrides };
}

export const vibesAdminStills: { render: ReactNode; caption: string }[] = [
  {
    render: <HeroView s={still(F.before)} timed still />,
    caption: "Before: Ops at the left, four sender types fanning right. RCS is 14 steps across 10 portals and an inbox.",
  },
  {
    render: <HeroView s={still(F.old + 7)} timed still />,
    caption: "The old way, screen 8 of 14: the AT&T portal. Portal 3 of 10, email 4 of 6, day 12 of 21.",
  },
  {
    render: <HeroView s={still(F.vision)} timed still />,
    caption: "The vision: one request into Vibes Admin, auto-generated submissions out, Ops reviewing from one place.",
  },
  {
    render: <HeroView s={still(F.expand, { expanded: AUTO_EXPAND, added: [] })} timed still />,
    caption: "Vibes Admin: the request on the left, one submission per third party on the right, each prefilled and mapped.",
  },
  {
    render: <HeroView s={still(F.live)} timed still />,
    caption: "Live: 1 portal, 0 emails, about 90 minutes of Ops time.",
  },
];

/* ------------------------------------------------------------ happy path */

type Target = HappyMoment["target"];
type Hint = { id: Target; nonce: number } | null;
const HintContext = createContext<Hint>(null);

/** the one control to click next, from the state; null while the story moves on its own */
function happyTarget(s: State): Target | null {
  const f = FRAMES[s.i];
  switch (f.step) {
    case "request":
      return f.phase === "email" ? "acknowledge" : "get-started";
    case "old":
      return f.phase === "wrap" ? "see-vision" : "screen-action";
    case "request2":
      return "open-admin";
    case "admin":
      return f.phase === "submitting" || f.phase === "reviewing" ? null : "submit-all";
    default:
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
function HintRing({ id }: { id: Target }) {
  const hint = useContext(HintContext);
  const reduced = useReducedMotion();
  if (!hint || hint.id !== id) return null;
  return (
    <span
      key={hint.nonce}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-[inherit]"
      style={reduced ? { boxShadow: "0 0 0 2px var(--accent)" } : { animation: `va-hint ${HINT_MS / 2}ms ease-in-out 2` }}
    />
  );
}

/* ------------------------------------------------------------------ view */

type ViewProps = {
  s: State;
  /** frame-driven state (autoplay and stills): controls are read-only */
  timed: boolean;
  /** no entrance animations, no shimmer, no layout transitions */
  still?: boolean;
  /** autoplay: controls are visible but not operable */
  inert?: boolean;
  dispatch?: Dispatch<Action>;
  /** replaces the request pane (reduced motion: the step list) */
  left?: ReactNode;
};

const noop: Dispatch<Action> = () => {};

type Group = "diagram" | "old" | "admin";
const GROUP: Record<Step, Group> = { before: "diagram", request: "diagram", old: "old", vision: "diagram", request2: "diagram", admin: "admin", live: "admin" };

function HeroView({ s, timed, still = false, inert = false, dispatch = noop, left }: ViewProps) {
  const f = FRAMES[s.i];
  const step = f.step;
  const group = GROUP[step];
  const half = HALF[step];
  const interactive = !still && !inert;
  const diagramMode = step === "before" || step === "request" ? "before" : "vision";

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

  const common = { s, timed, still, dispatch };

  return (
    <HintContext.Provider value={interactive ? hint : null}>
      <div
        inert={inert}
        className={`absolute inset-0 flex items-center justify-center p-3 md:p-4 ${still ? "bg-bg" : ""}`}
        data-step={step}
        data-half={half}
        data-va-hero=""
        onClickCapture={interactive ? onClickCapture : undefined}
      >
        <style href="va-hero" precedence="default">
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
          className={`${CARD} grid w-full grid-rows-[auto_minmax(0,1fr)] ${group === "old" ? "h-auto max-h-full max-w-[560px]" : "h-full max-w-[1040px]"}`}
        >
          <Stamp half={half} />
          {/* keyed by phase group, entrance only: no exit gate (see the note at the top) */}
          <motion.div
            key={group === "diagram" ? diagramMode : group}
            layout={still ? false : "position"}
            initial={still ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="grid min-h-0 min-w-0 grid-rows-[minmax(0,1fr)]"
          >
            {group === "diagram" && <DiagramCard mode={diagramMode} zoom={s.i === F.zoom} still={still} />}
            {group === "old" && (s.i === F.wrap ? <WrapCard {...common} /> : <OldWayCard {...common} />)}
            {group === "admin" && <AdminCard {...common} left={left} />}
          </motion.div>
        </motion.div>

        {(step === "request" || step === "request2") && <EmailCard {...common} />}
      </div>
    </HintContext.Provider>
  );
}

/* ------------------------------------------------------------------ stamp */

/** the running header on every card: BEFORE in gray on steps 1 to 3, AFTER in blue on steps 4 to 7 */
function Stamp({ half }: { half: Half }) {
  const before = half === "before";
  const Icon = before ? History : Sparkles;
  return (
    <div
      className={`flex items-center gap-1.5 border-b px-4 py-1.5 transition-colors duration-500 ${
        before ? "border-rule bg-raised text-muted" : "border-accent/30 bg-accent-soft text-accent"
      }`}
    >
      <Icon size={12} aria-hidden="true" />
      <span className={`label text-[10px] font-bold ${before ? "text-muted" : "text-accent"}`}>{HALF_LABELS[half]}</span>
      <span className="sr-only">{before ? ": the old way" : ": Vibes Admin"}</span>
    </div>
  );
}

/* --------------------------------------------------------- 1, 4. diagrams */

/** the zoom into the RCS lane: origin at its center, scale to fit it, translate it to the middle */
const ZOOM = (() => {
  const cx = (RCS_BOX.x + RCS_BOX.w / 2) / DIAGRAM.w;
  const cy = (RCS_BOX.y + RCS_BOX.h / 2) / DIAGRAM.h;
  const scale = Math.min(DIAGRAM.w / RCS_BOX.w, DIAGRAM.h / RCS_BOX.h) * 0.96;
  return { origin: `${cx * 100}% ${cy * 100}%`, scale, x: `${(0.5 - cx) * 100}%`, y: `${(0.5 - cy) * 100}%` };
})();

type Tip = { text: string; x: number; y: number; above: boolean };

function DiagramCard({ mode, zoom, still }: { mode: "before" | "vision"; zoom: boolean; still: boolean }) {
  const area = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<Tip | null>(null);
  const tipId = useId();

  /** the tooltip sits over the SVG, placed from the hovered node's on-screen box (transforms included) */
  const onTip: TipHandler = (text, el) => {
    const host = area.current;
    if (!text || !el || !host) {
      setTip(null);
      return;
    }
    const hr = host.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2 - hr.left;
    const above = r.top - hr.top > hr.height * 0.55;
    setTip({ text, x: Math.min(Math.max(cx, 124), hr.width - 124), y: above ? r.top - hr.top - 6 : r.bottom - hr.top + 6, above });
  };

  return (
    <div className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)]">
      <div className="flex items-center justify-between gap-3 border-b border-rule px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${mode === "before" ? "bg-warn-soft text-warn" : "bg-accent-soft text-accent"}`}>
            {mode === "before" ? <Mail size={13} aria-hidden="true" /> : <LayoutDashboard size={13} aria-hidden="true" />}
          </span>
          <span className="truncate text-[13px] font-semibold text-ink">{DIAGRAM_TITLES[mode]}</span>
        </div>
        <span className="hidden items-center gap-3 text-[11px] text-muted sm:flex" aria-hidden="true">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-0 w-5 border-t border-dashed border-muted" /> email
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-0 w-5 border-t border-muted" /> portal
          </span>
        </span>
      </div>

      <div ref={area} className="relative min-h-0 p-3 [container-type:size] md:p-4">
        <div className="grid h-full w-full place-items-center">
          <motion.div
            initial={false}
            animate={zoom ? { scale: ZOOM.scale, x: ZOOM.x, y: ZOOM.y } : { scale: 1, x: 0, y: 0 }}
            transition={still ? { duration: 0 } : { type: "spring", stiffness: 180, damping: 28 }}
            style={{ transformOrigin: ZOOM.origin, aspectRatio: `${DIAGRAM.w} / ${DIAGRAM.h}` }}
            className="w-[min(100%,calc(100cqh*1020/560))]"
          >
            {mode === "before" ? <BeforeDiagram onTip={onTip} zoom={zoom} /> : <VisionDiagram />}
          </motion.div>
        </div>

        {tip && (
          <div
            role="tooltip"
            id={tipId}
            className="bubble-sm pointer-events-none absolute z-10 w-[248px] border border-rule bg-surface px-3 py-2 text-[12px] leading-snug text-body shadow-[var(--shadow)]"
            style={{ left: tip.x, top: tip.y, transform: tip.above ? "translate(-50%, -100%)" : "translate(-50%, 0)" }}
          >
            {tip.text}
          </div>
        )}

        <div className="num pointer-events-none absolute right-3 bottom-3 max-w-[calc(100%-24px)] rounded-full border border-rule bg-surface/90 px-3 py-1 text-[11px] text-ink shadow-[var(--shadow)] backdrop-blur md:right-4 md:bottom-4 md:text-[12px]">
          {COUNTERS[mode]}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- 2, 5. email */

type PaneProps = { s: State; timed: boolean; still: boolean; dispatch: Dispatch<Action> };

function EmailCard({ s, still, dispatch }: PaneProps) {
  const step = FRAMES[s.i].step;
  const acknowledged = s.i === F.zoom;
  const go = (i: number) => dispatch({ type: "GOTO", i });

  return (
    <motion.div
      key={step}
      initial={still ? false : { opacity: 0, x: 48 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`${CARD} absolute right-5 bottom-10 grid w-[min(330px,calc(100%-40px))] gap-2.5 p-4 md:right-9 md:bottom-14`}
      role="dialog"
      aria-label="New email"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-warn-soft text-warn">
            <Mail size={11} aria-hidden="true" />
          </span>
          New email
        </span>
        <span className="text-[11px] text-muted">just now</span>
      </div>
      <div>
        <div className="text-[14px] font-semibold text-ink">{EMAIL.subject}</div>
        <div className="text-[12px] text-muted">From {EMAIL.from}</div>
      </div>
      <p className="text-[12.5px] text-body">{EMAIL.body}</p>
      <div className="flex items-center justify-between gap-2 pt-1">
        {step === "request" ? (
          acknowledged ? (
            <>
              <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-ok" aria-live="polite">
                <Check size={13} aria-hidden="true" /> Acknowledged
              </span>
              <Primary still={still} target="get-started" onClick={() => go(F.old)}>
                {EMAIL.getStarted}
              </Primary>
            </>
          ) : (
            <>
              <span className="text-[11.5px] text-muted">Reply within a day</span>
              <Primary still={still} target="acknowledge" onClick={() => go(F.zoom)}>
                {EMAIL.acknowledge}
              </Primary>
            </>
          )
        ) : (
          <>
            <span className="text-[11.5px] text-muted">Already a request</span>
            <Primary still={still} target="open-admin" onClick={() => go(F.draft)} icon={<LayoutDashboard size={14} aria-hidden="true" />}>
              {EMAIL.openAdmin}
            </Primary>
          </>
        )}
      </div>
    </motion.div>
  );
}

/* --------------------------------------------------------- 3. the old way */

const SCREEN_ICONS: Record<ScreenIcon, typeof Mail> = {
  mail: Mail,
  console: Monitor,
  key: KeyRound,
  shield: ShieldCheck,
  clock: Clock,
  radio: RadioTower,
  table: Table2,
  activity: Activity,
};

function tallyText(t: Tally) {
  const h = Math.floor(t.minutes / 60);
  const m = t.minutes % 60;
  return `Portal ${t.portal} of ${TALLY_MAX.portal} · Email ${t.email} of ${TALLY_MAX.email} · Day ${t.day} of ${TALLY_MAX.day} · ${h} h ${m} m of Ops time`;
}

function OldWayCard({ s, still, dispatch }: PaneProps) {
  const k = Math.min(Math.max(s.i - F.old, 0), SCREENS.length - 1);
  const screen = SCREENS[k];
  const Icon = SCREEN_ICONS[screen.icon];

  return (
    <motion.div
      key={k}
      initial={still ? false : { opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)_auto]"
    >
      <div className="flex items-center justify-between gap-3 border-b border-rule bg-raised px-4 py-2.5">
        <span className="flex min-w-0 items-center gap-2">
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-surface text-ink">
            <Icon size={13} aria-hidden="true" />
          </span>
          <span className="truncate text-[13px] font-semibold text-ink">{screen.title}</span>
        </span>
        <span className="num shrink-0 text-[11px] text-muted">
          Screen {k + 1} of {SCREENS.length}
        </span>
      </div>

      <div className="min-h-0 overflow-y-auto px-4 py-3">
        <ScreenBody screen={screen} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-rule px-4 py-2.5">
        <span className="num text-[11px] text-muted" aria-live="polite">
          {tallyText(screen.tally)}
        </span>
        <Primary still={still} target="screen-action" onClick={() => dispatch({ type: "NEXT" })}>
          {screen.action}
        </Primary>
      </div>
    </motion.div>
  );
}

/** the interstitial that closes the old way: the tally in one line, then the handover to the vision */
function WrapCard({ still, dispatch }: PaneProps) {
  return (
    <div className="grid gap-4 px-5 py-5" role="status">
      <motion.div initial={still ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }} className="flex items-start gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-raised text-muted">
          <History size={16} aria-hidden="true" />
        </span>
        <p className="text-[15px] font-semibold leading-snug text-ink">{WRAP.title}</p>
      </motion.div>
      <motion.div
        initial={still ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: still ? 0 : 0.6, duration: 0.3, ease: "easeOut" }}
        className="flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-4"
      >
        <span className="inline-flex items-center gap-2 text-[15px] font-semibold text-accent">
          <Sparkles size={16} aria-hidden="true" /> {WRAP.next}
        </span>
        <Primary still={still} target="see-vision" onClick={() => dispatch({ type: "GOTO", i: F.vision })}>
          {WRAP.action}
        </Primary>
      </motion.div>
    </div>
  );
}

/** one form row: a muted label over a bordered value */
function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="grid gap-0.5">
      <span className="label text-[9.5px]">{label}</span>
      <span className={`bubble-sm block truncate border border-rule bg-bg px-2 py-1 text-[12px] text-ink ${mono ? "num" : ""}`}>{value}</span>
    </div>
  );
}

function ScreenBody({ screen }: { screen: Screen }) {
  switch (screen.kind) {
    case "compose":
      return (
        <div className="grid gap-2">
          <Row label="To" value={screen.to ?? ""} />
          <Row label="Subject" value={screen.subject ?? ""} />
          <div className="bubble-sm grid gap-1 border border-rule bg-bg px-2.5 py-2 text-[12px] text-body">
            {screen.body?.map((line) => <p key={line}>{line}</p>)}
            <p className="text-muted">Thanks, Ops</p>
          </div>
        </div>
      );
    case "console":
      return (
        <div className="grid gap-2 sm:grid-cols-2">
          {screen.fields?.map((f, j) => <Row key={`${f.label}-${j}`} label={f.label} value={f.value} />)}
        </div>
      );
    case "portal":
      return (
        <div className="grid gap-3 sm:grid-cols-[150px_minmax(0,1fr)]">
          <div className="bubble-sm grid content-start gap-1.5 border border-rule bg-raised p-2.5">
            <span className="label text-[9.5px]">Sign in</span>
            <span className="bubble-sm block truncate border border-rule bg-surface px-2 py-1 text-[11.5px] text-ink">ops@vibes.example</span>
            <span className="bubble-sm block border border-rule bg-surface px-2 py-1 text-[11.5px] text-ink">••••••••••</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-ok">
              <Check size={12} aria-hidden="true" /> Signed in
            </span>
          </div>
          <div className="grid gap-2">{screen.fields?.map((f, j) => <Row key={`${f.label}-${j}`} label={f.label} value={f.value} mono={f.label === "API key" || f.label === "Agent ID"} />)}</div>
        </div>
      );
    case "wait":
      return (
        <div className="grid gap-3">
          <ol className="grid grid-cols-7 gap-1.5" aria-label="Days waited">
            {Array.from({ length: screen.days ?? 7 }, (_, d) => (
              <li key={d} className="bubble-sm grid place-items-center gap-0.5 border border-rule bg-bg py-2 text-[11px] text-muted">
                <span className="num">Day {d + 1}</span>
                <Check size={12} aria-hidden="true" className="text-ok" />
              </li>
            ))}
          </ol>
          {screen.body?.map((line) => (
            <p key={line} className="text-[12.5px] text-body">
              {line}
            </p>
          ))}
        </div>
      );
    case "sheet":
      return (
        <div className="bubble-sm overflow-hidden border border-rule">
          <table className="w-full border-collapse text-[11.5px]">
            <tbody>
              {screen.rows?.map((row, r) => (
                <tr key={r} className={r === 0 ? "bg-raised" : "bg-bg"}>
                  {row.map((cell, c) => (
                    <td key={c} className={`truncate border-rule px-2 py-1 ${r === 0 ? "font-semibold text-muted" : "text-ink"} ${c > 0 ? "border-l" : ""} ${r > 0 ? "border-t" : ""}`}>
                      {cell || " "}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

/* --------------------------------------------------------- 6, 7. the admin */

const PARTY_ICONS: Record<SubmissionId, typeof Mail> = { vendor: ShieldCheck, google: Monitor, verizon: RadioTower, att: RadioTower, tmobile: RadioTower };

function AdminCard({ s, timed, still, dispatch, left }: PaneProps & { left?: ReactNode }) {
  const f = FRAMES[s.i];
  const phase = f.step === "live" ? "live" : f.phase;
  const submitted = phase === "submitting" || phase === "reviewing";
  const live = phase === "live";
  const requestStatus: Status = live ? STATUS.live : submitted ? STATUS.submitted : STATUS.draft;
  const canSubmit = !submitted && !live;
  const go = (i: number) => dispatch({ type: "GOTO", i });
  const selectId = useId();

  return (
    <div className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)]">
      <div className="flex items-center justify-between gap-3 border-b border-rule px-4 py-2.5">
        <span className="flex min-w-0 items-center gap-2 text-[12.5px] text-muted">
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent text-white">
            <LayoutDashboard size={13} aria-hidden="true" />
          </span>
          <span className="font-semibold text-ink">{ADMIN_COPY.product}</span>
          <ChevronRight size={12} aria-hidden="true" className="shrink-0" />
          <span className="hidden sm:inline">{ADMIN_COPY.crumb}</span>
          <ChevronRight size={12} aria-hidden="true" className="hidden shrink-0 sm:inline" />
          <span className="truncate">{CUSTOMER.name}</span>
        </span>
        <StatusPill status={requestStatus} />
      </div>

      <div className="grid min-h-0 grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* the request: the master record */}
        <div className="hidden min-h-0 flex-col gap-3 overflow-y-auto border-rule px-4 py-4 md:flex md:border-r">
          {left ?? (
            <>
              <div>
                <div className="label">Request</div>
                <div className="text-[15px] font-semibold text-ink">{ADMIN_COPY.requestTitle}</div>
              </div>
              <div className="grid gap-2">
                {REQUEST_FIELDS.map((r) => (
                  <Row key={r.label} label={r.label} value={r.value} />
                ))}
                <div className="grid gap-0.5">
                  <label htmlFor={selectId} className="label text-[9.5px]">
                    Use case
                  </label>
                  <div className="relative">
                    <select
                      id={selectId}
                      value={s.useCase}
                      disabled={timed || !canSubmit}
                      onChange={(e) => dispatch({ type: "USE_CASE", value: e.target.value as UseCase })}
                      className="bubble-sm w-full appearance-none border border-rule bg-bg px-2 py-1 pr-7 text-[12px] text-ink disabled:opacity-100"
                    >
                      {USE_CASES.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={13} aria-hidden="true" className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-muted" />
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10.5px] text-accent">
                    <Sparkles size={11} aria-hidden="true" /> Mapped into every submission on the right.
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* the submissions: one per third party */}
        <div className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)_auto]">
          <div className="flex items-center justify-between gap-2 px-4 pt-3 pb-2">
            <span className="label">{ADMIN_COPY.submissions}</span>
            <span className="num text-[11px] text-muted">{SUBMISSIONS.length} third parties</span>
          </div>
          <ul className="min-h-0 overflow-y-auto border-t border-rule">
            {SUBMISSIONS.map((sub, k) => (
              <SubmissionRow
                key={sub.id}
                sub={sub}
                index={k}
                open={s.expanded === sub.id}
                added={s.added}
                useCase={s.useCase}
                phase={phase}
                timed={timed}
                still={still}
                dispatch={dispatch}
              />
            ))}
          </ul>
          <div className="flex items-center justify-between gap-3 border-t border-rule px-4 py-2.5">
            {live ? (
              <EndCard still={still} />
            ) : submitted ? (
              <Reviewing still={still} active={phase === "reviewing"} />
            ) : (
              <>
                <span className="text-[11.5px] text-muted">{ALL_MISSING.filter((id) => !s.added.includes(id)).length || "No"} fields left to add</span>
                <Primary still={still} target="submit-all" onClick={() => go(F.submitting)}>
                  {ADMIN_COPY.submitAll}
                </Primary>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SubmissionRow({
  sub,
  index,
  open,
  added,
  useCase,
  phase,
  timed,
  still,
  dispatch,
}: {
  sub: Submission;
  index: number;
  open: boolean;
  added: string[];
  useCase: UseCase;
  phase: string;
  timed: boolean;
  still: boolean;
  dispatch: Dispatch<Action>;
}) {
  const Icon = PARTY_ICONS[sub.id];
  const status: Status = phase === "live" ? STATUS.live : phase === "submitting" || phase === "reviewing" ? STATUS.submitted : STATUS.draft;
  const left = sub.missing.filter((m) => !added.includes(m.id)).length;
  const panelId = `va-sub-${sub.id}`;

  return (
    <li className="border-b border-rule last:border-b-0">
      <button
        type="button"
        data-control=""
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => dispatch({ type: "TOGGLE", id: sub.id })}
        className="flex w-full items-center gap-2.5 px-4 py-2 text-left transition-colors hover:bg-raised/60"
      >
        <ChevronRight size={14} aria-hidden="true" className={`shrink-0 text-muted transition-transform ${open ? "rotate-90" : ""}`} />
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-raised text-ink">
          <Icon size={13} aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-ink">{sub.name}</span>
        {left > 0 && status === STATUS.draft && (
          <span className="num shrink-0 rounded-full bg-warn-soft px-2 py-0.5 text-[10.5px] font-semibold text-warn">
            {left} to add
          </span>
        )}
        <StatusPill status={status} small delay={phase === "submitting" && !still ? 0.18 * index : 0} />
      </button>

      {open && (
        <motion.div
          id={panelId}
          initial={still ? false : { opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="grid gap-2.5 bg-bg/60 px-4 pt-1 pb-3 pl-[52px]"
        >
          <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-accent">
            <Sparkles size={11} aria-hidden="true" /> {ADMIN_COPY.prefilled}
          </span>
          <dl className="grid gap-1 text-[12px]">
            {sub.mapped.map((m) => (
              <div key={m.label} className="grid grid-cols-[112px_minmax(0,1fr)] items-baseline gap-2">
                <dt className="truncate text-muted">{m.label}</dt>
                <dd className="truncate text-ink">{m.value}</dd>
              </div>
            ))}
            {sub.missing.map((m) => {
              const done = added.includes(m.id);
              return (
                <div key={m.id} className="grid grid-cols-[112px_minmax(0,1fr)] items-center gap-2">
                  <dt className="truncate text-muted">{m.label}</dt>
                  <dd>
                    {done ? (
                      <span className="inline-flex items-center gap-1 text-ink">
                        <Check size={12} aria-hidden="true" className="text-ok" /> {m.fill}
                      </span>
                    ) : (
                      <button
                        type="button"
                        data-control=""
                        disabled={timed}
                        onClick={() => dispatch({ type: "ADD", id: m.id })}
                        className="inline-flex items-center gap-1 rounded-full bg-warn-soft px-2 py-0.5 text-[11px] font-semibold text-warn transition-colors enabled:hover:bg-warn enabled:hover:text-white disabled:cursor-default"
                      >
                        <Plus size={11} aria-hidden="true" /> {ADMIN_COPY.add}
                      </button>
                    )}
                  </dd>
                </div>
              );
            })}
          </dl>
          {sub.useCase && <UseCaseMap sub={sub} useCase={useCase} />}
        </motion.div>
      )}
    </li>
  );
}

/** how the request's one use case lands in this party's own template */
function UseCaseMap({ sub, useCase }: { sub: Submission; useCase: UseCase }) {
  const map = sub.useCase;
  if (!map) return null;
  if (map.kind === "value") {
    return (
      <div className="grid gap-1 text-[12px]">
        <span className="text-muted">
          {ADMIN_COPY.mapsTo(useCase)} <span className="text-ink">{map.label}</span>
        </span>
        <span className="bubble-sm inline-flex w-fit items-center gap-1.5 border border-accent bg-accent-soft px-2 py-0.5 font-semibold text-ink">
          <Sparkles size={11} aria-hidden="true" className="text-accent" /> {map.value[useCase]}
        </span>
      </div>
    );
  }
  const checked = new Set(map.checked[useCase]);
  return (
    <div className="grid gap-1.5 text-[12px]">
      <span className="text-muted">
        {ADMIN_COPY.mapsTo(useCase)}{" "}
        <span className="num text-ink">
          {checked.size} of {map.options.length}
        </span>{" "}
        use cases
      </span>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-1 sm:grid-cols-3" aria-label={`${sub.name} use cases`}>
        {map.options.map((o) => {
          const on = checked.has(o);
          return (
            <li key={o} role="checkbox" aria-checked={on} className={`flex items-center gap-1.5 text-[11.5px] ${on ? "text-ink" : "text-muted"}`}>
              <span className={`grid h-3.5 w-3.5 shrink-0 place-items-center rounded-[4px] border ${on ? "border-accent bg-accent text-white" : "border-rule bg-bg"}`}>
                {on && <Check size={10} aria-hidden="true" />}
              </span>
              <span className="truncate">{o}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Reviewing({ still, active }: { still: boolean; active: boolean }) {
  return (
    <div className="grid w-full gap-1.5" aria-live="polite">
      <span className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-ink">
        <Clock size={13} aria-hidden="true" className="text-warn" /> {active ? ADMIN_COPY.reviewing : "Submitting"}
      </span>
      <div className="relative h-1.5 w-full max-w-[240px] overflow-hidden rounded-full bg-raised" aria-hidden="true">
        {still || !active ? (
          <div className="h-full w-1/3 rounded-full bg-accent" />
        ) : (
          <motion.div className="h-full w-1/3 rounded-full bg-accent" animate={{ x: ["-100%", "300%"] }} transition={{ repeat: Infinity, duration: 1.3, ease: "easeInOut" }} />
        )}
      </div>
    </div>
  );
}

function StatusPill({ status, small, delay = 0 }: { status: Status; small?: boolean; delay?: number }) {
  const cls = status === STATUS.live ? "bg-ok-soft text-ok" : status === STATUS.submitted ? "bg-warn-soft text-warn" : "bg-raised text-muted";
  return (
    <motion.span
      key={status}
      initial={delay ? { opacity: 0, scale: 0.8 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.2 }}
      aria-live="polite"
      className={`inline-flex shrink-0 items-center gap-1 rounded-full font-semibold ${small ? "px-2 py-0.5 text-[10.5px]" : "px-2.5 py-0.5 text-[11.5px]"} ${cls}`}
    >
      {status === STATUS.live && <BadgeCheck size={small ? 12 : 13} aria-hidden="true" />}
      {status === STATUS.submitted && <Clock size={small ? 11 : 12} aria-hidden="true" />}
      <span className="sr-only">Status: </span>
      {status}
    </motion.span>
  );
}

function EndCard({ still }: { still: boolean }) {
  return (
    <motion.div
      initial={still ? false : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bubble w-full border border-ok/40 bg-ok-soft/60 px-4 py-3"
      aria-live="polite"
    >
      <div className="inline-flex items-center gap-1.5 text-[15px] font-bold text-ink">
        <BadgeCheck size={16} aria-hidden="true" className="text-ok" /> {END_CARD.title}
      </div>
      <p className="mt-0.5 text-[13px] text-body">{END_CARD.body}</p>
    </motion.div>
  );
}

function Primary({
  children,
  onClick,
  still,
  icon,
  target,
}: {
  children: ReactNode;
  onClick: () => void;
  still: boolean;
  icon?: ReactNode;
  /** the happy-path id when this button is the thing to click next */
  target: Target;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      data-target={target}
      initial={still ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-[13px] font-semibold text-white transition-colors duration-150 hover:bg-[color-mix(in_srgb,var(--accent)_85%,var(--ink))]"
    >
      {icon}
      {children}
      {!icon && <ChevronRight size={14} aria-hidden="true" />}
      <HintRing id={target} />
    </motion.button>
  );
}
