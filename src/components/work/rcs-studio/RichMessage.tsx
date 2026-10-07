"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type Msg = { id: string; from: "bot" | "me"; kind?: "card"; text: string };

const script: Msg[] = [
  {
    id: "greet",
    from: "bot",
    text: "Hi Sam, it's Poblano's. The Tuesday Burrito Box is back this week.",
  },
  { id: "card", from: "bot", kind: "card", text: "Four burritos, chips, and two house salsas. Pickup only." },
];

const chips: { label: string; reply: string }[] = [
  { label: "Order for pickup", reply: "Done. Your box will be ready Tuesday at 5:30 pm. Reply CHANGE to pick another time." },
  { label: "What's in it?", reply: "Four chicken or veggie burritos, tortilla chips, and two house salsas. Feeds four." },
  { label: "Remind me Tuesday", reply: "Will do. I'll text you Tuesday morning." },
];

const STEP_MS = 650;

export function RichMessage() {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(reduced ? script.length : 0);
  const [extra, setExtra] = useState<Msg[]>([]);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(() => setShown(script.length), 0);
      return () => clearTimeout(t);
    }
    const timers = script.map((_, i) => setTimeout(() => setShown(i + 1), STEP_MS * (i + 1)));
    return () => timers.forEach(clearTimeout);
  }, [reduced, run]);

  const ready = shown >= script.length;
  const answered = extra.length > 0;

  function replay() {
    setExtra([]);
    setShown(reduced ? script.length : 0);
    setRun((r) => r + 1);
  }

  function pick(c: (typeof chips)[number]) {
    if (answered) return;
    setExtra([{ id: `me-${run}`, from: "me", text: c.label }]);
    setTimeout(() => {
      setExtra((e) => [...e, { id: `bot-${run}`, from: "bot", text: c.reply }]);
    }, reduced ? 0 : STEP_MS);
  }

  const messages = [...script.slice(0, shown), ...extra];

  return (
    <div className="mx-auto w-full max-w-[320px]">
      <div className="rounded-[36px] border border-rule bg-raised p-2.5 shadow-[var(--shadow)]">
        <div className="flex h-[520px] flex-col overflow-hidden rounded-[28px] bg-bg">
          <div className="flex items-center gap-2.5 border-b border-rule bg-surface px-4 pt-3 pb-2.5">
            <span
              aria-hidden="true"
              className="grid h-8 w-8 place-items-center rounded-full bg-accent text-[13px] font-bold text-white"
            >
              P
            </span>
            <div className="min-w-0 leading-tight">
              <div className="truncate text-[13.5px] font-semibold text-ink">Poblano&apos;s Mexican Grill</div>
              <div className="flex items-center gap-1 text-[11px] text-muted">
                <span aria-hidden="true" className="inline-block h-1.5 w-1.5 rounded-full bg-ok" />
                Verified sender
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-2 overflow-hidden px-3 py-3" aria-live="polite">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  layout
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className={m.from === "me" ? "self-end" : "self-start"}
                >
                  {m.kind === "card" ? (
                    <div className="bubble w-[232px] overflow-hidden border border-rule bg-surface">
                      <div
                        aria-hidden="true"
                        className="h-[104px] bg-[linear-gradient(135deg,var(--accent)_0%,var(--accent-soft)_60%,var(--raised)_100%)]"
                      />
                      <div className="px-3 py-2.5">
                        <div className="text-[13.5px] font-semibold text-ink">Tuesday Burrito Box</div>
                        <p className="mt-0.5 text-[12.5px] leading-snug text-body">{m.text}</p>
                      </div>
                    </div>
                  ) : m.from === "me" ? (
                    <div className="bubble-me max-w-[220px] bg-accent px-3 py-2 text-[13px] leading-snug text-white">
                      {m.text}
                    </div>
                  ) : (
                    <div className="bubble max-w-[232px] border border-rule bg-surface px-3 py-2 text-[13px] leading-snug text-ink">
                      {m.text}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="border-t border-rule bg-surface px-3 pt-2.5 pb-3">
            <div className="label mb-2 text-[10px]">Suggested replies</div>
            <div className="flex flex-wrap gap-1.5">
              {chips.map((c) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => pick(c)}
                  disabled={!ready || answered}
                  className="rounded-full border border-accent bg-surface px-3 py-1 text-[12.5px] font-medium text-accent transition-colors hover:bg-accent-soft disabled:cursor-default disabled:opacity-40"
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-[12px] text-muted">
        <span>Fictional brand, mock conversation.</span>
        <button
          type="button"
          onClick={replay}
          className="rounded-full border border-rule bg-surface px-3 py-1 text-[12px] font-medium text-ink hover:border-accent hover:text-accent"
        >
          Replay
        </button>
      </div>
    </div>
  );
}
