"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Check,
  Circle,
  CircleCheck,
  Equal,
  GitPullRequestArrow,
  Play,
  Server,
  ShieldCheck,
  Workflow,
} from "lucide-react";

/**
 * Hero prototype: one piece of work travels through the way of working.
 * Plan (chip moves Open to Planned to Shaping, gate flashes) → Build (prototype branch,
 * CI deploy to a shared environment, prototype and shipped identical) → Ship (Ready to
 * Deploy, Done) → Spread (my team, a second team, about half of the org). Loops.
 *
 * ONE component serves the interactive and autoplay tiers; `teamFasterStills` renders the
 * same frame in fixed states. Everything is abstract and mock; nothing is a real screen.
 */

/* ---------- data ---------- */

type StageId = "open" | "planned" | "shaping" | "in-progress" | "ready" | "done";

type Stage = { id: StageId; name: string; owner: string; note: string; gate?: string };

const stages: Stage[] = [
  { id: "open", name: "Open", owner: "Product", note: "Ideas and requests land here." },
  { id: "planned", name: "Planned", owner: "Product", note: "Committed. The problem is written down, the outcome named." },
  {
    id: "shaping",
    name: "Shaping",
    owner: "Engineering pod, with product in the room",
    note: "Broken into issues. Questions get answered here, not mid-build.",
  },
  {
    id: "in-progress",
    name: "In Progress",
    owner: "Engineering",
    note: "Being built. Designs live on a branch in a shared environment.",
    gate: "Gate: nothing enters In Progress until issues exist and there is shared understanding.",
  },
  { id: "ready", name: "Ready to Deploy", owner: "Engineering", note: "Merged and clicked through. Waiting on a release window." },
  { id: "done", name: "Done", owner: "Everyone", note: "Shipped and shown in the sprint review." },
];

const stageIndex = (id: StageId) => stages.findIndex((s) => s.id === id);
const GATE_BEFORE: StageId = "in-progress";

type StepId = 0 | 1 | 2 | 3;
const steps: { id: StepId; name: string }[] = [
  { id: 0, name: "Plan" },
  { id: 1, name: "Build" },
  { id: 2, name: "Ship" },
  { id: 3, name: "Spread" },
];

type Scene = {
  step: StepId;
  stage: StageId;
  /** the gate rule is flashing */
  gate?: boolean;
  /** 1 merge request open, 2 deployed to an environment, 3 prototype and shipped side by side */
  build?: 0 | 1 | 2 | 3;
  /** 1 my team, 2 a second team, 3 about half of the org */
  spread?: 0 | 1 | 2 | 3;
  /** the end card is up */
  end?: boolean;
  ms: number;
};

/** Thirteen scenes in four steps, roughly 2.5 s per step on autoplay. */
const scenes: Scene[] = [
  // Plan
  { step: 0, stage: "open", ms: 650 },
  { step: 0, stage: "planned", ms: 650 },
  { step: 0, stage: "shaping", ms: 650 },
  { step: 0, stage: "shaping", gate: true, ms: 800 },
  // Build
  { step: 1, stage: "in-progress", build: 1, ms: 800 },
  { step: 1, stage: "in-progress", build: 2, ms: 800 },
  { step: 1, stage: "in-progress", build: 3, ms: 1100 },
  // Ship
  { step: 2, stage: "ready", ms: 1100 },
  { step: 2, stage: "done", ms: 1400 },
  // Spread
  { step: 3, stage: "done", spread: 1, ms: 600 },
  { step: 3, stage: "done", spread: 2, ms: 600 },
  { step: 3, stage: "done", spread: 3, ms: 700 },
  { step: 3, stage: "done", spread: 3, end: true, ms: 1700 },
];

const stepStart = (step: StepId) => scenes.findIndex((s) => s.step === step);
const stepEnd = (step: StepId) => scenes.length - 1 - [...scenes].reverse().findIndex((s) => s.step === step);
const LAST = scenes.length - 1;

/* ---------- the stateful hero ---------- */

export function TeamFasterHero({ autoplay = false }: { autoplay?: boolean }) {
  const reduce = useReducedMotion() ?? false;
  // null until the viewer or a timer moves it: reduced motion then shows the final state, no timers.
  const [picked, setScene] = useState<number | null>(null);
  const scene = picked ?? (reduce ? LAST : 0);
  const [hovered, setHovered] = useState<StageId | null>(null);

  // Timers. Autoplay runs through every scene and loops; interactive plays the
  // current step to its end and holds for "Next step".
  useEffect(() => {
    if (reduce) return;
    const s = scenes[scene];
    const next = scene + 1;
    const isLast = next > LAST;
    const crossesStep = !isLast && scenes[next].step !== s.step;
    if (!autoplay && (isLast || crossesStep)) return;
    const t = setTimeout(() => setScene(isLast ? 0 : next), s.ms);
    return () => clearTimeout(t);
  }, [scene, autoplay, reduce]);

  const step = scenes[scene].step;
  const jump = (to: StepId) => setScene(reduce ? stepEnd(to) : stepStart(to));
  const nextStep = () => jump(((step + 1) % steps.length) as StepId);

  return (
    <Frame
      scene={scenes[scene]}
      hovered={hovered}
      onHover={setHovered}
      onJump={jump}
      onNext={nextStep}
      autoplay={autoplay}
      reduce={reduce}
    />
  );
}

/* ---------- the frame: everything visible ---------- */

function Frame({
  scene,
  hovered,
  onHover,
  onJump,
  onNext,
  autoplay,
  reduce,
}: {
  scene: Scene;
  hovered: StageId | null;
  onHover?: (id: StageId | null) => void;
  onJump?: (step: StepId) => void;
  onNext?: () => void;
  autoplay?: boolean;
  reduce: boolean;
}) {
  const chipId = useId();
  const noteId = useId();
  const stillFrame = !onNext;
  const shown = stages[stageIndex(hovered ?? scene.stage)];
  const showGate = scene.gate && !hovered;
  const chipAt = stageIndex(scene.stage);
  const chipDone = scene.stage === "done";
  const chipTransition = reduce ? { duration: 0 } : { type: "spring" as const, stiffness: 420, damping: 34 };
  const fade = reduce ? { duration: 0 } : { duration: 0.25 };

  return (
    <div className="@container absolute inset-0 grid grid-rows-[auto_auto_1fr] gap-2 overflow-hidden bg-surface p-2.5 text-ink @md:gap-3 @md:p-4">
      {/* step tabs and the control */}
      <div className="flex items-center justify-between gap-2">
        <ol className="flex min-w-0 items-center gap-0.5 @md:gap-1" aria-label="Steps">
          {steps.map((s) => {
            const on = s.id === scene.step;
            const inner = (
              <>
                <span className="num">{s.id + 1}</span>
                <span className="hidden @sm:inline">{s.name}</span>
              </>
            );
            const cls = `flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-semibold transition-colors @md:px-2.5 @md:text-[11.5px] ${
              on ? "border-accent bg-accent-soft text-accent" : "border-rule bg-raised text-muted"
            }`;
            return (
              <li key={s.id} className="min-w-0">
                {stillFrame ? (
                  <span className={cls} aria-current={on ? "step" : undefined}>
                    {inner}
                  </span>
                ) : (
                  <button
                    type="button"
                    aria-current={on ? "step" : undefined}
                    aria-label={`Step ${s.id + 1}, ${s.name}`}
                    onClick={() => onJump?.(s.id)}
                    className={`${cls} ${on ? "" : "hover:border-accent hover:text-ink"}`}
                  >
                    {inner}
                  </button>
                )}
              </li>
            );
          })}
        </ol>
        {stillFrame ? (
          <span className="label hidden @md:inline">Still</span>
        ) : (
          <span className="flex shrink-0 items-center gap-2">
            {autoplay && (
              <span className="label hidden items-center gap-1 @md:flex" aria-label="Playing">
                <Play size={11} /> Loop
              </span>
            )}
            <button
              type="button"
              onClick={onNext}
              className="flex items-center gap-1 rounded-full border border-accent bg-accent-soft px-2 py-0.5 text-[10.5px] font-semibold text-accent transition-colors hover:bg-accent hover:text-surface @md:px-3 @md:py-1 @md:text-[12px]"
            >
              Next step <ArrowRight size={12} />
            </button>
          </span>
        )}
      </div>

      {/* the six-stage pipeline with the travelling chip */}
      <div className="grid gap-1 @md:gap-1.5">
        <ol
          className="grid grid-cols-6 gap-1 @md:gap-1.5"
          aria-label="Project stages"
          onMouseLeave={() => onHover?.(null)}
        >
          {stages.map((s, i) => {
            const here = i === chipAt;
            const isGate = s.id === GATE_BEFORE;
            const cellCls = `bubble-sm relative grid w-full gap-1 border p-1 text-left transition-colors @md:gap-1.5 @md:p-2 ${
              here ? "border-accent bg-accent-soft/60" : "border-rule bg-raised"
            } ${isGate && showGate ? "ring-2 ring-accent" : ""}`;
            const inner = (
              <>
                <span className="flex min-w-0 items-center gap-1">
                  <span className="label num text-[8px] @md:text-[10px]">{i + 1}</span>
                  <span className="truncate text-[9px] font-semibold text-ink @md:text-[12px]">{s.name}</span>
                </span>
                <span className="grid min-h-[20px] content-start @md:min-h-[30px]" aria-hidden="true">
                  {here ? (
                    <motion.span
                      layoutId={chipId}
                      transition={chipTransition}
                      className={`block truncate rounded-md border px-1 py-0.5 text-[8.5px] font-medium @md:px-1.5 @md:text-[11px] ${
                        chipDone ? "border-ok bg-ok-soft text-ok" : "border-accent bg-surface text-accent"
                      }`}
                    >
                      Submissions flow
                    </motion.span>
                  ) : (
                    <span className="block h-[18px] rounded-md border border-dashed border-rule @md:h-[22px]" />
                  )}
                </span>
              </>
            );
            return (
              <li key={s.id} className="relative min-w-0">
                {isGate && (
                  <span
                    aria-hidden="true"
                    className={`absolute -left-[3px] top-0 bottom-0 border-l-2 @md:-left-[4px] ${
                      showGate ? "border-solid border-accent" : "border-dashed border-accent/70"
                    }`}
                  />
                )}
                {stillFrame ? (
                  <span className={cellCls}>{inner}</span>
                ) : (
                  <button
                    type="button"
                    aria-label={`${s.name}, owned by ${s.owner}`}
                    aria-describedby={noteId}
                    onMouseEnter={() => onHover?.(s.id)}
                    onFocus={() => onHover?.(s.id)}
                    onBlur={() => onHover?.(null)}
                    className={`${cellCls} hover:border-accent`}
                  >
                    {inner}
                  </button>
                )}
              </li>
            );
          })}
        </ol>

        {/* owner and gate note: hover a stage, or follow the chip */}
        <div
          id={noteId}
          aria-live="polite"
          className="hidden min-h-[18px] items-center gap-1.5 text-[11px] leading-tight @sm:flex @md:text-[12.5px]"
        >
          {showGate ? (
            <motion.span
              key="gate"
              className="flex items-center gap-1.5 font-medium text-accent"
              animate={reduce ? { opacity: 1 } : { opacity: [1, 0.45, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              <ShieldCheck size={13} className="shrink-0" />
              <span className="truncate">{stages[stageIndex(GATE_BEFORE)].gate}</span>
            </motion.span>
          ) : (
            <span className="flex min-w-0 items-center gap-1.5">
              <span className="label shrink-0 text-[9.5px] @md:text-[10.5px]">{shown.owner}</span>
              <span className="truncate text-body">{shown.id === "in-progress" && hovered ? shown.gate : shown.note}</span>
            </span>
          )}
        </div>
      </div>

      {/* the step panel */}
      <div className="relative min-h-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={scene.step}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={fade}
          >
            {scene.step === 0 && <PlanPanel stage={scene.stage} gate={!!scene.gate} reduce={reduce} />}
            {scene.step === 1 && <BuildPanel phase={scene.build ?? 0} reduce={reduce} />}
            {scene.step === 2 && <ShipPanel stage={scene.stage} reduce={reduce} />}
            {scene.step === 3 && <SpreadPanel level={scene.spread ?? 0} end={!!scene.end} reduce={reduce} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------- shared bits ---------- */

/** Grey bars stand in for text. Nothing here is a real screen. */
function Bar({ w, tone = "raised", h = "h-1.5" }: { w: string; tone?: "raised" | "accent" | "ink"; h?: string }) {
  const bg = tone === "accent" ? "bg-accent/60" : tone === "ink" ? "bg-ink/70" : "bg-raised";
  return <span className={`block ${h} rounded-full ${bg}`} style={{ width: w }} aria-hidden="true" />;
}

function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`bubble-sm h-full overflow-hidden border border-rule bg-raised/50 p-2 @md:p-3 ${className}`}>{children}</div>;
}

function Appear({ show, reduce, children, className = "" }: { show: boolean; reduce: boolean; children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={false}
      animate={{ opacity: show ? 1 : 0.18, y: show || reduce ? 0 : 3 }}
      transition={reduce ? { duration: 0 } : { duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

function CheckRow({ on, children }: { on: boolean; children: ReactNode }) {
  return (
    <li className={`flex items-center gap-1.5 text-[10.5px] leading-tight @md:text-[12.5px] ${on ? "text-ink" : "text-muted"}`}>
      {on ? <CircleCheck size={14} className="shrink-0 text-ok" /> : <Circle size={14} className="shrink-0 text-rule" />}
      <span className="truncate">{children}</span>
    </li>
  );
}

/* ---------- Plan: the project fills in as it moves ---------- */

function PlanPanel({ stage, gate, reduce }: { stage: StageId; gate: boolean; reduce: boolean }) {
  const at = stageIndex(stage);
  const planned = at >= 1;
  const shaping = at >= 2;
  const issues = ["Step pages", "Status across steps", "Review state", "Empty states"];
  return (
    <Panel className="grid grid-cols-[1fr_1fr] gap-2 @md:gap-3">
      <div className="grid min-w-0 content-start gap-1.5 @md:gap-2">
        <span className="label text-[9px] @md:text-[10.5px]">Project</span>
        <span className="truncate text-[12px] font-semibold text-ink @md:text-[15px]">Submissions flow</span>
        <Appear show={planned} reduce={reduce} className="grid gap-1">
          <span className="text-[10px] text-muted @md:text-[11px]">Problem written down</span>
          <Bar w="88%" />
          <Bar w="64%" />
        </Appear>
        <Appear show={planned} reduce={reduce} className="grid gap-1">
          <span className="text-[10px] text-muted @md:text-[11px]">Outcome named</span>
          <Bar w="52%" tone="accent" />
        </Appear>
      </div>
      <div className="grid min-w-0 content-start gap-1.5 @md:gap-2">
        <span className="label text-[9px] @md:text-[10.5px]">Issues</span>
        <ul className="grid gap-1" aria-label={shaping ? `${issues.length} issues` : "No issues yet"}>
          {issues.map((it, i) => (
            <Appear key={it} show={shaping} reduce={reduce}>
              <li className="flex items-center gap-1.5 rounded-md border border-rule bg-surface px-1.5 py-0.5 text-[10px] text-body @md:py-1 @md:text-[11.5px]">
                <span className="h-2 w-2 shrink-0 rounded-[3px] border border-muted" aria-hidden="true" />
                <span className="truncate">{it}</span>
                <Bar w={`${18 + i * 7}%`} />
              </li>
            </Appear>
          ))}
        </ul>
        <Appear show={gate} reduce={reduce}>
          <ul className="grid gap-0.5 border-t border-rule pt-1.5">
            <CheckRow on={gate}>Issues exist</CheckRow>
            <CheckRow on={gate}>Shared understanding</CheckRow>
          </ul>
        </Appear>
      </div>
    </Panel>
  );
}

/* ---------- Build: branch, CI, environment, side by side ---------- */

const envs = [
  ...Array.from({ length: 5 }, (_, i) => ({ id: `eng-${i + 1}`, who: "eng" as const })),
  ...Array.from({ length: 5 }, (_, i) => ({ id: `me-${i + 1}`, who: "me" as const })),
];
const DEPLOY_TO = "me-2";

function Node({ on, icon, kicker, title }: { on: boolean; icon: ReactNode; kicker: string; title: string }) {
  return (
    <div
      className={`bubble-sm grid min-w-0 content-start gap-0.5 border p-1.5 transition-colors @md:gap-1 @md:p-2.5 ${
        on ? "border-accent bg-accent-soft" : "border-rule bg-surface"
      }`}
    >
      <span className={`flex items-center gap-1 ${on ? "text-accent" : "text-muted"}`}>
        {icon}
        <span className="label truncate text-[8.5px] @md:text-[10px]">{kicker}</span>
      </span>
      <span className="truncate text-[10px] font-semibold leading-snug text-ink @md:text-[12.5px]">{title}</span>
    </div>
  );
}

function MiniScreen({ label, live }: { label: string; live: boolean }) {
  return (
    <div className="grid min-w-0 gap-1">
      <span className={`truncate text-[9px] font-medium @md:text-[10.5px] ${live ? "text-accent" : "text-muted"}`}>{label}</span>
      <div className="bubble-sm grid gap-1.5 border border-rule bg-surface p-1.5 @md:gap-2 @md:p-2.5" aria-hidden="true">
        <div className="grid grid-cols-4 gap-1">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={`h-2 rounded-sm @md:h-2.5 ${i === 2 ? "bg-accent-soft ring-1 ring-accent/60" : "bg-raised"}`} />
          ))}
        </div>
        <Bar w="38%" tone="ink" h="h-1.5 @md:h-2" />
        <Bar w="72%" />
        <div className="grid grid-cols-2 gap-1">
          <span className="h-3 rounded-sm border border-rule bg-raised/40 @md:h-5" />
          <span className="h-3 rounded-sm border border-rule bg-raised/40 @md:h-5" />
        </div>
        <div className="flex items-center justify-between">
          <Bar w="30%" />
          <span className="h-2.5 w-8 rounded-sm bg-accent @md:h-3.5 @md:w-10" />
        </div>
      </div>
    </div>
  );
}

function BuildPanel({ phase, reduce }: { phase: 0 | 1 | 2 | 3; reduce: boolean }) {
  return (
    <Panel className="grid grid-rows-[auto_1fr] gap-2 @md:gap-3">
      <div className="grid grid-cols-[1fr_auto_1fr_auto_1.1fr] items-center gap-1 @md:gap-2">
        <Node on={phase >= 1} icon={<GitPullRequestArrow size={12} />} kicker="Prototype branch" title="Merge request opened" />
        <ArrowRight size={12} className="text-muted" aria-hidden="true" />
        <Node on={phase >= 2} icon={<Workflow size={12} />} kicker="CI job" title="Deploy, no merge" />
        <ArrowRight size={12} className="text-muted" aria-hidden="true" />
        <div className="grid min-w-0 gap-1">
          <span className={`flex items-center gap-1 ${phase >= 2 ? "text-accent" : "text-muted"}`}>
            <Server size={12} />
            <span className="label truncate text-[8.5px] @md:text-[10px]">Ten shared environments</span>
          </span>
          <ul className="grid grid-cols-5 gap-0.5 @md:gap-1" aria-label="Ten shared environments">
            {envs.map((e) => {
              const lit = phase >= 2 && e.id === DEPLOY_TO;
              return (
                <motion.li
                  key={e.id}
                  aria-label={lit ? `${e.id}, deployed` : e.id}
                  initial={false}
                  animate={lit ? { scale: reduce ? 1 : [1, 1.12, 1] } : { scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className={`h-3 rounded-[4px] border @md:h-5 ${
                    lit ? "border-accent bg-accent" : e.who === "me" ? "border-accent/50 bg-accent-soft" : "border-rule bg-surface"
                  }`}
                />
              );
            })}
          </ul>
        </div>
      </div>

      <Appear show={phase >= 3} reduce={reduce} className="grid min-h-0 grid-cols-[1fr_auto_1fr] items-start gap-2 @md:gap-3">
        <MiniScreen label="Prototype · mock data" live={false} />
        <div className="grid justify-items-center gap-0.5 self-center @md:gap-1">
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full border @md:h-8 @md:w-8 ${
              phase >= 3 ? "border-ok bg-ok-soft text-ok" : "border-rule bg-surface text-muted"
            }`}
            aria-hidden="true"
          >
            <Equal size={14} />
          </span>
          <span className="hidden text-center text-[9px] leading-tight text-muted @md:block @md:text-[10.5px]">
            visually
            <br />
            identical
          </span>
        </div>
        <MiniScreen label="Shipped · real data model" live />
      </Appear>
    </Panel>
  );
}

/* ---------- Ship: Ready to Deploy, then Done ---------- */

function ShipPanel({ stage, reduce }: { stage: StageId; reduce: boolean }) {
  const ready = stageIndex(stage) >= stageIndex("ready");
  const done = stage === "done";
  return (
    <Panel className="grid grid-cols-[1.1fr_1fr] gap-2 @md:gap-4">
      <div className="grid min-w-0 content-start gap-1.5 @md:gap-2">
        <span className="label text-[9px] @md:text-[10.5px]">{done ? "Done" : "Ready to Deploy"}</span>
        <ul className="grid gap-1 @md:gap-1.5" aria-label="Release checklist">
          <CheckRow on={ready}>Merged</CheckRow>
          <CheckRow on={ready}>Clicked through in a shared environment</CheckRow>
          <CheckRow on={done}>Release window</CheckRow>
          <CheckRow on={done}>Shown in the sprint review</CheckRow>
        </ul>
      </div>
      <div className="grid min-w-0 content-start gap-1.5 @md:gap-2">
        <span className="label text-[9px] @md:text-[10.5px]">Sprint review</span>
        <div className="bubble-sm grid gap-1.5 border border-rule bg-surface p-2 @md:gap-2 @md:p-3" aria-hidden="true">
          <Bar w="46%" tone="ink" h="h-1.5 @md:h-2" />
          <Appear show={done} reduce={reduce} className="grid gap-1.5">
            <div className="flex items-center gap-1.5">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-ok-soft text-ok @md:h-5 @md:w-5">
                <Check size={11} />
              </span>
              <span className="truncate text-[10px] font-medium text-ink @md:text-[12px]">Submissions flow shipped</span>
            </div>
            <Bar w="80%" />
            <Bar w="58%" />
          </Appear>
        </div>
      </div>
    </Panel>
  );
}

/* ---------- Spread: my team, a second team, about half ---------- */

const TOTAL = 12;
const columns: { when: string; who: string; filled: number; moving: number }[] = [
  { when: "First", who: "My team", filled: 1, moving: 0 },
  { when: "Then", who: "A second team", filled: 2, moving: 0 },
  { when: "Now", who: "About half of product and technology", filled: 6, moving: 6 },
];

function SpreadPanel({ level, end, reduce }: { level: 0 | 1 | 2 | 3; end: boolean; reduce: boolean }) {
  return (
    <Panel className="relative">
      <motion.div
        className="grid h-full grid-cols-3 gap-2 @md:gap-4"
        initial={false}
        animate={{ opacity: end ? 0.3 : 1 }}
        transition={reduce ? { duration: 0 } : { duration: 0.3 }}
      >
        {columns.map((c, ci) => {
          const on = level >= ci + 1;
          return (
            <div key={c.when} className="grid min-w-0 content-start gap-1 @md:gap-2">
              <span className="label text-[9px] @md:text-[10.5px]">{c.when}</span>
              <div
                className="grid grid-cols-6 gap-0.5 @md:grid-cols-4 @md:gap-1"
                role="img"
                aria-label={on ? `${c.who}: ${c.filled} of ${TOTAL} blocks filled` : "Not yet"}
              >
                {Array.from({ length: TOTAL }).map((_, i) => {
                  const filled = on && i < c.filled;
                  const moving = on && !filled && i < c.filled + c.moving;
                  return (
                    <motion.span
                      key={i}
                      initial={false}
                      animate={{ opacity: filled || moving ? 1 : 0.6 }}
                      transition={reduce ? { duration: 0 } : { duration: 0.25, delay: on ? i * 0.03 : 0 }}
                      className={`aspect-square rounded-[3px] border @md:rounded-[5px] ${
                        filled
                          ? "border-accent bg-accent"
                          : moving
                            ? "border-dashed border-accent/70 bg-accent-soft"
                            : "border-rule bg-surface"
                      }`}
                    />
                  );
                })}
              </div>
              <span className={`truncate text-[10px] leading-tight @md:text-[12px] ${on ? "text-ink" : "text-muted"}`}>{c.who}</span>
            </div>
          );
        })}
      </motion.div>

      <AnimatePresence>
        {end && (
          <motion.div
            key="end"
            className="absolute inset-0 grid place-items-center p-2"
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.3 }}
          >
            <div className="bubble-me max-w-[90%] border border-accent bg-accent-soft px-3 py-2 text-center @md:px-6 @md:py-4">
              <div className="label text-[9px] text-accent @md:text-[10.5px]">The loop</div>
              <div className="mt-0.5 font-display text-[14px] font-bold leading-tight tracking-[-0.02em] text-ink @md:mt-1 @md:text-[22px]">
                Same judgment, shorter loop.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Panel>
  );
}

/* ---------- stills: the same frame in fixed states ---------- */

function StillFrame({ index }: { index: number }) {
  return <Frame scene={scenes[index]} hovered={null} reduce />;
}

export const teamFasterStills: { render: ReactNode; caption: string }[] = [
  {
    render: <StillFrame index={3} />,
    caption: "Plan: a project moves Open to Planned to Shaping. Nothing enters In Progress until issues exist and there is shared understanding.",
  },
  {
    render: <StillFrame index={6} />,
    caption: "Build: a prototype branch opens a merge request, CI deploys it to one of ten shared environments, and what ships looks the same.",
  },
  {
    render: <StillFrame index={8} />,
    caption: "Ship: Ready to Deploy, then Done, shown in the sprint review.",
  },
  {
    render: <StillFrame index={12} />,
    caption: "Spread: my team first, then a second team, then about half of product and technology. Same judgment, shorter loop.",
  },
];
