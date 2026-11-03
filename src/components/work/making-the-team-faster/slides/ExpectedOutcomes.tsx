import { Building2, Network, Ruler, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* Slide 10: expected outcomes by level, and the measures that would show them. No numbers yet, on purpose. */

const groups: { Icon: LucideIcon; title: string; items: string[] }[] = [
  {
    Icon: Users,
    title: "Product design function",
    items: ["Faster design-to-ship: developers start from working code, not a blank file", "Less lost in translation: what ships matches what was designed", "Earlier, better feedback: stakeholders click a real prototype before development", "Designers stay closer to the product"],
  },
  {
    Icon: Network,
    title: "One tracker",
    items: ["One source of truth for planning, prioritizing, and reporting", "Less status chasing: roadmaps and progress come from the tracker", "AI-ready work: agents create, summarize, and connect it"],
  },
  {
    Icon: Building2,
    title: "Slide decks",
    items: ["On-brand by default, without a designer reviewing each deck", "Hours back: from hours of formatting to minutes of reviewing content", "Visible proof of AI's value that drives adoption elsewhere"],
  },
];

const measures = [
  "Time from design approval to a merge request in review",
  "Design-related revision rounds per feature",
  "Share of product and technology work in the tracker",
  "Time to build a deck, before and after",
  "Teams reusing the deck system or the prototype environments",
];

export function ExpectedOutcomes() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
      <div className="grid gap-3 md:grid-cols-3">
        {groups.map(({ Icon, title, items }) => (
          <div key={title} className="bubble-sm border border-rule bg-bg p-4">
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className="grid h-7 w-7 place-items-center rounded-full bg-accent-soft text-accent"><Icon size={13} /></span>
              <span className="text-[13.5px] font-semibold text-ink">{title}</span>
            </div>
            <ul className="mt-3 grid gap-1.5">
              {items.map((it) => (
                <li key={it} className="flex items-start gap-2 text-[12.5px] leading-snug text-body">
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="bubble-sm border border-dashed border-rule p-4">
        <div className="label mb-2 flex items-center gap-1.5"><Ruler size={12} aria-hidden="true" /> What would show it</div>
        <ul className="grid gap-1.5">
          {measures.map((m) => (
            <li key={m} className="flex items-start gap-2 text-[12.5px] leading-snug text-body">
              <span className="mt-[2px] h-3.5 w-3.5 shrink-0 rounded-[3px] border border-rule" aria-hidden="true" />
              {m}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[12px] leading-snug text-muted">Measured from here on. The before was not captured early enough, which is the first thing I would change.</p>
      </div>
    </div>
  );
}
