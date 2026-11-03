"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpFromLine, Check, RotateCcw } from "lucide-react";
import { useHeroFooter } from "@/components/case/HeroStage";
import { MockPage, type Tone } from "./MockPage";

/**
 * Design system hero: three steps in a 16:9 stage, mock data only.
 *  1. Two looks: Platform today beside RCS Studio.
 *  2. Promote up: Studio's shared pieces move into Nexus one at a time, and Platform takes them.
 *  3. One look: Platform under the old tokens and the new, on a switch.
 */
const STEPS = ["Two looks", "Promote up", "One look"] as const;
const PROMOTABLE = ["Icons", "Colour and type tokens", "Buttons and inputs", "List toolbar", "Page header"] as const;

type State = { step: number; promoted: number; tone: Tone };
const START: State = { step: 0, promoted: 0, tone: "today" };

export function NexusHero({ autoplay = false, still }: { autoplay?: boolean; still?: State }) {
  const [s, setS] = useState<State>(still ?? START);
  const footer = useHeroFooter();
  const reduced = useReducedMotion();
  const timers = useRef<number[]>([]);

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };
  const later = useCallback((ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  const goto = useCallback((step: number) => {
    const n = Math.max(0, Math.min(STEPS.length - 1, step));
    setS({ step: n, promoted: n === 2 ? PROMOTABLE.length : 0, tone: "today" });
  }, []);

  // the self-driving version
  useEffect(() => {
    if (!autoplay || still) return;
    clear();
    const run = () => {
      setS(START);
      later(2600, () => setS({ step: 1, promoted: 0, tone: "today" }));
      PROMOTABLE.forEach((_, i) => later(3400 + i * 900, () => setS((p) => ({ ...p, promoted: i + 1 }))));
      later(3400 + PROMOTABLE.length * 900 + 1200, () => setS({ step: 2, promoted: PROMOTABLE.length, tone: "today" }));
      later(3400 + PROMOTABLE.length * 900 + 2600, () => setS((p) => ({ ...p, tone: "next" })));
      later(3400 + PROMOTABLE.length * 900 + 6400, run);
    };
    run();
    return clear;
  }, [autoplay, still, later]);

  useEffect(() => {
    if (still) return;
    footer.set({
      steps: [...STEPS],
      current: s.step,
      onStep: autoplay ? undefined : goto,
      actions: [{ label: "Restart", icon: <RotateCcw size={13} />, onClick: () => goto(0), hidden: autoplay }],
    });
    return () => footer.set(null);
  }, [s.step, autoplay, still, footer, goto]);

  const promoteNext = () => setS((p) => ({ ...p, promoted: Math.min(PROMOTABLE.length, p.promoted + 1) }));
  const platformTone: Tone = s.step === 1 ? (s.promoted === PROMOTABLE.length ? "next" : "today") : s.tone;
  const interactive = !autoplay && !still;

  return (
    <div className="relative h-full w-full select-none text-ink">
      <AnimatePresence mode="wait" initial={false}>
        {s.step === 0 && (
          <Pane key="two">
            <div className="grid h-full grid-cols-2 gap-4">
              <Card label="Platform today" sub="Grew for years without a shared foundation">
                <MockPage tone="today" app="Platform" />
              </Card>
              <Card label="RCS Studio" sub="The newest product, and the design direction">
                <MockPage tone="next" app="RCS Studio" />
              </Card>
            </div>
          </Pane>
        )}

        {s.step === 1 && (
          <Pane key="promote">
            <div className="grid h-full grid-cols-[1fr_auto_1fr] items-stretch gap-3 md:gap-4">
              <Card label="RCS Studio" sub="Builds the new pattern first">
                <MockPage tone="next" app="RCS Studio" compact />
              </Card>
              <div className="flex w-[clamp(150px,20vw,230px)] flex-col items-center justify-center gap-2">
                <div className="label text-muted">Promote up</div>
                <div className="bubble-sm w-full border border-accent bg-surface p-2.5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-display text-[14px] font-bold text-ink">Nexus</span>
                    <span className="label text-muted">{s.promoted}/{PROMOTABLE.length}</span>
                  </div>
                  <ol className="grid gap-1.5">
                    {PROMOTABLE.map((p, i) => {
                      const on = i < s.promoted;
                      return (
                        <motion.li
                          key={p}
                          initial={false}
                          animate={{ opacity: on ? 1 : 0.35, x: on ? 0 : reduced ? 0 : -6 }}
                          transition={{ duration: 0.45 }}
                          className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-[11.5px] font-medium ${on ? "bg-accent-soft text-accent" : "text-muted"}`}
                        >
                          {on ? <Check size={11} /> : <ArrowUpFromLine size={11} />}
                          <span className="truncate">{p}</span>
                        </motion.li>
                      );
                    })}
                  </ol>
                </div>
                {interactive && (
                  <button
                    type="button"
                    onClick={promoteNext}
                    disabled={s.promoted >= PROMOTABLE.length}
                    className="label inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-bg transition-opacity disabled:opacity-40"
                  >
                    Promote <ArrowRight size={12} />
                  </button>
                )}
                <div className="flex items-center gap-1 text-muted" aria-hidden="true">
                  <ArrowRight size={14} />
                </div>
              </div>
              <Card label="Platform" sub={platformTone === "next" ? "Takes the Nexus version" : "Waits for the shared pieces"}>
                <MockPage tone={platformTone} app="Platform" compact />
              </Card>
            </div>
          </Pane>
        )}

        {s.step === 2 && (
          <Pane key="one">
            <div className="grid h-full grid-rows-[auto_1fr] gap-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[14px] font-semibold text-ink">Platform, through the system</div>
                  <div className="text-[12.5px] text-muted">Tokens and icons app-wide first, then components, then pages.</div>
                </div>
                <div role="group" aria-label="Tokens" className="flex items-center rounded-full border border-rule bg-surface p-0.5">
                  {(["today", "next"] as Tone[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      aria-pressed={s.tone === t}
                      disabled={!interactive}
                      onClick={() => setS((p) => ({ ...p, tone: t }))}
                      className={`label rounded-full px-3 py-1 transition-colors ${s.tone === t ? "bg-accent text-bg" : "text-muted"}`}
                    >
                      {t === "today" ? "Today" : "Nexus next"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="min-h-0 overflow-hidden rounded-[12px] border border-rule shadow-[var(--shadow)]">
                <MockPage tone={s.tone} app="Platform" />
              </div>
            </div>
          </Pane>
        )}
      </AnimatePresence>
    </div>
  );
}

function Pane({ children }: { children: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="absolute inset-0">
      {children}
    </motion.div>
  );
}

function Card({ label, sub, children }: { label: string; sub: string; children: ReactNode }) {
  return (
    <div className="grid min-h-0 grid-rows-[auto_1fr] gap-2">
      <div className="px-0.5">
        <div className="text-[13.5px] font-semibold leading-tight text-ink">{label}</div>
        <div className="truncate text-[12px] text-muted">{sub}</div>
      </div>
      <div className="min-h-0 overflow-hidden rounded-[12px] border border-rule shadow-[var(--shadow)]">{children}</div>
    </div>
  );
}

export const nexusStills: { render: ReactNode; caption: string }[] = [
  { render: <div className="absolute inset-0 p-4"><NexusHero still={{ step: 0, promoted: 0, tone: "today" }} /></div>, caption: "Two looks: Platform grew without a shared foundation; RCS Studio set the direction." },
  { render: <div className="absolute inset-0 p-4"><NexusHero still={{ step: 1, promoted: 5, tone: "today" }} /></div>, caption: "Promote up: Studio's shared pieces land in Nexus, and Platform takes the Nexus version." },
  { render: <div className="absolute inset-0 p-4"><NexusHero still={{ step: 2, promoted: 5, tone: "next" }} /></div>, caption: "One look: the same Platform page under Nexus next." },
];
