"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  MotionConfig,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { ArrowRight, Check, ChevronRight, Info, Mail, RotateCcw } from "lucide-react";

/**
 * Hero prototype for the Provisioning case study. An abstraction with mock data:
 * a fictional restaurant's request, generic portal tiles, a generic admin surface.
 *
 *  0  Before      one email fans out to ten portals; 8 hours per request
 *  1  The shift   the tiles collapse into one admin surface; 90 minutes per request
 *  2  Customer    a guided intake submits and flips into a status row
 *  3  Measured    the end card, then loop
 *
 * One component serves the interactive and autoplay tiers; `ProvisioningFrame`
 * renders any step as a static still.
 */

type Step = 0 | 1 | 2 | 3;
type Phase = "draft" | "submitted" | "live";

export type View = {
  step: Step;
  website: string;
  phase: Phase;
  tip: boolean;
};

const VALID_SITE = "poblanos.example";
const START_SITE = "poblanos";

const portals = [
  "carrier console A",
  "carrier console B",
  "carrier console C",
  "verification vendor",
  "agent registry",
  "spreadsheet",
  "report builder",
  "customer email",
  "asset editor",
  "ticketing",
];

const queue: { name: string; kind: string; status: string; tone: string }[] = [
  { name: "Poblano's Mexican Grill", kind: "RCS agent", status: "in review", tone: "bg-accent-soft text-accent" },
  { name: "Blue Fern Florist", kind: "Toll-free", status: "submitted", tone: "bg-raised text-muted" },
  { name: "Harbor Dental", kind: "RCS agent", status: "live", tone: "bg-ok-soft text-ok" },
];

const stepNames = ["Before", "The shift", "The customer side", "Measured"] as const;

/** Autoplay script: each frame holds for `ms`, then the next one plays. Loops. */
const script: (View & { ms: number })[] = [
  { step: 0, website: START_SITE, phase: "draft", tip: false, ms: 2600 },
  { step: 1, website: START_SITE, phase: "draft", tip: false, ms: 2600 },
  { step: 2, website: START_SITE, phase: "draft", tip: false, ms: 1000 },
  { step: 2, website: VALID_SITE, phase: "draft", tip: true, ms: 1000 },
  { step: 2, website: VALID_SITE, phase: "submitted", tip: false, ms: 900 },
  { step: 2, website: VALID_SITE, phase: "live", tip: false, ms: 1100 },
  { step: 3, website: VALID_SITE, phase: "live", tip: false, ms: 2800 },
];

function websiteError(v: string): string | null {
  const ok = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/.*)?$/i.test(v.trim());
  return ok ? null : "Add the full address, like poblanos.example";
}

const ease = [0.2, 0.7, 0.2, 1] as const;

/* ------------------------------------------------------------------ */
/* Public components                                                   */
/* ------------------------------------------------------------------ */

export function ProvisioningHero({ autoplay = false }: { autoplay?: boolean }) {
  const reduce = useReducedMotion() ?? false;

  // interactive state
  const [local, setLocal] = useState<View>({ step: 0, website: START_SITE, phase: "draft", tip: false });
  // autoplay state
  const [index, setIndex] = useState(0);

  // Reduced motion: jump to the final state, no timers.
  useEffect(() => {
    if (!reduce) return;
    const t = setTimeout(() => {
      setIndex(script.length - 1);
      setLocal((v) => ({ ...v, step: 3, website: VALID_SITE, phase: "live" }));
    }, 0);
    return () => clearTimeout(t);
  }, [reduce]);

  // Autoplay clock.
  useEffect(() => {
    if (!autoplay || reduce) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % script.length), script[index].ms);
    return () => clearTimeout(t);
  }, [autoplay, reduce, index]);

  // Interactive: a submitted request goes live after a beat.
  useEffect(() => {
    if (autoplay || reduce || local.phase !== "submitted") return;
    const t = setTimeout(() => setLocal((v) => ({ ...v, phase: "live" })), 900);
    return () => clearTimeout(t);
  }, [autoplay, reduce, local.phase]);

  const view: View = autoplay ? script[index] : local;

  const goTo = (step: Step) =>
    setLocal((v) =>
      step === 0 ? { step: 0, website: START_SITE, phase: "draft", tip: false } : { ...v, step },
    );

  const handlers = autoplay
    ? undefined
    : {
        onWebsite: (website: string) => setLocal((v) => ({ ...v, website })),
        onTip: (tip: boolean) => setLocal((v) => ({ ...v, tip })),
        onSubmit: () =>
          setLocal((v) =>
            websiteError(v.website) ? v : { ...v, tip: false, phase: reduce ? "live" : "submitted" },
          ),
      };

  return (
    <MotionConfig transition={reduce ? { duration: 0 } : { duration: 0.45, ease }} reducedMotion="user">
      <Frame view={view} handlers={handlers} rolling={!reduce}>
        <Controls
          step={view.step}
          autoplay={autoplay}
          onStep={goTo}
          onNext={() => goTo(((view.step + 1) % 4) as Step)}
        />
      </Frame>
    </MotionConfig>
  );
}

/** A static still of any step, for the carousel tier. */
export function ProvisioningFrame({
  step,
  phase = "draft",
  website = START_SITE,
  tip = false,
}: {
  step: Step;
  phase?: Phase;
  website?: string;
  tip?: boolean;
}) {
  return (
    <MotionConfig transition={{ duration: 0 }}>
      <Frame view={{ step, phase, website, tip }} rolling={false} />
    </MotionConfig>
  );
}

/* ------------------------------------------------------------------ */
/* Frame: top bar, scene, optional controls                            */
/* ------------------------------------------------------------------ */

type Handlers = {
  onWebsite: (v: string) => void;
  onTip: (open: boolean) => void;
  onSubmit: () => void;
};

function Frame({
  view,
  handlers,
  rolling,
  children,
}: {
  view: View;
  handlers?: Handlers;
  rolling: boolean;
  children?: ReactNode;
}) {
  const { step } = view;
  return (
    <div className="@container absolute inset-0 grid grid-rows-[auto_1fr_auto] bg-bg text-ink">
      {/* top bar */}
      <div className="flex items-center justify-between gap-2 border-b border-rule bg-surface px-3 py-1.5 @lg:px-5 @lg:py-2.5">
        <div className="flex min-w-0 items-center gap-1.5 @lg:gap-2">
          <span className="num rounded-full bg-raised px-1.5 text-[9.5px] font-semibold text-muted @lg:text-[11px]">
            {step + 1}/4
          </span>
          <span className="truncate text-[11px] font-semibold text-ink @lg:text-[13.5px]">{stepNames[step]}</span>
        </div>
        <motion.div
          animate={{ opacity: step === 3 ? 0 : 1 }}
          className="flex items-center gap-2 text-[10px] @lg:gap-4 @lg:text-[12.5px]"
          aria-hidden={step === 3}
        >
          <AnimatePresence initial={false}>
            {step >= 1 && step < 3 && (
              <motion.span
                key="portals"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="num hidden text-body @sm:inline"
              >
                <strong className="font-semibold text-ink">10</strong> portals <ArrowRight size={11} className="inline" />{" "}
                <strong className="font-semibold text-ink">6</strong>, heading to <strong className="font-semibold text-ink">1</strong>
              </motion.span>
            )}
          </AnimatePresence>
          <span className="num text-body">
            <Effort minutes={step === 0 ? 480 : 90} rolling={rolling} /> per request
          </span>
        </motion.div>
      </div>

      {/* scene */}
      <div className="relative min-h-0 overflow-hidden">
        <AnimatePresence initial={false}>
          {step === 0 && <BeforeScene key="before" />}
          {step === 1 && <ShiftScene key="shift" />}
          {step === 2 && <IntakeScene key="intake" view={view} handlers={handlers} />}
          {step === 3 && <EndScene key="end" />}
        </AnimatePresence>
      </div>

      {children}
    </div>
  );
}

function Controls({
  step,
  autoplay,
  onStep,
  onNext,
}: {
  step: Step;
  autoplay: boolean;
  onStep: (s: Step) => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-rule bg-surface px-3 py-1.5 @lg:px-5 @lg:py-2">
      <div role={autoplay ? undefined : "group"} aria-label={autoplay ? undefined : "Steps"} className="flex items-center gap-1.5">
        {stepNames.map((name, i) => {
          const active = i === step;
          const cls = `block h-1.5 rounded-full transition-[width,background-color] ${active ? "w-5 bg-accent" : "w-1.5 bg-rule"}`;
          return autoplay ? (
            <span key={name} className={cls} aria-hidden />
          ) : (
            <button
              key={name}
              type="button"
              aria-label={`Step ${i + 1}: ${name}`}
              aria-pressed={active}
              onClick={() => onStep(i as Step)}
              className="rounded-full p-1"
            >
              <span className={cls} />
            </button>
          );
        })}
      </div>
      {autoplay ? (
        <span className="label text-[9px] @lg:text-[10.5px]">Autoplay</span>
      ) : (
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-white @lg:px-3.5 @lg:py-1.5 @lg:text-[12.5px]"
        >
          {step === 3 ? (
            <>
              Replay <RotateCcw size={12} />
            </>
          ) : (
            <>
              Next <ChevronRight size={13} />
            </>
          )}
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Counters                                                            */
/* ------------------------------------------------------------------ */

function Effort({ minutes, rolling }: { minutes: number; rolling: boolean }) {
  const mv = useMotionValue(minutes);
  const text = useTransform(mv, (v) => (v >= 120 ? `${Math.round(v / 60)} hours` : `${Math.round(v)} minutes`));
  useEffect(() => {
    // Only roll downward (the shift). Going back to the start snaps.
    if (!rolling || minutes >= mv.get()) {
      mv.set(minutes);
      return;
    }
    const c = animate(mv, minutes, { duration: 1.1, ease: "easeOut" });
    return () => c.stop();
  }, [minutes, rolling, mv]);
  return <motion.strong className="font-semibold text-ink">{text}</motion.strong>;
}

/* ------------------------------------------------------------------ */
/* Scenes                                                              */
/* ------------------------------------------------------------------ */

const sceneCls = "absolute inset-0 grid grid-cols-[auto_minmax(16px,1fr)_auto] items-center px-3 py-2 @lg:px-6 @lg:py-4";

function RequestCard() {
  return (
    <div className="bubble w-[96px] border border-ink bg-surface p-2 @lg:w-[150px] @lg:p-3">
      <div className="flex items-center gap-1.5 text-ink">
        <Mail size={14} className="shrink-0 @lg:hidden" />
        <Mail size={18} className="hidden shrink-0 @lg:block" />
        <span className="text-[9.5px] font-semibold @lg:text-[12.5px]">New request</span>
      </div>
      <div className="mt-1 text-[9px] leading-tight text-body @lg:mt-1.5 @lg:text-[11.5px]">Poblano&apos;s Mexican Grill</div>
      <div className="text-[8.5px] text-muted @lg:text-[10.5px]">RCS agent, brand + campaign</div>
    </div>
  );
}

function BeforeScene() {
  return (
    <motion.div className={sceneCls} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <RequestCard />
      {/* ten dashed email lines, two per tile row */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="h-full w-full self-stretch"
        aria-hidden
      >
        {portals.map((p, i) => {
          const row = Math.floor(i / 2);
          const y = (row + 0.5) * 20 + (i % 2 ? 2.5 : -2.5);
          return (
            <motion.path
              key={p}
              d={`M 0 50 C 45 50, 55 ${y}, 100 ${y}`}
              fill="none"
              className="stroke-muted"
              strokeWidth={1.25}
              strokeDasharray="4 4"
              vectorEffect="non-scaling-stroke"
              exit={{ opacity: 0 }}
            />
          );
        })}
      </svg>
      <div className="grid grid-cols-2 gap-1 @lg:gap-1.5">
        {portals.map((p, i) => (
          <motion.div
            key={p}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.5, x: -48 }}
            transition={{ delay: i * 0.03 }}
            className="bubble-sm border border-rule bg-surface px-1.5 py-[3px] text-[8.5px] whitespace-nowrap text-body @lg:px-2.5 @lg:py-1.5 @lg:text-[11.5px]"
          >
            {p}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function ShiftScene() {
  return (
    <motion.div className={sceneCls} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <RequestCard />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full self-stretch" aria-hidden>
        <motion.path
          d="M 0 50 L 100 50"
          fill="none"
          className="stroke-accent"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.2 }}
        />
      </svg>
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15 }}
        className="bubble w-[182px] overflow-hidden border border-accent bg-surface shadow-[var(--shadow)] @lg:w-[320px]"
      >
        <div className="flex items-center justify-between border-b border-rule bg-accent-soft px-2 py-1 @lg:px-3.5 @lg:py-2">
          <span className="text-[9.5px] font-semibold text-ink @lg:text-[12.5px]">Provisioning admin</span>
          <span className="label text-[7.5px] @lg:text-[9.5px]">queue</span>
        </div>
        <ul>
          {queue.map((q, i) => (
            <motion.li
              key={q.name}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.08 }}
              className="grid grid-cols-[1fr_auto] items-center gap-2 border-b border-rule px-2 py-1 last:border-0 @lg:px-3.5 @lg:py-2"
            >
              <span className="min-w-0">
                <span className="block truncate text-[9px] font-medium text-ink @lg:text-[12px]">{q.name}</span>
                <span className="block text-[8px] text-muted @lg:text-[10.5px]">{q.kind}</span>
              </span>
              <span className={`rounded-full px-1.5 py-px text-[7.5px] font-semibold whitespace-nowrap @lg:px-2 @lg:py-0.5 @lg:text-[10.5px] ${q.tone}`}>
                {q.status}
              </span>
            </motion.li>
          ))}
        </ul>
        <div className="hidden items-center gap-1.5 border-t border-rule bg-raised px-3.5 py-1.5 text-[10px] text-muted @lg:flex">
          <span>Submits to</span>
          {["carriers", "verification", "the customer"].map((s) => (
            <span key={s} className="rounded-full border border-rule bg-surface px-1.5 py-px text-ink">
              {s}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

const trackerStages = ["Brand", "Campaign", "Review"] as const;
const statuses: Phase[] = ["draft", "submitted", "live"];

function IntakeScene({ view, handlers }: { view: View; handlers?: Handlers }) {
  const uid = useId();
  const error = websiteError(view.website);
  const flipped = view.phase !== "draft";
  const reached = statuses.indexOf(view.phase);

  return (
    <motion.div
      className="absolute inset-0 grid place-items-center px-3 py-2 @lg:px-6 @lg:py-4"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <div className="bubble w-full max-w-[250px] border border-rule bg-surface p-2.5 shadow-[var(--shadow)] @lg:max-w-[380px] @lg:p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-semibold text-ink @lg:text-[13px]">New RCS agent</span>
          <span className="truncate text-[8.5px] text-muted @lg:text-[11px]">Poblano&apos;s Mexican Grill</span>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {!flipped ? (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -6 }}
              className="mt-2 grid gap-2 @lg:mt-3 @lg:gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                handlers?.onSubmit();
              }}
            >
              {/* three-stage tracker */}
              <ol className="grid grid-cols-3 gap-1.5" aria-label="Progress">
                {trackerStages.map((s, i) => {
                  const current = i === 2;
                  return (
                    <li key={s} className="grid gap-1" aria-current={current ? "step" : undefined}>
                      <span className={`block h-1 rounded-full ${current ? "bg-accent" : "bg-accent opacity-50"}`} />
                      <span className={`text-[8px] @lg:text-[10.5px] ${current ? "font-semibold text-ink" : "text-muted"}`}>
                        {i + 1}. {s}
                      </span>
                    </li>
                  );
                })}
              </ol>

              {/* website, with one inline validation */}
              <div className="grid gap-1">
                <label htmlFor={`${uid}-site`} className="text-[9px] font-semibold text-ink @lg:text-[11.5px]">
                  Website
                </label>
                <input
                  id={`${uid}-site`}
                  value={view.website}
                  readOnly={!handlers}
                  inputMode="url"
                  onChange={(e) => handlers?.onWebsite(e.target.value)}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? `${uid}-err` : undefined}
                  className={`bubble-sm w-full border bg-bg px-2 py-1 text-[10px] text-ink @lg:px-3 @lg:py-1.5 @lg:text-[12.5px] ${
                    error ? "border-warn" : "border-rule"
                  }`}
                />
                <AnimatePresence initial={false}>
                  {error && (
                    <motion.p
                      key="err"
                      id={`${uid}-err`}
                      role="alert"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden text-[8.5px] text-warn @lg:text-[11px]"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* use case, with field help behind a lucide Info */}
              <div className="hidden gap-1 @lg:grid">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11.5px] font-semibold text-ink">Use case</span>
                  <button
                    type="button"
                    aria-label="What is a use case?"
                    aria-expanded={view.tip}
                    aria-controls={`${uid}-tip`}
                    onMouseEnter={() => handlers?.onTip(true)}
                    onMouseLeave={() => handlers?.onTip(false)}
                    onFocus={() => handlers?.onTip(true)}
                    onBlur={() => handlers?.onTip(false)}
                    onClick={() => handlers?.onTip(!view.tip)}
                    className="text-muted hover:text-accent"
                  >
                    <Info size={13} />
                  </button>
                </div>
                <AnimatePresence initial={false}>
                  {view.tip && (
                    <motion.p
                      key="tip"
                      id={`${uid}-tip`}
                      role="tooltip"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bubble-sm overflow-hidden border border-rule bg-raised px-2.5 py-1.5 text-[10.5px] text-body"
                    >
                      Carriers read this to decide whether your messages are wanted. Describe what a customer receives and how they opted in.
                    </motion.p>
                  )}
                </AnimatePresence>
                <p className="text-[11px] text-body">Order-ready alerts and weekly specials for customers who opted in at checkout.</p>
              </div>

              <button
                type="submit"
                disabled={!!error && !!handlers}
                className="rounded-full bg-accent px-3 py-1 text-[10px] font-semibold text-white disabled:opacity-50 @lg:py-1.5 @lg:text-[12px]"
              >
                Submit for review
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="status"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-2 grid gap-2 @lg:mt-3 @lg:gap-3"
            >
              <ol className="flex items-center gap-1 @lg:gap-2" aria-label="Request status">
                {statuses.map((s, i) => {
                  const done = i < reached;
                  const current = i === reached;
                  return (
                    <li key={s} className="flex items-center gap-1 @lg:gap-2">
                      <motion.span
                        animate={{ scale: current ? [1, 1.08, 1] : 1 }}
                        aria-current={current ? "step" : undefined}
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[8.5px] font-semibold capitalize @lg:px-2.5 @lg:py-1 @lg:text-[11.5px] ${
                          current
                            ? s === "live"
                              ? "bg-ok-soft text-ok"
                              : "bg-accent-soft text-accent"
                            : done
                              ? "bg-raised text-muted"
                              : "border border-rule text-muted"
                        }`}
                      >
                        {done && <Check size={10} />}
                        {s}
                      </motion.span>
                      {i < statuses.length - 1 && <ArrowRight size={10} className="text-muted" />}
                    </li>
                  );
                })}
              </ol>
              <p className="text-[8.5px] text-muted @lg:text-[11px]">
                {view.phase === "live"
                  ? "Approved by the carriers. Your agent is live."
                  : "We send this to each carrier and the verification vendor for you."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function EndScene() {
  return (
    <motion.div
      className="absolute inset-0 grid place-items-center px-3 py-2 text-center @lg:px-6"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
    >
      <div>
        <div className="label text-[8.5px] @lg:text-[11.5px]">Operations effort per request</div>
        <div className="num mt-1 flex items-center justify-center gap-2 font-display text-[26px] font-bold tracking-[-0.03em] text-ink @lg:mt-2 @lg:gap-4 @lg:text-[60px]">
          <span>8 h</span>
          <ArrowRight className="h-5 w-5 text-accent @lg:h-10 @lg:w-10" />
          <span>90 min</span>
        </div>
        <p className="mt-1 text-[9.5px] text-muted @lg:mt-2 @lg:text-[13.5px]">measured by the operations director</p>
        <div className="num mt-2 hidden items-center justify-center gap-3 text-[11.5px] text-body @lg:mt-5 @lg:flex">
          <span className="rounded-full border border-rule bg-surface px-3 py-1">
            10 portals <ArrowRight size={11} className="inline" /> 6, heading to 1
          </span>
          <span className="rounded-full border border-rule bg-surface px-3 py-1">
            4 <ArrowRight size={11} className="inline" /> 7 people on the operations team
          </span>
        </div>
      </div>
    </motion.div>
  );
}
