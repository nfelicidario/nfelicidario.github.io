"use client";

import { useEffect, useId, useReducer, useState, type Dispatch, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  BadgeCheck,
  Check,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  Clock,
  Info,
  Rocket,
  RotateCcw,
  SkipForward,
  Sparkles,
  Upload,
  X,
} from "lucide-react";

/**
 * RCS Studio hero: one self-driving story in a 16:9 stage, mock data only, frameless.
 * Journey: make it yours → sign up → provision (brand, agent, campaign) → submit → live.
 *
 * Each phase draws its own card on the page ground:
 *  - make it yours, provisioning, submitted, live: a two-pane card (panel left, phone right)
 *  - sign up: a narrow centered card, no phone
 * The card animates its size between phases with a layout transition.
 *
 * One state machine (a flat list of frames) drives both modes:
 *  - interactive: the viewer advances with real controls; a few frames auto-advance (a reply arriving)
 *  - autoplay: every frame advances on its own timer and the story loops
 * `HeroView` is purely presentational, so the stills render it in fixed states with no timers.
 *
 * Google's agent limits are enforced where a field exists: display name 40, description 100,
 * suggested-reply labels 25, logo 224×224 PNG or JPEG under 50 KB, brand color 4.5:1 on white.
 */

/* ---------------------------------------------------------------- limits */

const MAX = { name: 40, description: 100, chip: 25, logoPx: 224, logoBytes: 50 * 1024, contrast: 4.5 } as const;

/* ---------------------------------------------------------------- frames */

type Step = "yours" | "signup" | "brand" | "agent" | "campaign" | "submitted" | "live";
type Frame = { step: Step; phase: string; ms: number; auto?: boolean };

const FRAMES: Frame[] = [
  { step: "yours", phase: "idle", ms: 900 },
  { step: "yours", phase: "tap", ms: 800, auto: true },
  { step: "yours", phase: "replied", ms: 1500 },
  { step: "yours", phase: "name", ms: 2600 },
  { step: "yours", phase: "color", ms: 900 },
  { step: "yours", phase: "logo", ms: 1200 },
  { step: "yours", phase: "cta", ms: 900 },
  { step: "signup", phase: "empty", ms: 700 },
  { step: "signup", phase: "name", ms: 650 },
  { step: "signup", phase: "email", ms: 650 },
  { step: "signup", phase: "password", ms: 900 },
  { step: "signup", phase: "success", ms: 1500, auto: true },
  { step: "brand", phase: "empty", ms: 600 },
  { step: "brand", phase: "legalName", ms: 700 },
  { step: "brand", phase: "website", ms: 1500 },
  { step: "brand", phase: "contact", ms: 1200 },
  { step: "agent", phase: "prefilled", ms: 3000 },
  { step: "campaign", phase: "filled", ms: 1400 },
  { step: "campaign", phase: "invalid", ms: 1500 },
  { step: "campaign", phase: "fixed", ms: 1100 },
  { step: "submitted", phase: "reviewing", ms: 2500, auto: true },
  { step: "live", phase: "live", ms: 1600 },
  { step: "live", phase: "tapped", ms: 900, auto: true },
  { step: "live", phase: "replied", ms: 3800 },
];

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
const STEP_LABELS: Record<Step, string> = {
  yours: "Make it yours",
  signup: "Sign up",
  brand: "Brand details",
  agent: "Agent details",
  campaign: "Campaign details",
  submitted: "Submit for review",
  live: "Agent live",
};

/* ------------------------------------------------------------- mock data */

type Field =
  | "agentName"
  | "color"
  | "name"
  | "email"
  | "password"
  | "legalName"
  | "website"
  | "contact"
  | "description"
  | "useCase"
  | "sample"
  | "optIn"
  | "volume";
type Values = Record<Field, string>;

type Logo =
  | { kind: "none" }
  | { kind: "mark" }
  | { kind: "upload"; src: string; w: number; h: number; bytes: number; name: string };

const DEFAULT_COLOR = "#1F4FE0";
const AUTO_NAME = "Poblano's Mexican Grill";
const AUTO_COLOR = "#C2410C";

const MOCK: Values = {
  agentName: "Nolan's Restaurant",
  color: DEFAULT_COLOR,
  name: "Sam Rivera",
  email: "",
  password: "burritos-2026",
  legalName: "",
  website: "",
  contact: "",
  description: "",
  useCase: "Promotions and offers",
  sample: "",
  optIn: "",
  volume: "Up to 10,000 a month",
};
const AUTO_OPT_IN = "Keyword on a web form";

/** fields the later steps prefill from the agent name chosen in step 1 */
function derive(v: Values): Values {
  const name = v.agentName.trim() || "Your agent";
  const site = `${slug(name) || "yourbrand"}.example`;
  return {
    ...v,
    email: `sam@${site}`,
    legalName: `${name} LLC`,
    website: site,
    contact: `sam@${site}`,
    description: `Weekly specials, pickup orders and reminders from ${name}.`.slice(0, MAX.description),
    sample: `Hi Sam, it's ${name}. The Tuesday Family Box is back this week. Reply BOX to reserve one.`,
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

const USE_CASES = ["Promotions and offers", "Order updates", "Appointment reminders", "Account alerts"];
const OPT_INS = ["Keyword on a web form", "Checkbox at checkout", "In-store sign-up", "Reply to an SMS"];
const VOLUMES = ["Up to 1,000 a month", "Up to 10,000 a month", "Up to 100,000 a month", "More than 100,000 a month"];

type Chip = { label: string; reply: string };
/** labels are capped at Google's 25 characters */
const chip = (label: string, reply: string): Chip => ({ label: label.slice(0, MAX.chip), reply });
const YOURS_CHIPS: Chip[] = [
  chip("Order for pickup", "Done. Your box will be ready Tuesday at 5:30 pm. Reply CHANGE to pick another time."),
  chip("What's in it?", "Four entrees, two sides and two house sauces. Feeds four."),
  chip("Remind me Tuesday", "Will do. I'll text you Tuesday morning."),
];
const LIVE_CHIPS: Chip[] = [
  chip("BOX", "Reserved. One Tuesday Family Box, ready at 5:30 pm. Reply CHANGE to pick another time."),
  chip("See the menu", "Here's this week's menu. Tap any item to add it to a pickup order."),
  chip("Not this week", "No problem. I'll check back next Tuesday."),
];

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

function parseHex(hex: string): [number, number, number] | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function normalizeHex(hex: string) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  return m ? `#${m[1].toUpperCase()}` : null;
}

/** WCAG 2 relative luminance → contrast ratio against white */
function contrastOnWhite(hex: string) {
  const rgb = parseHex(hex);
  if (!rgb) return 1;
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return 1.05 / (l + 0.05);
}

function kb(bytes: number) {
  return `${Math.round(bytes / 1024)} KB`;
}

/* ----------------------------------------------------------- state machine */

type State = { i: number; chip: number | null; liveChip: number | null; values: Values; logo: Logo; run: number };
type Action =
  | { type: "NEXT" }
  | { type: "GOTO"; i: number }
  | { type: "TAP"; chip: number; now?: boolean }
  | { type: "SET"; field: Field; value: string }
  | { type: "LOGO"; logo: Logo }
  | { type: "RESET" };

function initial(i = 0, run = 0): State {
  return { i, chip: null, liveChip: null, values: { ...MOCK }, logo: { kind: "none" }, run };
}

/** side effects of landing on a frame (autoplay script and prefill) */
function enter(s: State, i: number): State {
  const f = FRAMES[i];
  const n: State = { ...s, i };
  if (f.step === "yours" && f.phase === "tap" && s.chip === null) n.chip = s.run % YOURS_CHIPS.length;
  if (f.step === "yours" && f.phase === "color") n.values = { ...n.values, color: AUTO_COLOR };
  if (f.step === "yours" && f.phase === "logo") n.logo = { kind: "mark" };
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
      dispatch({ type: "SET", field: "agentName", value: AUTO_NAME.slice(0, k) });
      if (k >= AUTO_NAME.length) clearInterval(t);
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
    values: derive({ ...base.values, agentName: AUTO_NAME, color: AUTO_COLOR }),
    logo: { kind: "mark" },
    chip: 0,
    liveChip: 0,
    ...overrides,
  };
}

export const rcsStudioStills: { render: ReactNode; caption: string }[] = [
  {
    render: <HeroView s={still(F.yoursReplied)} timed still focus="phone" />,
    caption: "Make it yours: name, logo and brand color, previewed live on the phone.",
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
  const hasPhone = step !== "signup";
  const panelCls = focus === "phone" ? "hidden md:flex" : "flex";
  const phoneCls = focus === "phone" ? "grid" : "hidden md:grid";

  return (
    <div
      inert={inert}
      className={`absolute inset-0 flex items-center justify-center p-3 md:p-4 ${still ? "bg-bg" : ""}`}
      data-step={step}
    >
      <motion.div
        layout={!still}
        transition={{ layout: { type: "spring", stiffness: 260, damping: 32 } }}
        className={`bubble relative flex max-h-full w-full overflow-hidden border border-rule bg-surface shadow-[var(--shadow)] ${
          hasPhone ? "h-full max-w-[1040px]" : "h-auto max-w-[400px]"
        }`}
      >
        <motion.div
          layout={still ? false : "position"}
          className={`${panelCls} min-h-0 min-w-0 flex-1 flex-col overflow-y-auto px-4 py-4 md:px-5 md:py-5`}
        >
          <div className="min-h-0 flex-1">
            {left ?? <FlowPanel s={s} timed={timed} still={still} dispatch={dispatch} />}
          </div>
          {!inert && !still && step !== "live" && (
            <div className="pt-4">
              <button
                type="button"
                onClick={() => dispatch({ type: "GOTO", i: F.live })}
                className="inline-flex items-center gap-1 rounded-full text-[11.5px] font-medium text-muted hover:text-ink"
              >
                Skip to live <SkipForward size={12} aria-hidden="true" />
              </button>
            </div>
          )}
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
              className={`${phoneCls} min-h-0 shrink-0 place-items-center border-l border-rule bg-raised/50 p-4 md:p-5`}
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
        {group === "yours" && <MakeItYours s={s} timed={timed} still={still} dispatch={dispatch} />}
        {group === "signup" && <SignUp s={s} timed={timed} still={still} dispatch={dispatch} />}
        {group === "provision" && <Provision s={s} timed={timed} still={still} dispatch={dispatch} />}
        {group === "live" && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="label">Provisioning</div>
                <div className="truncate text-[15px] font-semibold text-ink">{s.values.agentName}</div>
              </div>
              <StatusPill status="Live" />
            </div>
            <EndCard />
            {!timed && (
              <button
                type="button"
                onClick={() => dispatch({ type: "RESET" })}
                className="inline-flex w-fit items-center gap-1.5 rounded-full border border-rule bg-surface px-3 py-1 text-[12px] font-medium text-ink hover:border-accent hover:text-accent"
              >
                <RotateCcw size={12} aria-hidden="true" /> Replay
              </button>
            )}
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

/* ------------------------------------------------------ 1. make it yours */

function MakeItYours({ s, timed, still, dispatch }: PanelProps) {
  const ctaId = useId();
  const ratio = contrastOnWhite(s.values.color);
  const pass = ratio >= MAX.contrast;
  const pressed = timed && s.i === F.yoursCta;

  return (
    <>
      <Kicker n={1} label="Make it yours" />
      <div>
        <h3 className="text-[clamp(18px,2vw,24px)] font-bold text-ink">Your brand, inside Messages.</h3>
        <p className="mt-2 max-w-[36ch] text-[14px] text-body">
          Name it, drop in a logo and pick a color. The phone updates as you go.
        </p>
      </div>
      <form
        className="grid gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (pass) dispatch({ type: "GOTO", i: F.signup });
        }}
      >
        <Field
          s={s}
          timed={timed}
          dispatch={dispatch}
          field="agentName"
          label="Agent name"
          maxLength={MAX.name}
          highlight={timed && s.i === F.yoursName}
          placeholder="What customers will see"
        />
        <LogoField s={s} timed={timed} dispatch={dispatch} highlight={timed && s.i === F.yoursLogo} />
        <ColorField
          value={s.values.color}
          onChange={(v) => dispatch({ type: "SET", field: "color", value: v })}
          readOnly={timed}
          highlight={timed && s.i === F.yoursColor}
          describeId={ctaId}
        />
        <Primary type="submit" still={still} disabled={!pass} pressed={pressed} icon={<Rocket size={14} aria-hidden="true" />} describedBy={ctaId}>
          Make it live
        </Primary>
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

function LogoField({
  s,
  timed,
  dispatch,
  highlight,
  compact,
}: {
  s: State;
  timed: boolean;
  dispatch: Dispatch<Action>;
  highlight?: boolean;
  compact?: boolean;
}) {
  const id = useId();
  const [drag, setDrag] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const logo = s.logo;

  function load(file: File | undefined) {
    if (!file) return;
    if (file.type !== "image/png" && file.type !== "image/jpeg") {
      setProblem("PNG or JPEG only.");
      return;
    }
    setProblem(null);
    const reader = new FileReader();
    reader.onload = () => {
      const src = typeof reader.result === "string" ? reader.result : "";
      if (!src) return;
      const img = new Image();
      img.onload = () =>
        dispatch({ type: "LOGO", logo: { kind: "upload", src, w: img.naturalWidth, h: img.naturalHeight, bytes: file.size, name: file.name } });
      img.onerror = () => setProblem("That file could not be read as an image.");
      img.src = src;
    };
    reader.readAsDataURL(file);
  }

  const warnings: string[] = [];
  if (logo.kind === "upload") {
    if (logo.bytes > MAX.logoBytes) warnings.push(`${kb(logo.bytes)}, over Google's 50 KB. Compress it before launch.`);
    if (logo.w !== logo.h) warnings.push(`${logo.w}×${logo.h}, not square. It will be letterboxed on white.`);
    else if (logo.w !== MAX.logoPx) warnings.push(`${logo.w}×${logo.h}. Google resizes it to 224×224.`);
  }
  const box = compact ? "h-14 w-14" : "h-22 w-22";

  return (
    <div className="grid gap-1">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="label text-[10.5px]">
          Logo
        </label>
        {logo.kind !== "none" && !timed && (
          <button
            type="button"
            onClick={() => {
              dispatch({ type: "LOGO", logo: { kind: "none" } });
              setProblem(null);
            }}
            className="inline-flex items-center gap-0.5 text-[11px] font-medium text-muted hover:text-ink"
          >
            <X size={11} aria-hidden="true" /> Remove
          </button>
        )}
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
        className={`bubble-sm flex items-center gap-3 border border-dashed p-2 transition-colors has-[:focus-visible]:border-accent has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent-soft ${
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
            <LogoMark
              logo={logo}
              color={s.values.color}
              name={s.values.agentName}
              className={`${box} bubble-sm border border-rule ${compact ? "text-[16px]" : "text-[26px]"}`}
            />
          </motion.div>
        </AnimatePresence>
        <div className="min-w-0 flex-1 text-[11.5px] leading-snug text-muted">
          <label
            htmlFor={id}
            className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-rule bg-surface px-2.5 py-1 text-[12px] font-medium text-ink hover:border-accent hover:text-accent"
          >
            <Upload size={12} aria-hidden="true" /> {logo.kind === "none" ? "Upload" : "Replace"}
          </label>
          <input
            id={id}
            type="file"
            accept="image/png,image/jpeg"
            className="sr-only"
            disabled={timed}
            aria-describedby={`${id}-rule`}
            onChange={(e) => {
              load(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
          <p id={`${id}-rule`} className="mt-1">
            {compact ? (
              <span className="inline-flex items-center gap-1 text-accent">
                <Sparkles size={11} aria-hidden="true" /> From step 1 · 224×224
              </span>
            ) : (
              <>
                {drag ? "Drop it here." : "or drop a file here."} <br />
                224×224 · PNG or JPEG · under 50 KB
              </>
            )}
          </p>
        </div>
      </div>
      <div aria-live="polite" className="grid gap-0.5">
        {problem && (
          <p role="alert" className="inline-flex items-center gap-1 text-[11.5px] text-warn">
            <CircleAlert size={12} aria-hidden="true" /> {problem}
          </p>
        )}
        {warnings.map((w) => (
          <p key={w} className="inline-flex items-start gap-1 text-[11.5px] text-warn">
            <CircleAlert size={12} aria-hidden="true" className="mt-0.5 shrink-0" /> {w}
          </p>
        ))}
      </div>
    </div>
  );
}

function ColorField({
  value,
  onChange,
  readOnly,
  highlight,
  describeId,
}: {
  value: string;
  onChange: (hex: string) => void;
  readOnly: boolean;
  highlight?: boolean;
  describeId: string;
}) {
  const id = useId();
  const [draft, setDraft] = useState(value);
  const [seen, setSeen] = useState(value);
  if (value !== seen) {
    setSeen(value);
    setDraft(value);
  }
  const ratio = contrastOnWhite(value);
  const pass = ratio >= MAX.contrast;
  const box = `bubble-sm h-9 border bg-bg text-[13px] text-ink outline-none focus-visible:border-accent ${
    highlight ? "border-accent ring-2 ring-accent-soft" : pass ? "border-rule" : "border-warn"
  }`;

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
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="color"
          value={(normalizeHex(value) ?? DEFAULT_COLOR).toLowerCase()}
          onChange={(e) => commit(e.target.value)}
          disabled={readOnly}
          aria-describedby={describeId}
          className={`${box} w-11 cursor-pointer p-1 disabled:cursor-default`}
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
          aria-invalid={pass ? undefined : true}
          aria-describedby={describeId}
          className={`${box} num w-28 px-2.5 uppercase`}
        />
      </div>
      <p
        id={describeId}
        aria-live="polite"
        className={`inline-flex items-center gap-1 text-[11.5px] ${pass ? "text-ok" : "text-warn"}`}
      >
        {pass ? <Check size={12} aria-hidden="true" /> : <CircleAlert size={12} aria-hidden="true" />}
        <span className="text-muted">On white: {MAX.contrast}:1 required ·</span> currently <span className="num">{ratio.toFixed(1)}:1</span>
        {pass ? "" : ", pick a darker color"}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------ 2. sign up */

function SignUp({ s, timed, still, dispatch }: PanelProps) {
  const go = (i: number) => dispatch({ type: "GOTO", i });
  return (
    <>
      <Kicker n={2} label="Sign up" />
      <div>
        <h3 className="text-[clamp(18px,2vw,22px)] font-bold text-ink">Save {s.values.agentName.trim() || "your agent"}.</h3>
        <p className="mt-1.5 text-[13.5px] text-body">An account keeps your agent while we set it up.</p>
      </div>
      {s.i === F.signupSuccess ? (
        <Success title="Account created" body="Setting up your workspace." still={still} />
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
  const stage = step === "brand" ? 0 : step === "agent" ? 1 : step === "campaign" ? 2 : 3;
  const status = step === "submitted" ? "Submitted" : "Draft";
  const optIn = shown(s, timed, "optIn");
  const invalid = s.i === F.campaignInvalid;
  const ratio = contrastOnWhite(s.values.color);
  const colorId = useId();

  function submitCampaign() {
    if (!optIn) go(F.campaignInvalid);
    else go(F.submitted);
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="label">{stage < 3 ? `Step ${stage + 1} of 3` : "Provisioning"}</div>
          <div className="truncate text-[15px] font-semibold text-ink">{s.values.agentName}</div>
        </div>
        <StatusPill status={status} />
      </div>

      {stage < 3 && (
        <ol className="flex items-center gap-1.5 text-[11.5px]" aria-label="Progress">
          {(["Brand", "Agent", "Campaign"] as const).map((n, k) => {
            const state = k < stage ? "done" : k === stage ? "current" : "todo";
            return (
              <li key={n} className="flex items-center gap-1.5" aria-current={state === "current" ? "step" : undefined}>
                <span
                  className={`grid h-4.5 w-4.5 place-items-center rounded-full text-[10px] font-semibold ${
                    state === "done" ? "bg-ok-soft text-ok" : state === "current" ? "bg-accent text-white" : "bg-raised text-muted"
                  }`}
                >
                  {state === "done" ? <Check size={10} aria-hidden="true" /> : k + 1}
                </span>
                <span className={state === "current" ? "font-semibold text-ink" : "text-muted"}>{n}</span>
                {k < 2 && <span aria-hidden="true" className="mx-0.5 h-px w-4 bg-rule" />}
              </li>
            );
          })}
        </ol>
      )}

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
              <ColorField
                value={s.values.color}
                onChange={(v) => dispatch({ type: "SET", field: "color", value: v })}
                readOnly={timed}
                describeId={colorId}
              />
              <Field s={s} timed={timed} dispatch={dispatch} field="description" label="Description" multiline maxLength={MAX.description} />
              <Primary type="submit" still={still} disabled={ratio < MAX.contrast}>
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
              <Field s={s} timed={timed} dispatch={dispatch} field="useCase" label="Use case" options={USE_CASES} />
              <Field s={s} timed={timed} dispatch={dispatch} field="sample" label="Sample message" multiline />
              <Field
                s={s}
                timed={timed}
                dispatch={dispatch}
                field="optIn"
                label="Opt-in method"
                options={OPT_INS}
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
                options={VOLUMES}
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

function StatusPill({ status }: { status: "Draft" | "Submitted" | "Live" }) {
  const cls = status === "Live" ? "bg-ok-soft text-ok" : status === "Submitted" ? "bg-warn-soft text-warn" : "bg-raised text-muted";
  return (
    <span aria-live="polite" className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ${cls}`}>
      {status === "Live" && <BadgeCheck size={13} aria-hidden="true" />}
      {status === "Submitted" && <Clock size={12} aria-hidden="true" />}
      <span className="sr-only">Status: </span>
      {status}
    </span>
  );
}

function Timeline({ still }: { still: boolean }) {
  const rows = [
    { label: "Submitted", sub: "Just now", state: "done" },
    { label: "Reviewing", sub: "Carriers verify the brand and campaign", state: "active" },
    { label: "Live", sub: "Usually one to three weeks", state: "todo" },
  ] as const;
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
        <BadgeCheck size={16} aria-hidden="true" className="text-ok" /> Agent live.
      </div>
      <p className="mt-1 text-[13px] text-body">Average time to provision: one to three weeks.</p>
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

function Kicker({ n, label }: { n: number; label: string }) {
  return (
    <div className="label text-accent">
      Step {n} · {label}
    </div>
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
  describedBy,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  still: boolean;
  disabled?: boolean;
  /** autoplay: show the button as if being pressed */
  pressed?: boolean;
  icon?: ReactNode;
  describedBy?: string;
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      aria-describedby={describedBy}
      initial={still ? false : { opacity: 0 }}
      animate={{ opacity: 1, scale: pressed ? 0.96 : 1 }}
      className={`inline-flex w-fit items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-[13px] font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 ${
        pressed ? "ring-4 ring-accent-soft" : ""
      }`}
    >
      {icon}
      {children}
      {!icon && <ChevronRight size={14} aria-hidden="true" />}
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
  highlight?: boolean;
  onChange?: (v: string) => void;
}) {
  const id = useId();
  const value = shown(s, timed, field);
  const active = highlight ?? (timed && s.i === FILLED_AT[field]);
  const set = onChange ?? ((v: string) => dispatch({ type: "SET", field, value: maxLength ? v.slice(0, maxLength) : v }));
  const box = `bubble-sm w-full border bg-bg px-2.5 text-[13px] text-ink outline-none placeholder:text-muted/70 focus-visible:border-accent ${
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
              className="grid h-4 w-4 place-items-center rounded-full text-muted hover:text-ink"
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
            className={`${box} h-9 appearance-none pr-8`}
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
          className={`${box} resize-none py-1.5 leading-snug`}
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
          className={`${box} h-9`}
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

type Msg = { id: string; from: "bot" | "me"; kind?: "card" | "ghost"; text: string };

function Phone({ s, timed, still, dispatch }: { s: State; timed: boolean; still: boolean; dispatch: Dispatch<Action> }) {
  const step = FRAMES[s.i].step;
  const mode = step === "yours" ? "yours" : step === "live" ? "live" : "preview";

  const name = s.values.agentName.trim();
  const color = normalizeHex(s.values.color) ?? DEFAULT_COLOR;
  const sample = shown(s, timed, "sample");
  const cardText = "Four entrees, two sides and two house sauces. Pickup only.";

  let messages: Msg[] = [];
  let chips: Chip[] = [];
  let chipsEnabled = false;
  let picked: number | null = null;

  if (mode === "yours") {
    messages = [
      { id: "greet", from: "bot", text: `Hi Sam, it's ${name || "your agent"}. The Tuesday Family Box is back this week.` },
      { id: "card", from: "bot", kind: "card", text: cardText },
    ];
    if (s.chip !== null) messages.push({ id: "me", from: "me", text: YOURS_CHIPS[s.chip].label });
    if (s.i >= F.yoursReplied && s.chip !== null) messages.push({ id: "reply", from: "bot", text: YOURS_CHIPS[s.chip].reply });
    chips = YOURS_CHIPS;
    chipsEnabled = s.chip === null;
    picked = s.chip;
  } else if (mode === "live") {
    messages = [
      { id: "greet", from: "bot", text: s.values.sample },
      { id: "card", from: "bot", kind: "card", text: cardText },
    ];
    if (s.i >= F.liveTapped && s.liveChip !== null) messages.push({ id: "me", from: "me", text: LIVE_CHIPS[s.liveChip].label });
    if (s.i >= F.liveReplied && s.liveChip !== null) messages.push({ id: "reply", from: "bot", text: LIVE_CHIPS[s.liveChip].reply });
    chips = LIVE_CHIPS;
    chipsEnabled = s.i === F.live;
    picked = s.liveChip;
  } else {
    messages = sample
      ? [{ id: "sample", from: "bot", text: sample }]
      : [{ id: "ghost", from: "bot", kind: "ghost", text: "Your first message shows up here." }];
  }

  const headerName = name || "Your agent";
  const sub =
    mode === "yours" ? "Verified sender" : mode === "live" ? "Verified · your agent" : step === "submitted" ? "In carrier review" : "Preview";

  return (
    <div className="h-[460px] max-w-full md:h-full md:max-h-[560px]" style={{ aspectRatio: "9 / 19" }}>
      <div className="flex h-full w-full flex-col rounded-[2.2rem] border-[6px] border-[#1c2433] bg-[#1c2433] shadow-[var(--shadow)]">
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.8rem] bg-bg">
          <div aria-hidden="true" className="absolute top-2 left-1/2 h-1.5 w-14 -translate-x-1/2 rounded-full bg-[#0b0f17]" />

          <div className="flex items-center gap-2.5 border-b border-rule bg-surface px-3.5 pt-5 pb-2.5">
            <LogoMark logo={s.logo} color={color} name={name} className="h-8 w-8 rounded-lg text-[12px]" />
            <div className="min-w-0 leading-tight">
              <div className="truncate text-[13px] font-semibold text-ink">{headerName}</div>
              <div className="flex items-center gap-1 text-[11px] text-muted" aria-live="polite">
                {mode === "live" ? (
                  <BadgeCheck size={12} aria-hidden="true" className="text-ok" />
                ) : mode === "yours" ? (
                  <BadgeCheck size={12} aria-hidden="true" style={{ color }} />
                ) : step === "submitted" ? (
                  <Clock size={11} aria-hidden="true" />
                ) : null}
                {sub}
              </div>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden px-3 py-3" aria-live="polite">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={`${mode}-${m.id}`}
                  layout={!still}
                  initial={still ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={still ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.26, ease: "easeOut" }}
                  className={m.from === "me" ? "self-end" : "self-start"}
                >
                  {m.kind === "card" ? (
                    <div className="bubble w-[82%] min-w-[150px] overflow-hidden border border-rule bg-surface">
                      <div
                        aria-hidden="true"
                        className="aspect-[2/1]"
                        style={{ background: `linear-gradient(135deg, ${color} 0%, var(--accent-soft) 60%, var(--raised) 100%)` }}
                      />
                      <div className="px-3 py-2">
                        <div className="flex items-baseline justify-between gap-2">
                          <div className="text-[13px] font-semibold text-ink">Tuesday Family Box</div>
                          <div className="num text-[12px] font-semibold text-ink">$32</div>
                        </div>
                        <p className="mt-0.5 text-[12px] leading-snug text-body">{m.text}</p>
                      </div>
                    </div>
                  ) : m.kind === "ghost" ? (
                    <div className="bubble max-w-[85%] border border-dashed border-rule px-3 py-2 text-[12.5px] leading-snug text-muted">{m.text}</div>
                  ) : m.from === "me" ? (
                    <div className="bubble-me max-w-[80%] px-3 py-2 text-[12.5px] leading-snug text-white" style={{ background: color }}>
                      {m.text}
                    </div>
                  ) : (
                    <div className="bubble max-w-[85%] border border-rule bg-surface px-3 py-2 text-[12.5px] leading-snug text-ink">{m.text}</div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="border-t border-rule bg-surface px-3 pt-2 pb-3">
            <div className="label mb-1.5 text-[10px]">Suggested replies</div>
            {chips.length ? (
              <div className="flex flex-wrap gap-1.5">
                {chips.map((c, k) => (
                  <button
                    key={c.label}
                    type="button"
                    onClick={() => dispatch({ type: "TAP", chip: k, now: still })}
                    disabled={!chipsEnabled}
                    aria-pressed={picked === k}
                    className="rounded-full border px-2.5 py-1 text-[12px] font-medium transition-colors disabled:cursor-default disabled:opacity-40"
                    style={{ borderColor: color, color }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-[11.5px] text-muted">Appear once the agent is live.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
