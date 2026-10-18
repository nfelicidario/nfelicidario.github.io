"use client";

import { useId, useState } from "react";

type Node = { x: number; y: number; w?: number; options: number };

/* Abstract shapes only. Nothing here is a real screen. */
const before: Node[] = [
  { x: 20, y: 22, options: 4 },
  { x: 150, y: 14, options: 5 },
  { x: 280, y: 30, options: 3 },
  { x: 40, y: 104, options: 5 },
  { x: 170, y: 96, options: 4 },
  { x: 300, y: 112, options: 5 },
  { x: 20, y: 186, options: 3 },
  { x: 150, y: 178, options: 4 },
  { x: 280, y: 194, options: 5 },
];
const beforeEdges: [number, number][] = [
  [0, 1], [1, 2], [0, 4], [1, 4], [2, 5], [3, 4], [4, 5], [3, 6], [4, 7], [5, 8], [1, 3], [4, 8], [2, 7], [6, 7], [7, 8],
];

const W = 96;
const H = 54;
/* Simplified path: three narrower step nodes, then the end card. */
const AW = 84;
const END = { x: 316, y: 90, w: 68, h: 84 };

function center(n: Node) {
  return { cx: n.x + W / 2, cy: n.y + H / 2 };
}

export function Simplify() {
  const [after, setAfter] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const id = useId();

  const afterNodes: Node[] = [
    { x: 16, y: 104, options: 1 },
    { x: 116, y: 104, options: 1 },
    { x: 216, y: 104, options: 1 },
  ];

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div role="group" aria-label="Original or simplified" className="inline-flex rounded-full border border-rule bg-bg p-0.5">
          {(["Original", "Simplified"] as const).map((l) => {
            const active = (l === "Simplified") === after;
            return (
              <button
                key={l}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setAfter(l === "Simplified");
                  setAdvanced(false);
                }}
                className={`rounded-full px-3 py-1 text-[12.5px] font-medium transition-colors ${
                  active ? "bg-accent text-bg" : "text-muted hover:text-ink"
                }`}
              >
                {l}
              </button>
            );
          })}
        </div>
        <span className="text-[12px] text-muted">
          {after ? "Three steps to a working flow." : "Most beta users didn't use this correctly or at all."}
        </span>
      </div>

      <svg
        viewBox="0 0 400 260"
        role="img"
        aria-labelledby={`${id}-t`}
        className="block w-full rounded-[12px] border border-rule bg-bg"
      >
        <title id={`${id}-t`}>
          {after
            ? "Simplified builder: three steps in a row leading to a working flow, with advanced options collapsed"
            : "Original builder: nine nodes with crossing connections and many options each"}
        </title>

        {!after && (
          <g>
            {beforeEdges.map(([a, b]) => {
              const p = center(before[a]);
              const q = center(before[b]);
              return (
                <line
                  key={`${a}-${b}`}
                  x1={p.cx}
                  y1={p.cy}
                  x2={q.cx}
                  y2={q.cy}
                  stroke="var(--rule)"
                  strokeWidth="1.5"
                />
              );
            })}
            {before.map((n, i) => (
              <g key={i} transform={`translate(${n.x} ${n.y})`}>
                <rect width={W} height={H} rx="8" fill="var(--surface)" stroke="var(--rule)" />
                <rect x="10" y="10" width="46" height="6" rx="3" fill="var(--ink)" opacity="0.7" />
                {Array.from({ length: n.options }).map((_, k) => (
                  <g key={k} transform={`translate(${10 + k * 16} 26)`}>
                    <rect width="12" height="12" rx="3" fill="var(--raised)" stroke="var(--rule)" />
                    {k % 2 === 0 && <rect x="3" y="3" width="6" height="6" rx="1.5" fill="var(--muted)" />}
                  </g>
                ))}
                <rect x="10" y="42" width="60" height="4" rx="2" fill="var(--muted)" opacity="0.5" />
              </g>
            ))}
          </g>
        )}

        {after && (
          <g>
            {afterNodes.map((n, i) => {
              const cy = n.y + H / 2;
              const x1 = n.x + AW;
              const x2 = i < afterNodes.length - 1 ? afterNodes[i + 1].x : END.x;
              return (
                <g key={i}>
                  <line x1={x1} y1={cy} x2={x2} y2={cy} stroke="var(--accent)" strokeWidth="1.5" />
                  <circle cx={x2} cy={cy} r="3" fill="var(--accent)" />
                </g>
              );
            })}
            {afterNodes.map((n, i) => (
              <g key={i} transform={`translate(${n.x} ${n.y})`}>
                <text x="0" y="-6" fontSize="10" fill="var(--muted)">
                  Step {i + 1}
                </text>
                <rect width={AW} height={H} rx="8" fill="var(--surface)" stroke="var(--accent)" strokeWidth="1.5" />
                <rect x="10" y="12" width="46" height="6" rx="3" fill="var(--ink)" opacity="0.8" />
                <rect x="10" y="26" width={AW - 20} height="14" rx="4" fill="var(--accent-soft)" />
                <rect x="16" y="31" width="28" height="4" rx="2" fill="var(--accent)" />
              </g>
            ))}

            {/* End card: the RCS message the three steps produce. */}
            <g transform={`translate(${END.x} ${END.y})`}>
              <text x={END.w / 2} y="-6" textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--accent)">
                Working flow
              </text>
              <rect width={END.w} height={END.h} rx="8" fill="var(--surface)" stroke="var(--rule)" />
              <rect x="6" y="6" width={END.w - 12} height="24" rx="4" fill="var(--accent-soft)" />
              <rect x="6" y="36" width="44" height="4" rx="2" fill="var(--ink)" opacity="0.7" />
              <rect x="6" y="44" width="32" height="4" rx="2" fill="var(--muted)" opacity="0.5" />
              <rect x="6" y="54" width={END.w - 12} height="10" rx="5" fill="none" stroke="var(--accent)" />
              <rect x="6" y="68" width={END.w - 12} height="10" rx="5" fill="none" stroke="var(--accent)" />
            </g>

            {advanced &&
              afterNodes.map((n, i) => (
                <g key={i} transform={`translate(${n.x + 12} 182)`} opacity="0.7">
                  <line x1={AW / 2 - 12} y1="-24" x2={AW / 2 - 12} y2="0" stroke="var(--rule)" strokeDasharray="3 3" />
                  <rect width={AW - 24} height="34" rx="6" fill="var(--surface)" stroke="var(--rule)" />
                  {[0, 1, 2].map((k) => (
                    <rect key={k} x={8 + k * 16} y="11" width="12" height="12" rx="3" fill="var(--raised)" stroke="var(--rule)" />
                  ))}
                </g>
              ))}
          </g>
        )}
      </svg>

      {after && (
        <ul className="mt-2 flex flex-wrap items-center gap-2 text-[12px] text-muted">
          <li className="inline-flex items-center gap-1.5 rounded-full border border-rule bg-surface px-2.5 py-0.5">
            <span aria-hidden="true" className="h-[2px] w-4 bg-accent" />
            Default path
          </li>
          <li className="inline-flex items-center gap-1.5 rounded-full border border-rule bg-surface px-2.5 py-0.5">
            <span aria-hidden="true" className="w-4 border-t border-dashed border-rule" />
            Behind Advanced
          </li>
        </ul>
      )}

      {after && (
        <div className="mt-3 flex items-center justify-between gap-3">
          <button
            type="button"
            aria-expanded={advanced}
            onClick={() => setAdvanced((a) => !a)}
            className="inline-flex items-center gap-1.5 rounded-full border border-rule bg-surface px-3 py-1 text-[12.5px] font-medium text-ink hover:border-accent hover:text-accent"
          >
            <span aria-hidden="true" className={`inline-block transition-transform ${advanced ? "rotate-90" : ""}`}>
              ›
            </span>
            Advanced
          </button>
          <span className="text-[12px] text-muted">
            {advanced ? "Where the handful of power users work." : "Everything else lives here."}
          </span>
        </div>
      )}
    </div>
  );
}
