"use client";

import { useState } from "react";

type Mode = "before" | "after";

const reactions = [
  { id: "up", emoji: "👍", label: "Helpful", reply: "Glad it landed. Learning 5 arrives Thursday." },
  { id: "hmm", emoji: "🤔", label: "Not sure", reply: "Fair. Reply here and a coach will go deeper on this one." },
  { id: "down", emoji: "👎", label: "Not for me", reply: "Noted. The rest of this track will lean toward what you flagged." },
] as const;

type ReactionId = (typeof reactions)[number]["id"];

function StrideMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={className}>
      <rect width="40" height="40" rx="9" fill="#f1c233" />
      <path
        d="M8 26c4-10 8-12 11-8s5 6 13-8"
        fill="none"
        stroke="#0b1b33"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Header({ time }: { time: string }) {
  return (
    <div className="flex items-center gap-2 text-[13px]">
      <span className="font-bold text-ink">Stride</span>
      <span className="rounded bg-raised px-1 py-px text-[10px] font-semibold text-muted">APP</span>
      <span className="text-muted">{time}</span>
    </div>
  );
}

function BeforeMessage() {
  return (
    <div className="grid grid-cols-[32px_1fr] gap-3">
      <StrideMark className="mt-0.5 h-8 w-8" />
      <div className="min-w-0 text-[14px] leading-relaxed text-body">
        <Header time="9:02 AM" />
        <p className="mt-1 font-semibold text-ink">Make your deliverables SMART</p>
        <p className="mt-1">
          Specific, Measurable, Achievable, Relevant, Time-bound. Before you commit to your next
          deliverable, run it through all five and rewrite it until it passes.
        </p>
        <p className="mt-2 italic">Try it on one deliverable this week!</p>
      </div>
    </div>
  );
}

function AfterMessage({
  picked,
  onPick,
}: {
  picked: ReactionId | null;
  onPick: (id: ReactionId) => void;
}) {
  const reply = reactions.find((r) => r.id === picked)?.reply;
  return (
    <div className="grid grid-cols-[32px_1fr] gap-3">
      <StrideMark className="mt-0.5 h-8 w-8" />
      <div className="min-w-0 text-[14px] leading-relaxed text-body">
        <Header time="9:02 AM" />
        <div className="label mt-1.5 text-accent">Building Trust &amp; Safety · Learning 4 of 23</div>
        <p className="mt-1 font-semibold text-ink">Psychological safety is built in small moments</p>
        <p className="mt-1">
          Teams rarely lose trust in one big event. They lose it in small moments: a question that
          gets a sigh, a mistake that gets a name attached, an idea that gets talked over.
        </p>

        {/* video placeholder */}
        <div
          role="img"
          aria-label="Placeholder for a short video titled Why teams stop speaking up"
          className="bubble-sm relative mt-3 flex aspect-[16/7] items-center justify-center overflow-hidden"
          style={{ background: "linear-gradient(135deg, #1f4fe0, #0b1b33)" }}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 shadow">
            <svg viewBox="0 0 20 20" className="ml-0.5 h-5 w-5" aria-hidden="true">
              <path d="M6 4l10 6-10 6z" fill="#0b1b33" />
            </svg>
          </span>
          <span className="absolute bottom-2 left-3 text-[12px] font-medium text-white/90">
            Short video · Why teams stop speaking up
          </span>
        </div>

        <ol className="mt-3 grid gap-2">
          {[
            "Reward the question, not just the answer. Thank the person who asked before you respond.",
            "Name your own mistake first in your next team meeting. It sets the price of admitting one.",
          ].map((t, i) => (
            <li key={t} className="grid grid-cols-[22px_1fr] gap-2">
              <span className="num flex h-[22px] w-[22px] items-center justify-center rounded-full bg-accent-soft text-[11px] font-bold text-accent">
                {i + 1}
              </span>
              <span>{t}</span>
            </li>
          ))}
        </ol>

        <p className="mt-3 font-semibold text-ink">Was this learning helpful?</p>
        <div className="mt-1.5 flex flex-wrap gap-2" role="group" aria-label="Reactions">
          {reactions.map((r) => {
            const on = picked === r.id;
            return (
              <button
                key={r.id}
                type="button"
                aria-pressed={on}
                onClick={() => onPick(r.id)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12.5px] font-medium transition-colors ${
                  on
                    ? "border-accent bg-accent-soft text-ink"
                    : "border-rule bg-surface text-body hover:border-accent"
                }`}
              >
                <span aria-hidden="true">{r.emoji}</span>
                {r.label}
              </button>
            );
          })}
        </div>

        <div aria-live="polite" className="min-h-[22px]">
          {reply && (
            <p className="mt-2 flex items-center gap-2 text-[13px] text-muted">
              <StrideMark className="h-4 w-4" />
              <span>{reply}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function LearningPrompt() {
  const [mode, setMode] = useState<Mode>("after");
  const [picked, setPicked] = useState<ReactionId | null>(null);

  function switchTo(m: Mode) {
    setMode(m);
    setPicked(null);
  }

  return (
    <figure className="bubble overflow-hidden border border-rule bg-surface shadow-[var(--shadow)]">
      <figcaption className="flex items-center justify-between gap-3 border-b border-rule px-4 py-2.5">
        <span className="label">The learning prompt, in Slack</span>
        <div
          role="group"
          aria-label="Show the message before or after the redesign"
          className="flex rounded-full border border-rule bg-raised p-0.5 text-[11.5px] font-semibold"
        >
          {(["before", "after"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => switchTo(m)}
              className={`rounded-full px-2.5 py-0.5 capitalize transition-colors ${
                mode === m ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </figcaption>
      <div className="p-4 md:p-5">
        {mode === "before" ? <BeforeMessage /> : <AfterMessage picked={picked} onPick={setPicked} />}
      </div>
      <div className="flex items-center justify-between border-t border-rule px-4 py-2 text-[11.5px] text-muted">
        <span>{mode === "before" ? "MVP: a weekly tip, one role, no path" : "Tracks: one learning on a 23-step path"}</span>
        <span className="rounded-full bg-raised px-2 py-0.5 font-medium">Mock data</span>
      </div>
    </figure>
  );
}
