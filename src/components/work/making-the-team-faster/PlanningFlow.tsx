"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type Stage = {
  id: string;
  name: string;
  owner: string;
  note: string;
  gate?: string;
  chips: string[];
};

/** Six project stages. Mock project names; the ownership and gate rule are the real workflow. */
const stages: Stage[] = [
  {
    id: "open",
    name: "Open",
    owner: "Product",
    note: "Ideas and requests land here. Anyone can add one; product keeps the list honest.",
    chips: ["Bulk import", "Keyboard shortcuts"],
  },
  {
    id: "planned",
    name: "Planned",
    owner: "Product",
    note: "Committed to a cycle. The problem is written down and the outcome is named before anyone sizes it.",
    chips: ["Audit log"],
  },
  {
    id: "shaping",
    name: "Shaping",
    owner: "Engineering pod, with product in the room",
    note: "The pod breaks the project into issues. Open questions get answered here, not mid-build.",
    chips: ["Template picker", "Rate limits"],
  },
  {
    id: "in-progress",
    name: "In Progress",
    owner: "Engineering",
    note: "Issues are being built. Designs, if any, live on a branch in a shared environment.",
    gate: "Nothing enters In Progress without issues and shared understanding.",
    chips: ["Export v2"],
  },
  {
    id: "ready",
    name: "Ready to Deploy",
    owner: "Engineering",
    note: "Merged and clicked through in a shared environment. Waiting on a release window.",
    chips: ["Saved views"],
  },
  {
    id: "done",
    name: "Done",
    owner: "Everyone",
    note: "Shipped and shown in the sprint review. The project closes; the next one is already shaping.",
    chips: ["Inline search", "Dark mode"],
  },
];

const GATE_AFTER = "shaping";

export function PlanningFlow() {
  const [active, setActive] = useState<string>("in-progress");
  const [hovered, setHovered] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const panelId = useId();
  const current = stages.find((s) => s.id === (hovered ?? active)) ?? stages[3];

  return (
    <div className="grid gap-4">
      <div className="-mx-1 overflow-x-auto px-1 pb-1">
        <ol
          className="grid min-w-[560px] grid-cols-6 gap-1.5"
          aria-label="Project stages"
          onMouseLeave={() => setHovered(null)}
        >
          {stages.map((s, i) => {
            const isActive = s.id === current.id;
            const gateBefore = stages[i - 1]?.id === GATE_AFTER;
            return (
              <li key={s.id} className="relative min-w-0">
                {gateBefore && (
                  <span
                    aria-hidden="true"
                    className="absolute -left-[4px] top-0 bottom-0 border-l-2 border-dashed border-accent"
                  />
                )}
                <button
                  type="button"
                  aria-pressed={isActive}
                  aria-controls={panelId}
                  onMouseEnter={() => setHovered(s.id)}
                  onFocus={() => setHovered(s.id)}
                  onBlur={() => setHovered(null)}
                  onClick={() => setActive(s.id)}
                  className={`bubble-sm grid w-full gap-2 border p-2.5 text-left transition-colors ${
                    isActive
                      ? "border-accent bg-accent-soft"
                      : "border-rule bg-raised hover:border-accent"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="label num text-[10px]">{i + 1}</span>
                    <span className="truncate text-[12.5px] font-semibold text-ink">{s.name}</span>
                  </span>
                  <span className="grid min-h-[52px] content-start gap-1" aria-hidden="true">
                    {s.chips.map((c) => (
                      <span
                        key={c}
                        className="truncate rounded-md border border-rule bg-surface px-1.5 py-0.5 text-[10.5px] text-body"
                      >
                        {c}
                      </span>
                    ))}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        <div className="mt-1.5 grid min-w-[560px] grid-cols-6 text-[10.5px] text-muted">
          <span className="col-span-2 pl-1">Product</span>
          <span className="pl-1">Pod + product</span>
          <span className="col-span-2 pl-2 text-accent">Gate ↑ issues and shared understanding</span>
          <span className="pl-1">Everyone</span>
        </div>
      </div>

      <div id={panelId} aria-live="polite" className="bubble-sm min-h-[108px] border border-rule bg-raised p-3.5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current.id}
            initial={reduce ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: reduce ? 0 : 0.18 }}
            className="grid gap-1.5"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <span className="text-[14px] font-semibold text-ink">{current.name}</span>
              <span className="label">Owned by {current.owner}</span>
            </div>
            <p className="text-[13px] leading-snug">{current.note}</p>
            {current.gate && (
              <p className="mt-0.5 text-[13px] font-medium leading-snug text-accent">
                Gate rule: {current.gate}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <p className="text-[11.5px] text-muted">Hover or tap a stage to see who owns it. Project names are mock.</p>
    </div>
  );
}

/** How work relates: one initiative, a few projects, issues under each. Static. */
export function IssueHierarchy() {
  const projects = [
    { name: "Project", issues: 4 },
    { name: "Project", issues: 3 },
    { name: "Project", issues: 5 },
  ];
  return (
    <div className="grid gap-3">
      <div className="bubble-sm border border-accent bg-accent-soft px-3 py-2">
        <div className="label text-accent">Initiative</div>
        <div className="mt-1 h-2.5 w-2/3 rounded-full bg-accent/50" aria-hidden="true" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {projects.map((p, i) => (
          <div key={i} className="grid gap-2">
            <div className="bubble-sm border border-rule bg-raised px-2.5 py-2">
              <div className="label">{p.name}</div>
              <div className="mt-1 flex items-center gap-1 text-[10.5px] text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                six stages
              </div>
            </div>
            <ul className="grid gap-1" aria-label={`${p.issues} issues`}>
              {Array.from({ length: p.issues }).map((_, j) => (
                <li
                  key={j}
                  className="flex items-center gap-1.5 rounded-md border border-rule bg-surface px-2 py-1"
                >
                  <span className="h-2 w-2 rounded-[3px] border border-muted" aria-hidden="true" />
                  <span
                    className="h-1.5 rounded-full bg-raised"
                    style={{ width: `${45 + ((i * 7 + j * 13) % 40)}%` }}
                    aria-hidden="true"
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="text-[11.5px] text-muted">
        Initiatives hold projects. Projects move through the six stages. Issues are the unit engineers pick up.
      </p>
    </div>
  );
}
