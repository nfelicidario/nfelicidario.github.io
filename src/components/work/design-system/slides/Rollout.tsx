import { Check, Circle, CircleDot } from "lucide-react";

/* Slide 9: Studio first, then Platform, in three layers; adoption tracked page by page. Page names are illustrative. */

type Layer = 0 | 1 | 2 | 3; // 0 none, 1 tokens and icons, 2 components, 3 templates
const LAYERS = ["Tokens and icons", "Components", "Templates"];

const groups: { app: string; why: string; pages: { name: string; done: Layer }[] }[] = [
  {
    app: "RCS Studio",
    why: "Closest to the direction, so it tests the system with the least change",
    pages: [
      { name: "Agents", done: 3 },
      { name: "Launch flow", done: 3 },
      { name: "Flows", done: 2 },
      { name: "Settings", done: 2 },
    ],
  },
  {
    app: "Platform",
    why: "Starting with the pages sales demos most and the busiest pages by analytics",
    pages: [
      { name: "Campaigns", done: 1 },
      { name: "Audiences", done: 1 },
      { name: "Reports", done: 0 },
      { name: "Settings", done: 0 },
    ],
  },
];

function Mark({ state }: { state: "done" | "now" | "later" }) {
  if (state === "done") return <Check size={12} className="text-accent" aria-hidden="true" />;
  if (state === "now") return <CircleDot size={12} className="text-accent" aria-hidden="true" />;
  return <Circle size={12} className="text-rule" aria-hidden="true" />;
}

export function Rollout() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
      <div className="grid content-start gap-3">
        <div className="bubble-sm border border-rule bg-bg p-4">
          <div className="label mb-2">Roll it out in layers</div>
          <ol className="grid gap-2">
            {[
              ["Swap tokens and icons app-wide", "Cheap, with a broad visual payoff"],
              ["Replace components", "One at a time, with a deprecation path"],
              ["Rebuild pages on the templates", "The busiest and most demoed pages first"],
            ].map(([t, s], i) => (
              <li key={t} className="flex items-start gap-2.5">
                <span className="num mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-soft text-[10.5px] font-semibold text-accent">{i + 1}</span>
                <span>
                  <span className="block text-[13px] font-semibold leading-tight text-ink">{t}</span>
                  <span className="block text-[12px] text-muted">{s}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div className="bubble-sm border border-rule bg-bg p-4">
          <div className="label mb-2">Support for the teams</div>
          <ul className="grid gap-1 text-[12.5px] text-body">
            <li>Migration guides</li>
            <li>Automated code changes where possible</li>
            <li>Office hours and reviews</li>
          </ul>
        </div>
      </div>

      <div className="bubble-sm overflow-hidden border border-rule bg-bg">
        <div className="grid grid-cols-[1fr_repeat(3,minmax(0,96px))] items-center gap-3 border-b border-rule px-4 py-2.5">
          <span className="label">Adoption, page by page</span>
          {LAYERS.map((l) => (
            <span key={l} className="label text-center leading-tight text-muted">{l}</span>
          ))}
        </div>
        {groups.map((g) => (
          <div key={g.app}>
            <div className="border-b border-rule bg-surface px-4 py-2">
              <span className="text-[13px] font-semibold text-ink">{g.app}</span>
              <span className="ml-2 text-[12px] text-muted">{g.why}</span>
            </div>
            <ul className="divide-y divide-rule">
              {g.pages.map((p) => (
                <li key={p.name} className="grid grid-cols-[1fr_repeat(3,minmax(0,96px))] items-center gap-3 px-4 py-1.5 text-[12.5px] text-body">
                  <span>{p.name}</span>
                  {LAYERS.map((_, i) => {
                    const n = (i + 1) as Layer;
                    const state = p.done >= n ? "done" : p.done === n - 1 ? "now" : "later";
                    return (
                      <span key={i} className="flex justify-center">
                        <Mark state={state} />
                      </span>
                    );
                  })}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-rule px-4 py-2 text-[11.5px] text-muted">
          <span className="flex items-center gap-1"><Mark state="done" /> landed</span>
          <span className="flex items-center gap-1"><Mark state="now" /> next</span>
          <span className="flex items-center gap-1"><Mark state="later" /> later</span>
          <span className="ml-auto">Illustrative pages and states</span>
        </div>
      </div>
    </div>
  );
}
