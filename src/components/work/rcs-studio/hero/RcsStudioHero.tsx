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
  RotateCcw,
  SkipForward,
  Sparkles,
} from "lucide-react";

/**
 * RCS Studio hero: one self-driving story in a 16:9 stage, mock data only.
 * Journey: demo → sign up → provision (brand, agent, campaign) → submit → live.
 *
 * One state machine (a flat list of frames) drives both modes:
 *  - interactive: the viewer advances with real controls; a few frames auto-advance (a reply arriving)
 *  - autoplay: every frame advances on its own timer and the story loops
 * `HeroView` is purely presentational, so the stills render it in fixed states with no timers.
 */

/* ---------------------------------------------------------------- frames */

type Step = "demo" | "signup" | "brand" | "agent" | "campaign" | "submitted" | "live";
type Frame = { step: Step; phase: string; ms: number; auto?: boolean };

const FRAMES: Frame[] = [
  { step: "demo", phase: "greet", ms: 1200, auto: true },
  { step: "demo", phase: "card", ms: 1600, auto: true },
  { step: "demo", phase: "chips", ms: 1800 },
  { step: "demo", phase: "tapped", ms: 900, auto: true },
  { step: "demo", phase: "replied", ms: 2600 },
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
  demoChips: at("demo", "chips"),
  demoTapped: at("demo", "tapped"),
  demoReplied: at("demo", "replied"),
  signup: at("signup", "password"),
  signupSuccess: at("signup", "success"),
  brand: at("brand", "contact"),
  agent: at("agent", "prefilled"),
  campaign: at("campaign", "filled"),
  campaignInvalid: at("campaign", "invalid"),
  campaignFixed: at("campaign", "fixed"),
  submitted: at("submitted", "reviewing"),
  live: at("live", "live"),
  liveTapped: at("live", "tapped"),
  liveReplied: at("live", "replied"),
};

const STEP_ORDER: Step[] = ["demo", "signup", "brand", "agent", "campaign", "submitted", "live"];
const STEP_LABELS: Record<Step, string> = {
  demo: "Try the demo",
  signup: "Sign up",
  brand: "Brand details",
  agent: "Agent details",
  campaign: "Campaign details",
  submitted: "Submit for review",
  live: "Agent live",
};

/* ------------------------------------------------------------- mock data */

type Field =
  | "name"
  | "email"
  | "password"
  | "legalName"
  | "website"
  | "contact"
  | "displayName"
  | "color"
  | "description"
  | "useCase"
  | "sample"
  | "optIn"
  | "volume";
type Values = Record<Field, string>;

const BRAND_COLORS = [
  { name: "Blue", value: "var(--accent)" },
  { name: "Terracotta", value: "#c2410c" },
  { name: "Lime", value: "#4d7c0f" },
  { name: "Plum", value: "#7e22ce" },
];

const MOCK: Values = {
  name: "Sam Rivera",
  email: "sam@poblanos.example",
  password: "burritos-2026",
  legalName: "Poblano's Mexican Grill LLC",
  website: "poblanos.example",
  contact: "sam@poblanos.example",
  displayName: "Poblano's Mexican Grill",
  color: BRAND_COLORS[1].value,
  description: "Weekly specials, pickup orders and reminders from your neighborhood taqueria.",
  useCase: "Promotions and offers",
  sample: "Hi Sam, it's Poblano's. The Tuesday Burrito Box is back this week. Reply BOX to reserve one.",
  optIn: "",
  volume: "Up to 10,000 a month",
};
const AUTO_OPT_IN = "Keyword on a web form";

const FILLED_AT: Record<Field, number> = {
  name: at("signup", "name"),
  email: at("signup", "email"),
  password: at("signup", "password"),
  legalName: at("brand", "legalName"),
  website: at("brand", "website"),
  contact: at("brand", "contact"),
  displayName: F.agent,
  color: F.agent,
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
const DEMO_CHIPS: Chip[] = [
  { label: "Order for pickup", reply: "Done. Your box will be ready Tuesday at 5:30 pm. Reply CHANGE to pick another time." },
  { label: "What's in it?", reply: "Four chicken or veggie burritos, tortilla chips and two house salsas. Feeds four." },
  { label: "Remind me Tuesday", reply: "Will do. I'll text you Tuesday morning." },
];
const LIVE_CHIPS: Chip[] = [
  { label: "BOX", reply: "Reserved. One Tuesday Burrito Box, ready at 5:30 pm. Reply CHANGE to pick another time." },
  { label: "See the menu", reply: "Here's this week's menu. Tap any item to add it to a pickup order." },
  { label: "Not this week", reply: "No problem. I'll check back next Tuesday." },
];

/* ----------------------------------------------------------- state machine */

type State = { i: number; chip: number | null; liveChip: number | null; values: Values; run: number };
type Action =
  | { type: "NEXT" }
  | { type: "GOTO"; i: number }
  | { type: "TAP"; chip: number; now?: boolean }
  | { type: "SET"; field: Field; value: string }
  | { type: "RESET" };

function initial(i = 0, run = 0): State {
  return { i, chip: null, liveChip: null, values: { ...MOCK }, run };
}

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "NEXT": {
      if (s.i >= FRAMES.length - 1) return initial(0, s.run + 1);
      const i = s.i + 1;
      return {
        ...s,
        i,
        chip: i === F.demoTapped && s.chip === null ? s.run % DEMO_CHIPS.length : s.chip,
        liveChip: i === F.liveTapped && s.liveChip === null ? s.run % LIVE_CHIPS.length : s.liveChip,
      };
    }
    case "GOTO":
      return { ...s, i: a.i };
    case "TAP":
      if (s.i === F.demoChips) return { ...s, chip: a.chip, i: a.now ? F.demoReplied : F.demoTapped };
      if (s.i === F.live) return { ...s, liveChip: a.chip, i: a.now ? F.liveReplied : F.liveTapped };
      return s;
    case "SET":
      return { ...s, values: { ...s.values, [a.field]: a.value } };
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

  if (reduced) return <ReducedHero />;
  return <HeroView s={s} timed={autoplay} dispatch={dispatch} inert={autoplay} />;
}

/** reduced motion: no timers; final state plus a step list, phone still tappable */
function ReducedHero() {
  const [liveChip, setLiveChip] = useState<number | null>(null);
  const s: State = { ...initial(), i: liveChip === null ? F.live : F.liveReplied, liveChip };
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
  return { ...initial(i), chip: 0, liveChip: 0, ...overrides };
}

export const rcsStudioStills: { render: ReactNode; caption: string }[] = [
  {
    render: <HeroView s={still(F.demoReplied)} timed still focus="phone" />,
    caption: "The demo: a verified, branded RCS conversation from Poblano's.",
  },
  {
    render: <HeroView s={still(F.agent)} timed still focus="panel" />,
    caption: "Provisioning: agent details prefilled from the website and the demo.",
  },
  {
    render: <HeroView s={still(F.campaignInvalid)} timed still focus="panel" />,
    caption: "Campaign details, the promise to carriers, with inline validation.",
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
  /** no entrance animations, no shimmer */
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
  const hideNarrow = (col: "phone" | "panel") => (focus && focus !== col ? "hidden md:grid" : "grid");
  return (
    <div
      inert={inert}
      className={`absolute inset-0 grid overflow-y-auto bg-surface md:grid-cols-[1.05fr_1fr] md:overflow-hidden ${
        focus ? "" : "grid-rows-[auto_auto] md:grid-rows-1"
      }`}
      data-step={step}
    >
      <div className={`${hideNarrow("panel")} min-h-0 grid-rows-[auto_1fr] md:overflow-y-auto`}>
        <div className="flex items-center justify-between gap-3 border-b border-rule px-4 py-2 md:px-5">
          <span className="label">RCS Studio · mock data</span>
          {!inert && !still && step !== "live" && (
            <button
              type="button"
              onClick={() => dispatch({ type: "GOTO", i: F.live })}
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11.5px] font-medium text-muted hover:bg-raised hover:text-ink"
            >
              Skip to live <SkipForward size={12} aria-hidden="true" />
            </button>
          )}
        </div>
        <div className="min-h-0 px-4 py-4 md:px-5 md:py-5">
          {left ?? <FlowPanel s={s} timed={timed} still={still} dispatch={dispatch} />}
        </div>
      </div>
      <div
        className={`${hideNarrow("phone")} min-h-0 place-items-center border-t border-rule bg-raised/50 p-4 md:border-t-0 md:border-l md:p-5`}
      >
        <Phone s={s} timed={timed} still={still} dispatch={dispatch} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ flow panel */

function FlowPanel({ s, timed, still, dispatch }: { s: State; timed: boolean; still: boolean; dispatch: Dispatch<Action> }) {
  const step = FRAMES[s.i].step;
  const go = (i: number) => dispatch({ type: "GOTO", i });
  const group = step === "demo" ? "demo" : step === "signup" ? "signup" : "provision";

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={group}
        initial={still ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={still ? undefined : { opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="grid gap-4"
      >
        {group === "demo" && (
          <>
            <Kicker n={1} label="Try it" />
            <div>
              <h3 className="text-[clamp(18px,2vw,24px)] font-bold text-ink">This is an RCS agent.</h3>
              <p className="mt-2 max-w-[34ch] text-[14px] text-body">
                Rich, branded, verified messaging inside the native messages app.
              </p>
            </div>
            {s.i < F.demoReplied ? (
              <p className="inline-flex items-center gap-1.5 text-[12.5px] text-muted">
                Tap a suggested reply on the phone <ChevronRight size={14} aria-hidden="true" />
              </p>
            ) : (
              <Primary onClick={() => go(F.signup)} still={still}>
                Build one for your brand
              </Primary>
            )}
          </>
        )}

        {group === "signup" && (
          <>
            <Kicker n={2} label="Sign up" />
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
        )}

        {group === "provision" && <Provision s={s} timed={timed} still={still} dispatch={dispatch} />}
      </motion.div>
    </AnimatePresence>
  );
}

function Provision({ s, timed, still, dispatch }: { s: State; timed: boolean; still: boolean; dispatch: Dispatch<Action> }) {
  const step = FRAMES[s.i].step;
  const go = (i: number) => dispatch({ type: "GOTO", i });
  const stage = step === "brand" ? 0 : step === "agent" ? 1 : step === "campaign" ? 2 : 3;
  const status = step === "submitted" ? "Submitted" : step === "live" ? "Live" : "Draft";
  const optIn = shown(s, timed, "optIn");
  const invalid = s.i === F.campaignInvalid;

  function submitCampaign() {
    if (!optIn) go(F.campaignInvalid);
    else go(F.submitted);
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="label">{stage < 3 ? `Step ${stage + 1} of 3` : "Provisioning"}</div>
          <div className="truncate text-[15px] font-semibold text-ink">{MOCK.displayName}</div>
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
                    state === "done"
                      ? "bg-ok-soft text-ok"
                      : state === "current"
                        ? "bg-accent text-white"
                        : "bg-raised text-muted"
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
                      <Sparkles size={12} aria-hidden="true" /> We&apos;ll prefill your agent from this site.
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
                Prefilled from {MOCK.website} and the demo. Check it and continue.
              </p>
              <Field s={s} timed={timed} dispatch={dispatch} field="displayName" label="Display name" />
              <div className="grid grid-cols-[auto_1fr] gap-3">
                <div>
                  <div className="label mb-1 text-[10.5px]">Logo</div>
                  <div
                    aria-hidden="true"
                    className="grid h-9 w-9 place-items-center rounded-lg text-[14px] font-bold text-white"
                    style={{ background: shown(s, timed, "color") || "var(--raised)" }}
                  >
                    {shown(s, timed, "displayName").charAt(0)}
                  </div>
                </div>
                <fieldset>
                  <legend className="label mb-1 text-[10.5px]">Brand color</legend>
                  <div className="flex h-9 items-center gap-2">
                    {BRAND_COLORS.map((c) => {
                      const selected = shown(s, timed, "color") === c.value;
                      return (
                        <button
                          key={c.name}
                          type="button"
                          aria-label={c.name}
                          aria-pressed={selected}
                          onClick={() => dispatch({ type: "SET", field: "color", value: c.value })}
                          className={`h-6 w-6 rounded-full border-2 ${selected ? "border-ink" : "border-transparent"}`}
                          style={{ background: c.value }}
                        />
                      );
                    })}
                  </div>
                </fieldset>
              </div>
              <Field s={s} timed={timed} dispatch={dispatch} field="description" label="Description" multiline />
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

          {step === "live" && (
            <div className="grid gap-3">
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
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
}

function StatusPill({ status }: { status: "Draft" | "Submitted" | "Live" }) {
  const cls =
    status === "Live"
      ? "bg-ok-soft text-ok"
      : status === "Submitted"
        ? "bg-warn-soft text-warn"
        : "bg-raised text-muted";
  return (
    <span
      aria-live="polite"
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ${cls}`}
    >
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
            <div className={`text-[13.5px] font-semibold ${r.state === "todo" ? "text-muted" : "text-ink"}`}>
              {r.label}
            </div>
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
      className="grid gap-1 rounded-xl border border-ok/40 bg-ok-soft/60 p-4"
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
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  still: boolean;
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      initial={still ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      className="inline-flex w-fit items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-[13px] font-semibold text-white hover:opacity-90"
    >
      {children} <ChevronRight size={14} aria-hidden="true" />
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
  onChange?: (v: string) => void;
}) {
  const id = useId();
  const value = shown(s, timed, field);
  const active = timed && s.i === FILLED_AT[field];
  const set = onChange ?? ((v: string) => dispatch({ type: "SET", field, value: v }));
  const box = `w-full rounded-lg border bg-bg px-2.5 text-[13px] text-ink outline-none placeholder:text-muted/70 focus-visible:border-accent ${
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
              className={`pointer-events-none absolute top-full left-0 z-10 mt-1 w-56 rounded-lg border border-rule bg-surface px-2.5 py-1.5 text-[11.5px] normal-case tracking-normal text-body shadow-[var(--shadow)] transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 ${
                tooltipOpen ? "opacity-100" : "opacity-0"
              }`}
            >
              {tooltip}
            </span>
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
  const mode = step === "demo" ? "demo" : step === "live" ? "live" : "preview";

  const displayName = shown(s, timed, "displayName");
  const color = shown(s, timed, "color");
  const sample = shown(s, timed, "sample");

  let messages: Msg[] = [];
  let chips: Chip[] = [];
  let chipsEnabled = false;
  let picked: number | null = null;

  if (mode === "demo") {
    messages = [{ id: "greet", from: "bot", text: "Hi Sam, it's Poblano's. The Tuesday Burrito Box is back this week." }];
    if (s.i >= 1) messages.push({ id: "card", from: "bot", kind: "card", text: "Four burritos, chips and two house salsas. Pickup only." });
    if (s.i >= F.demoTapped && s.chip !== null) messages.push({ id: "me", from: "me", text: DEMO_CHIPS[s.chip].label });
    if (s.i >= F.demoReplied && s.chip !== null) messages.push({ id: "reply", from: "bot", text: DEMO_CHIPS[s.chip].reply });
    chips = DEMO_CHIPS;
    chipsEnabled = s.i === F.demoChips;
    picked = s.chip;
  } else if (mode === "live") {
    messages = [
      { id: "greet", from: "bot", text: s.values.sample },
      { id: "card", from: "bot", kind: "card", text: "Four burritos, chips and two house salsas. Pickup only." },
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

  const headerName = mode === "demo" ? MOCK.displayName : displayName || "Your agent";
  const avatarColor = mode === "demo" ? "var(--accent)" : color || "var(--raised)";
  const sub =
    mode === "demo"
      ? "Verified sender"
      : mode === "live"
        ? "Verified · your agent"
        : step === "submitted"
          ? "In carrier review"
          : "Preview";

  return (
    <div className="h-[460px] max-w-full md:h-full md:max-h-[580px]" style={{ aspectRatio: "9 / 19" }}>
      <div className="flex h-full w-full flex-col rounded-[2.2rem] border-[6px] border-[#1c2433] bg-[#1c2433] shadow-[var(--shadow)]">
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.8rem] bg-bg">
          <div aria-hidden="true" className="absolute top-2 left-1/2 h-1.5 w-14 -translate-x-1/2 rounded-full bg-[#0b0f17]" />

          <div className="flex items-center gap-2.5 border-b border-rule bg-surface px-3.5 pt-5 pb-2.5">
            <span
              aria-hidden="true"
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[13px] font-bold text-white ${
                mode === "preview" && !displayName ? "border border-dashed border-rule" : ""
              }`}
              style={{ background: avatarColor }}
            >
              {headerName === "Your agent" ? "" : headerName.charAt(0)}
            </span>
            <div className="min-w-0 leading-tight">
              <div className="truncate text-[13px] font-semibold text-ink">{headerName}</div>
              <div className="flex items-center gap-1 text-[11px] text-muted" aria-live="polite">
                {mode === "live" ? (
                  <BadgeCheck size={12} aria-hidden="true" className="text-ok" />
                ) : mode === "demo" ? (
                  <BadgeCheck size={12} aria-hidden="true" className="text-accent" />
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
                        style={{
                          background: `linear-gradient(135deg, ${avatarColor} 0%, var(--accent-soft) 60%, var(--raised) 100%)`,
                        }}
                      />
                      <div className="px-3 py-2">
                        <div className="flex items-baseline justify-between gap-2">
                          <div className="text-[13px] font-semibold text-ink">Tuesday Burrito Box</div>
                          <div className="num text-[12px] font-semibold text-ink">$32</div>
                        </div>
                        <p className="mt-0.5 text-[12px] leading-snug text-body">{m.text}</p>
                      </div>
                    </div>
                  ) : m.kind === "ghost" ? (
                    <div className="bubble max-w-[85%] border border-dashed border-rule px-3 py-2 text-[12.5px] leading-snug text-muted">
                      {m.text}
                    </div>
                  ) : m.from === "me" ? (
                    <div className="bubble-me max-w-[80%] px-3 py-2 text-[12.5px] leading-snug text-white" style={{ background: avatarColor }}>
                      {m.text}
                    </div>
                  ) : (
                    <div className="bubble max-w-[85%] border border-rule bg-surface px-3 py-2 text-[12.5px] leading-snug text-ink">
                      {m.text}
                    </div>
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
                    style={{ borderColor: avatarColor, color: avatarColor }}
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
