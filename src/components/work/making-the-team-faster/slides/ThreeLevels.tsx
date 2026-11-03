import { Building2, Network, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* Slide 2: the same principle at three levels, each with what changed. */

const levels: { Icon: LucideIcon; level: string; who: string; from: string; to: string }[] = [
  {
    Icon: Users,
    level: "Level 1",
    who: "Design and development team",
    from: "Static Figma handoffs",
    to: "Working code and live prototypes, delivered as merge requests",
  },
  {
    Icon: Network,
    level: "Level 2",
    who: "Product and technology",
    from: "Work tracked differently from team to team",
    to: "One shared system that people and AI agents both use",
  },
  {
    Icon: Building2,
    level: "Level 3",
    who: "Company-wide",
    from: "Presentations formatted slide by slide",
    to: "A design system that lets anyone produce on-brand decks with AI",
  },
];

export function ThreeLevels() {
  return (
    <ol className="grid gap-3 lg:grid-cols-3">
      {levels.map(({ Icon, level, who, from, to }, i) => (
        <li key={who} className={`bubble-sm border bg-bg p-4 ${i === 0 ? "border-accent" : "border-rule"}`}>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-full bg-accent-soft text-accent">
                <Icon size={15} />
              </span>
              <span className="text-[14px] font-semibold text-ink">{who}</span>
            </span>
            <span className="label text-muted">{level}</span>
          </div>
          <dl className="mt-3 grid gap-2 text-[12.5px]">
            <div className="rounded-[8px] border border-dashed border-rule px-3 py-2">
              <dt className="label text-muted">From</dt>
              <dd className="mt-0.5 text-body">{from}</dd>
            </div>
            <div className="rounded-[8px] border border-accent bg-accent-soft/50 px-3 py-2">
              <dt className="label text-accent">To</dt>
              <dd className="mt-0.5 text-ink">{to}</dd>
            </div>
          </dl>
        </li>
      ))}
    </ol>
  );
}

const parts: { Icon: LucideIcon; title: string; text: string }[] = [
  { Icon: Users, title: "Modernize the design function", text: "MRs, prototype environments, the prototype as the reference" },
  { Icon: Network, title: "One tracker", text: "Product and technology plan, track, and report in one place" },
  { Icon: Building2, title: "Agentic slide decks", text: "On-brand by default, proved on the All Hands deck" },
];

export function ThreeParts() {
  return (
    <div>
      <div className="label mb-3">3 Changes:</div>
      <ul className="grid gap-3 sm:grid-cols-3">
        {parts.map(({ Icon, title, text }) => (
          <li key={title} className="bubble-sm flex items-center gap-3 border border-rule bg-bg p-4">
            <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
              <Icon size={17} />
            </span>
            <span>
              <span className="block text-[15px] font-semibold leading-tight text-ink">{title}</span>
              <span className="mt-0.5 block text-[13px] text-muted">{text}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
