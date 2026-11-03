import { ArrowRight, FileImage, Presentation, Table2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* Slide 1: three places where work was re-created instead of built on. Abstract, nothing is a real screen. */

const lanes: { Icon: LucideIcon; where: string; steps: string[]; cost: string }[] = [
  {
    Icon: FileImage,
    where: "Design",
    steps: ["Static Figma file", "Ticket describes it", "Engineering rebuilds it by hand", "Design QA finds the gaps"],
    cost: "Detail lost at every step",
  },
  {
    Icon: Table2,
    where: "Planning",
    steps: ["Team A's tracker", "Team B's spreadsheet", "Status chased in meetings", "Roadmap rebuilt by hand"],
    cost: "Nothing consistent for AI to work from",
  },
  {
    Icon: Presentation,
    where: "Presentations",
    steps: ["Blank deck", "Formatted slide by slide", "Brand fixed afterwards", "Different every time"],
    cost: "Hours of formatting per deck",
  },
];

export function ReCreated() {
  return (
    <div className="grid gap-3">
      {lanes.map(({ Icon, where, steps, cost }) => (
        <div key={where} className="bubble-sm grid items-center gap-3 border border-rule bg-bg p-3 md:grid-cols-[150px_1fr_190px]">
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
              <Icon size={15} />
            </span>
            <span className="text-[14px] font-semibold text-ink">{where}</span>
          </div>
          <ol className="flex flex-wrap items-center gap-1.5">
            {steps.map((s, i) => (
              <li key={s} className="flex items-center gap-1.5">
                <span className={`rounded-md border px-2 py-1 text-[12px] ${i === steps.length - 1 ? "border-dashed border-rule text-muted" : "border-rule bg-surface text-body"}`}>{s}</span>
                {i < steps.length - 1 && <ArrowRight size={12} className="text-muted" aria-hidden="true" />}
              </li>
            ))}
          </ol>
          <div className="text-[12.5px] leading-snug text-muted md:text-right">{cost}</div>
        </div>
      ))}
    </div>
  );
}
