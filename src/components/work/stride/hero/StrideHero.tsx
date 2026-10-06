"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  MessageCircle,
  Play,
  RotateCcw,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
  Users,
} from "lucide-react";
import { Header as SlackHeader, StrideMark } from "@/components/work/stride/LearningPrompt";

/**
 * Hero prototype for the Stride case study. One component serves the interactive and
 * autoplay tiers of HeroStage; the exported `strideStills` reuse the same subcomponents
 * in fixed states. Mock data throughout.
 *
 * Steps:
 *  0  a learning lands in Slack
 *  1  the learner brings it to a coach, the coach replies
 *  2  the track moves, 4 of 23 to 5 of 23
 *  3  the stat card fades in, then loop
 */

type Step = 0 | 1 | 2 | 3;
type ChipId = "up" | "down" | "coach";

const TOTAL = 23;
const DONE_BEFORE = 4;
const DONE_AFTER = 5;

/** how long autoplay rests on each step, in ms */
const AUTOPLAY_MS: Record<Step, number> = { 0: 2000, 1: 2200, 2: 2000, 3: 2600 };
/** in interactive mode, the stat card follows the track update on its own */
const STAT_DELAY_MS = 1400;

const steps = [
  { title: "A learning lands in Slack", hint: "Tap a reaction" },
  { title: "Bring it to a coach", hint: "Tap Next learning" },
  { title: "The track moves", hint: "" },
  { title: "The number moved", hint: "" },
] as const;

const chips: { id: ChipId; label: string; icon: ReactNode }[] = [
  { id: "up", label: "Helpful", icon: <ThumbsUp size={13} aria-hidden="true" /> },
  { id: "down", label: "Not for me", icon: <ThumbsDown size={13} aria-hidden="true" /> },
  { id: "coach", label: "Bring to my coach", icon: <MessageCircle size={13} aria-hidden="true" /> },
];

const botReplies: Record<Exclude<ChipId, "coach">, string> = {
  up: "Glad it landed. Learning 5 arrives Thursday.",
  down: "Noted. The rest of this track will lean toward what you flagged.",
};

const takeaways = [
  "Reward the question, not just the answer. Thank the person who asked before you respond.",
  "Name your own mistake first in your next team meeting. It sets the price of admitting one.",
];

/* ---------- Subcomponents ---------- */

function VideoPlaceholder() {
  return (
    <div
      role="img"
      aria-label="Placeholder for a short video titled Why teams stop speaking up"
      className="bubble-sm relative mt-2.5 flex h-14 items-center justify-center overflow-hidden sm:h-16"
      style={{ background: "linear-gradient(135deg, #1f4fe0, #0b1b33)" }}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#0b1b33] shadow">
        <Play size={14} className="ml-0.5" fill="currentColor" aria-hidden="true" />
      </span>
      <span className="absolute bottom-1.5 left-2.5 text-[11px] font-medium text-white/90">
        Short video · Why teams stop speaking up
      </span>
    </div>
  );
}

function ReactionChips({
  picked,
  onPick,
}: {
  picked: ChipId | null;
  onPick?: (id: ChipId) => void;
}) {
  return (
    <div className="mt-1.5 flex flex-wrap gap-1.5" role="group" aria-label="Reactions">
      {chips.map((c) => {
        const on = picked === c.id;
        return (
          <button
            key={c.id}
            type="button"
            aria-pressed={on}
            onClick={() => onPick?.(c.id)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-medium transition-colors ${
              on
                ? "border-accent bg-accent-soft text-ink"
                : "border-rule bg-surface text-body hover:border-accent"
            }`}
          >
            {c.icon}
            {c.label}
          </button>
        );
      })}
    </div>
  );
}

/** The Stride message: kicker, title, video placeholder, two takeaways, three reaction chips. */
function LearningMessage({
  picked,
  onPick,
  animate = true,
}: {
  picked: ChipId | null;
  onPick?: (id: ChipId) => void;
  animate?: boolean;
}) {
  const botReply = picked && picked !== "coach" ? botReplies[picked] : null;
  return (
    <div className="grid grid-cols-[28px_1fr] gap-2.5">
      <StrideMark className="mt-0.5 h-7 w-7" />
      <div className="min-w-0 text-[13px] leading-snug text-body">
        <SlackHeader time="9:02 AM" />
        <div className="label mt-1 text-[10.5px] text-accent">
          Building Trust &amp; Safety · Learning {DONE_BEFORE} of {TOTAL}
        </div>
        <p className="mt-0.5 text-[14px] font-semibold text-ink">
          Psychological safety is built in small moments
        </p>

        <VideoPlaceholder />

        <ol className="mt-2.5 grid gap-1.5">
          {takeaways.map((t, i) => (
            <li key={t} className="grid grid-cols-[20px_1fr] gap-2">
              <span className="num flex h-5 w-5 items-center justify-center rounded-full bg-accent-soft text-[10.5px] font-bold text-accent">
                {i + 1}
              </span>
              <span>{t}</span>
            </li>
          ))}
        </ol>

        <p className="mt-2.5 font-semibold text-ink">Was this learning helpful?</p>
        <ReactionChips picked={picked} onPick={onPick} />

        <AnimatePresence initial={animate}>
          {botReply && (
            <motion.p
              key={picked}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-2 flex items-center gap-2 text-[12px] text-muted"
            >
              <StrideMark className="h-4 w-4" />
              <span>{botReply}</span>
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/** The coach's reply, a separate Slack message. */
function CoachReply() {
  return (
    <div className="grid grid-cols-[28px_1fr] gap-2.5">
      <span
        aria-hidden="true"
        className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-[8px] bg-accent text-[12px] font-bold text-white"
      >
        E
      </span>
      <div className="min-w-0 text-[13px] leading-snug text-body">
        <div className="flex items-center gap-2 text-[13px]">
          <span className="font-bold text-ink">Erica</span>
          <span className="rounded bg-raised px-1 py-px text-[10px] font-semibold text-muted">COACH</span>
          <span className="text-muted">9:04 AM</span>
        </div>
        <p className="mt-0.5">Erica here. Let&apos;s open with this Thursday.</p>
      </div>
    </div>
  );
}

/** The message column: learning, optional coach reply, and the Next learning control. */
function MessagePane({
  step,
  picked,
  onPick,
  onNext,
  animate = true,
}: {
  step: Step;
  picked: ChipId | null;
  onPick?: (id: ChipId) => void;
  onNext?: () => void;
  animate?: boolean;
}) {
  return (
    <div className="bubble min-h-0 overflow-y-auto border border-rule bg-surface p-3 sm:p-4">
      <div className="mb-2.5 flex items-center gap-1.5 border-b border-rule pb-2 text-[11.5px] text-muted">
        <StrideMark className="h-3.5 w-3.5" />
        <span className="font-semibold text-ink">Stride</span>
        <span>· Direct message</span>
      </div>

      <LearningMessage picked={picked} onPick={onPick} animate={animate} />

      <AnimatePresence initial={animate}>
        {step >= 1 && picked === "coach" && (
          <motion.div
            key="coach"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-3 border-t border-rule pt-3"
          >
            <CoachReply />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={animate} mode="wait">
        {step === 1 && (
          <motion.div
            key="next"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-3"
          >
            <button
              type="button"
              onClick={onNext}
              className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
            >
              Next learning
              <ArrowRight size={13} aria-hidden="true" />
            </button>
          </motion.div>
        )}
        {step >= 2 && (
          <motion.p
            key="opened"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-3 text-[11.5px] text-muted"
          >
            Learning {DONE_AFTER} of {TOTAL} opened. The next one lands Thursday.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Compact track progress: count, bar, 23 dots, and the cadence line. */
function ProgressPanel({ done }: { done: number }) {
  const pct = (done / TOTAL) * 100;
  return (
    <div className="bubble border border-rule bg-surface p-3 sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="label text-[10.5px] text-accent">Track</div>
          <div className="text-[14px] font-bold leading-tight text-ink">Building Trust &amp; Safety</div>
        </div>
        <div className="num shrink-0 text-right leading-none">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={done}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="inline-block text-[22px] font-bold text-ink"
            >
              {done}
            </motion.span>
          </AnimatePresence>
          <span className="text-[12px] text-muted"> of {TOTAL}</span>
        </div>
      </div>

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={TOTAL}
        aria-valuenow={done}
        aria-label="Learnings completed"
        className="mt-2.5 h-2 overflow-hidden rounded-full bg-raised"
      >
        <motion.div
          className="h-full rounded-full bg-accent"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 170, damping: 24 }}
        />
      </div>

      <div className="mt-2.5 flex flex-wrap gap-1" aria-hidden="true">
        {Array.from({ length: TOTAL }, (_, i) => {
          const n = i + 1;
          const filled = n <= done;
          return (
            <span
              key={n}
              className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                filled ? "bg-accent" : "border border-rule bg-surface"
              }`}
            />
          );
        })}
      </div>

      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[11.5px] text-muted">
        <span className="num">{TOTAL} micro-learnings over 3 months</span>
        <span className="num">One of 20 tracks</span>
      </div>
    </div>
  );
}

/** The tiny outcome card. */
function StatCard({ animate = true }: { animate?: boolean }) {
  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="bubble border border-accent bg-accent-soft p-3 sm:p-4"
    >
      <div className="label flex items-center gap-1.5 text-[10.5px]">
        <Users size={12} aria-hidden="true" />
        Monthly active users
      </div>
      <div className="num mt-1 flex flex-wrap items-baseline gap-x-2 text-ink">
        <span className="text-[14px] text-muted">2%</span>
        <ArrowRight size={14} className="self-center text-muted" aria-hidden="true" />
        <span className="text-[26px] font-bold leading-none">22%</span>
        <span className="text-[12px] text-muted">of seats</span>
      </div>
      <div className="mt-1.5 flex items-center gap-1.5 text-[11.5px] text-body">
        <TrendingUp size={12} aria-hidden="true" />
        <span className="num">+18% user satisfaction</span>
      </div>
    </motion.div>
  );
}

/** A thin strip naming the four steps of the loop. */
function StepBar({
  step,
  interactive,
  onReplay,
}: {
  step: Step;
  interactive: boolean;
  onReplay: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-rule bg-surface px-3 py-1.5 text-[11.5px]">
      <ol className="flex min-w-0 items-center gap-2 sm:gap-3" aria-label="Story steps">
        {steps.map((s, i) => {
          const current = i === step;
          return (
            <li
              key={s.title}
              aria-current={current ? "step" : undefined}
              className={`flex min-w-0 items-center gap-1.5 ${current ? "text-ink" : "text-muted"}`}
            >
              <span
                className={`num flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                  i <= step ? "bg-accent text-white" : "bg-raised text-muted"
                }`}
              >
                {i + 1}
              </span>
              <span className={current ? "truncate font-semibold" : "hidden md:inline"}>{s.title}</span>
            </li>
          );
        })}
      </ol>
      {interactive &&
        (step === 3 ? (
          <button
            type="button"
            onClick={onReplay}
            className="inline-flex shrink-0 items-center gap-1 rounded-full border border-rule bg-surface px-2 py-0.5 font-medium text-body hover:border-accent hover:text-ink"
          >
            <RotateCcw size={11} aria-hidden="true" />
            Replay
          </button>
        ) : (
          <span className="hidden shrink-0 text-muted sm:inline">{steps[step].hint}</span>
        ))}
    </div>
  );
}

/* ---------- The prototype ---------- */

type HeroState = { step: Step; picked: ChipId | null };
const INITIAL: HeroState = { step: 0, picked: null };
const FINAL: HeroState = { step: 3, picked: "coach" };

/** The autoplay loop: 0 picks "Bring to my coach", 3 wraps back to the start. */
function advance({ step, picked }: HeroState): HeroState {
  if (step === 0) return { step: 1, picked: "coach" };
  if (step === 3) return INITIAL;
  return { step: (step + 1) as Step, picked };
}

export function StrideHero({ autoplay = false }: { autoplay?: boolean }) {
  const reduce = useReducedMotion();
  const interactive = !autoplay;
  // null until something moves it; reduced motion then shows the final state with no timers.
  const [state, setState] = useState<HeroState | null>(null);
  const { step, picked } = state ?? (reduce ? FINAL : INITIAL);

  useEffect(() => {
    if (reduce) return undefined;
    if (autoplay) {
      const t = setTimeout(() => setState(advance({ step, picked })), AUTOPLAY_MS[step]);
      return () => clearTimeout(t);
    }
    if (step === 2) {
      const t = setTimeout(() => setState({ step: 3, picked }), STAT_DELAY_MS);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [autoplay, reduce, step, picked]);

  function pick(id: ChipId) {
    setState({ step: step === 0 ? 1 : step, picked: id });
  }
  function next() {
    setState({ step: reduce ? 3 : 2, picked });
  }
  function replay() {
    setState(INITIAL);
  }

  const done = step >= 2 ? DONE_AFTER : DONE_BEFORE;

  return (
    <MotionConfig reducedMotion="user">
      <div
        inert={autoplay}
        className="absolute inset-0 grid grid-rows-[auto_1fr] bg-bg text-[13px]"
      >
        <StepBar step={step} interactive={interactive} onReplay={replay} />
        <div className="grid min-h-0 gap-3 overflow-y-auto p-3 md:grid-cols-[1.2fr_1fr] md:overflow-hidden md:p-4">
          <MessagePane
            step={step}
            picked={picked}
            onPick={interactive ? pick : undefined}
            onNext={interactive ? next : undefined}
          />
          <div className="grid min-h-0 content-start gap-3 md:overflow-y-auto">
            <ProgressPanel done={done} />
            <AnimatePresence>{step === 3 && <StatCard key="stat" />}</AnimatePresence>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}

/* ---------- Stills ---------- */

function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="absolute inset-0 overflow-y-auto bg-bg p-3 sm:p-5">
      <div className="mx-auto grid max-w-[520px] gap-3">{children}</div>
    </div>
  );
}

export const strideStills: { render: ReactNode; caption: string }[] = [
  {
    render: (
      <Frame>
        <MessagePane step={0} picked={null} animate={false} />
      </Frame>
    ),
    caption: "A learning lands in Slack: a short video, two takeaways, three reactions",
  },
  {
    render: (
      <Frame>
        <MessagePane step={1} picked="coach" animate={false} />
      </Frame>
    ),
    caption: "Bring to my coach: the coach replies and Thursday's session has an opener",
  },
  {
    render: (
      <Frame>
        <ProgressPanel done={DONE_AFTER} />
      </Frame>
    ),
    caption: "The track moves: 4 of 23 to 5 of 23 on a three-month path",
  },
  {
    render: (
      <Frame>
        <StatCard animate={false} />
        <ProgressPanel done={DONE_AFTER} />
      </Frame>
    ),
    caption: "Monthly active users went from 2% to 22% of seats",
  },
];
