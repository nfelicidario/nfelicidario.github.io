"use client";

import { useId, useState } from "react";
import { useReducedMotion } from "motion/react";

type Feature = "submissions" | "flows";

const features: { id: Feature; name: string; caption: string }[] = [
  {
    id: "submissions",
    name: "Submissions flow",
    caption: "A submissions flow: one page per step of an external review, with status carried across steps.",
  },
  {
    id: "flows",
    name: "Messages to flows",
    caption:
      "A messages-to-flows change: flows and keywords were introduced, and links and codes attach to a flow instead of a single message.",
  },
];

/* Abstract UI tiles. Grey bars stand in for text; nothing here is a real screen. */
function Bar({ w, tone = "raised", h = "h-2" }: { w: string; tone?: "raised" | "accent" | "ink"; h?: string }) {
  const bg = tone === "accent" ? "bg-accent/60" : tone === "ink" ? "bg-ink/70" : "bg-raised";
  return <span className={`block ${h} rounded-full ${bg}`} style={{ width: w }} aria-hidden="true" />;
}

function SubmissionsTiles({ live }: { live: boolean }) {
  const steps = ["Details", "Contact", "Content", "Review"];
  return (
    <div className="grid gap-3">
      <ol className="grid grid-cols-4 gap-1.5" aria-hidden="true">
        {steps.map((s, i) => (
          <li
            key={s}
            className={`rounded-md border px-2 py-1 text-[10px] ${
              i === 2 ? "border-accent bg-accent-soft text-accent" : "border-rule bg-raised text-muted"
            }`}
          >
            {i + 1}. {s}
          </li>
        ))}
      </ol>
      <div className="bubble-sm grid gap-2.5 border border-rule bg-raised p-3">
        <Bar w="38%" tone="ink" h="h-2.5" />
        <Bar w="72%" />
        <div className="grid grid-cols-2 gap-2 pt-1">
          <span className="grid gap-1.5">
            <Bar w="40%" />
            <span className="h-7 rounded-md border border-rule bg-surface" aria-hidden="true" />
          </span>
          <span className="grid gap-1.5">
            <Bar w="52%" />
            <span className="h-7 rounded-md border border-rule bg-surface" aria-hidden="true" />
          </span>
        </div>
        <span className="grid gap-1.5">
          <Bar w="30%" />
          <span className="h-14 rounded-md border border-rule bg-surface" aria-hidden="true" />
        </span>
        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] text-muted">{live ? "Saved to the record" : "Mock record"}</span>
          <span className="h-6 w-20 rounded-md bg-accent" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

function FlowsTiles({ live }: { live: boolean }) {
  return (
    <div className="grid grid-cols-[1.2fr_1fr] gap-3">
      <div className="bubble-sm grid gap-2.5 border border-rule bg-raised p-3">
        <div className="flex items-center justify-between">
          <Bar w="44%" tone="ink" h="h-2.5" />
          <span className="rounded-full bg-accent-soft px-1.5 py-0.5 text-[9.5px] text-accent">Flow</span>
        </div>
        <div className="flex flex-wrap gap-1" aria-hidden="true">
          {["JOIN", "HELP", "STOP"].map((k) => (
            <span key={k} className="rounded-md border border-rule bg-surface px-1.5 py-0.5 text-[9.5px] text-body">
              {k}
            </span>
          ))}
        </div>
        <ul className="grid gap-1.5" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <li key={i} className="grid gap-1 rounded-md border border-rule bg-surface p-2">
              <Bar w={`${55 + i * 12}%`} />
              <Bar w={`${30 + i * 8}%`} />
            </li>
          ))}
        </ul>
      </div>
      <div className="grid content-start gap-2">
        <span className="label">Attached to the flow</span>
        <div className="bubble-sm grid gap-1.5 border border-accent bg-accent-soft p-2.5">
          <span className="text-[10px] font-medium text-accent">Link</span>
          <Bar w="85%" tone="accent" />
        </div>
        <div className="bubble-sm grid gap-1.5 border border-accent bg-accent-soft p-2.5">
          <span className="text-[10px] font-medium text-accent">Code</span>
          <span
            className="grid h-10 w-10 grid-cols-4 gap-px overflow-hidden rounded-[3px] bg-surface p-0.5"
            aria-hidden="true"
          >
            {Array.from({ length: 16 }).map((_, i) => (
              <span key={i} className={`${(i * 7) % 3 === 0 ? "bg-ink/70" : "bg-transparent"} rounded-[1px]`} />
            ))}
          </span>
        </div>
        <span className="text-[10px] text-muted">{live ? "Live attachments" : "Mock attachments"}</span>
      </div>
    </div>
  );
}

function Screen({ feature, live }: { feature: Feature; live: boolean }) {
  return (
    <div className="grid h-full gap-3 bg-surface p-3">
      <div className="flex items-center justify-between border-b border-rule pb-2" aria-hidden="true">
        <span className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-raised" />
          <span className="h-2 w-2 rounded-full bg-raised" />
          <span className="h-2 w-2 rounded-full bg-raised" />
        </span>
        <span className="h-4 w-24 rounded-md bg-raised" />
      </div>
      {feature === "submissions" ? <SubmissionsTiles live={live} /> : <FlowsTiles live={live} />}
    </div>
  );
}

export function BranchAsSpec() {
  const [feature, setFeature] = useState<Feature>("submissions");
  const [pos, setPos] = useState(50);
  const reduce = useReducedMotion();
  const sliderId = useId();
  const current = features.find((f) => f.id === feature) ?? features[0];
  const transition = reduce ? "none" : "clip-path 220ms ease, left 220ms ease";

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div role="tablist" aria-label="Feature" className="flex gap-1">
          {features.map((f) => (
            <button
              key={f.id}
              role="tab"
              type="button"
              aria-selected={feature === f.id}
              onClick={() => setFeature(f.id)}
              className={`rounded-full border px-2.5 py-1 text-[11.5px] font-medium transition-colors ${
                feature === f.id ? "border-accent bg-accent-soft text-accent" : "border-rule bg-raised text-body"
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setPos(100)}
            className="rounded-full border border-rule bg-raised px-2.5 py-1 text-[11.5px] text-body hover:border-accent"
          >
            Prototype
          </button>
          <button
            type="button"
            onClick={() => setPos(0)}
            className="rounded-full border border-rule bg-raised px-2.5 py-1 text-[11.5px] text-body hover:border-accent"
          >
            Shipped
          </button>
        </div>
      </div>

      <div className="relative select-none overflow-hidden rounded-xl border border-rule" style={{ touchAction: "pan-y" }}>
        {/* prototype, underneath */}
        <div aria-label="Prototype branch, mock data">
          <Screen feature={feature} live={false} />
        </div>
        {/* shipped, on top, clipped from the left */}
        <div
          aria-label="Shipped, real data model"
          className="absolute inset-0"
          style={{ clipPath: `inset(0 0 0 ${pos}%)`, transition }}
        >
          <Screen feature={feature} live />
        </div>
        {/* handle */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 bottom-0 w-px bg-accent"
          style={{ left: `${pos}%`, transition }}
        >
          <span className="absolute top-1/2 left-1/2 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-accent bg-surface text-[10px] font-bold text-accent shadow-sm">
            ⇆
          </span>
        </div>
        <span className="pointer-events-none absolute top-2 left-2 rounded-full bg-raised/90 px-2 py-0.5 text-[10px] font-medium text-muted">
          Prototype branch · mock data
        </span>
        <span className="pointer-events-none absolute top-2 right-2 rounded-full bg-accent-soft/90 px-2 py-0.5 text-[10px] font-medium text-accent">
          Shipped · real data
        </span>
      </div>

      <label htmlFor={sliderId} className="grid gap-1">
        <span className="flex justify-between text-[11px] text-muted">
          <span>Shipped</span>
          <span>Drag to compare</span>
          <span>Prototype</span>
        </span>
        <input
          id={sliderId}
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          className="w-full accent-[var(--accent)]"
        />
      </label>

      <p className="text-[12.5px] leading-snug text-body">{current.caption}</p>
    </div>
  );
}
