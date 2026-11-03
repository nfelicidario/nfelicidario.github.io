import { Boxes, Camera, FileCheck2, Map, Trophy } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* Slide 3: the two inventories, the scoring of possible first projects, and the deliverables. */

type Score = 1 | 2 | 3;
const candidates: { name: string; visible: Score; risk: Score; effort: Score; depends: string; win?: boolean }[] = [
  { name: "Icons", visible: 3, risk: 1, effort: 2, depends: "Nothing", win: true },
  { name: "Colour tokens", visible: 3, risk: 2, effort: 2, depends: "An agreed direction" },
  { name: "Type scale", visible: 3, risk: 2, effort: 1, depends: "An agreed direction" },
  { name: "Buttons and inputs", visible: 2, risk: 2, effort: 3, depends: "Tokens" },
  { name: "App shell", visible: 2, risk: 3, effort: 3, depends: "Tokens, components" },
  { name: "List toolbar", visible: 1, risk: 2, effort: 2, depends: "Components" },
];

function Dots({ n, invert = false }: { n: Score; invert?: boolean }) {
  // three dots; for risk and effort, fewer filled is better, so the tone flips
  const good = invert ? n === 1 : n === 3;
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${n} of 3`}>
      {[1, 2, 3].map((i) => (
        <span key={i} className={`block h-2 w-2 rounded-full ${i <= n ? (good ? "bg-accent" : "bg-ink/60") : "bg-rule"}`} />
      ))}
    </span>
  );
}

const inventories: { Icon: LucideIcon; title: string; text: string }[] = [
  { Icon: Boxes, title: "Take stock of Nexus", text: "Components, tokens, and icons, and which ones each app actually uses, duplicates, or overrides" },
  { Icon: Camera, title: "Take stock of the UI", text: "Key pages in Platform and Studio, and every inconsistency: colours, type sizes, spacing, button styles, icons" },
];

const deliverables: { Icon: LucideIcon; title: string }[] = [
  { Icon: FileCheck2, title: "A current-state audit" },
  { Icon: Map, title: "A prioritized roadmap" },
];

export function FirstWin() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.3fr]">
      <div className="grid gap-3">
        {inventories.map(({ Icon, title, text }) => (
          <div key={title} className="bubble-sm border border-rule bg-bg p-4">
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className="grid h-7 w-7 place-items-center rounded-full bg-accent-soft text-accent">
                <Icon size={14} />
              </span>
              <span className="text-[14px] font-semibold text-ink">{title}</span>
            </div>
            <p className="mt-2 text-[12.5px] leading-snug text-muted">{text}</p>
          </div>
        ))}
        <div className="bubble-sm border border-dashed border-rule p-4">
          <div className="label mb-2">Deliverables</div>
          <ul className="grid gap-1.5">
            {deliverables.map(({ Icon, title }) => (
              <li key={title} className="flex items-center gap-2 text-[13px] text-ink">
                <Icon size={13} className="text-accent" aria-hidden="true" />
                {title}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bubble-sm overflow-hidden border border-rule bg-bg">
        <div className="flex items-center justify-between border-b border-rule px-4 py-2.5">
          <span className="label">Scoring the first project</span>
          <span className="label text-muted">more dots, more</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[460px] text-[12.5px]">
            <thead>
              <tr className="label text-muted">
                <th className="px-4 py-2 text-left font-semibold">Candidate</th>
                <th className="px-2 py-2 text-left font-semibold">Visible</th>
                <th className="px-2 py-2 text-left font-semibold">Risk</th>
                <th className="px-2 py-2 text-left font-semibold">Effort</th>
                <th className="px-4 py-2 text-left font-semibold">Depends on</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((c) => (
                <tr key={c.name} className={`border-t border-rule ${c.win ? "bg-accent-soft/60" : ""}`}>
                  <td className="px-4 py-2 font-semibold text-ink">
                    <span className="flex items-center gap-2">
                      {c.name}
                      {c.win && (
                        <span className="label inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-bg">
                          <Trophy size={10} aria-hidden="true" /> First
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="px-2 py-2"><Dots n={c.visible} /></td>
                  <td className="px-2 py-2"><Dots n={c.risk} invert /></td>
                  <td className="px-2 py-2"><Dots n={c.effort} invert /></td>
                  <td className={`px-4 py-2 ${c.win ? "font-semibold text-accent" : "text-muted"}`}>{c.depends}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="border-t border-rule px-4 py-2.5 text-[12px] leading-snug text-muted">
          Icons came out on top: they appear on every page, they are low risk, and they depend on nothing else.
        </p>
      </div>
    </div>
  );
}
