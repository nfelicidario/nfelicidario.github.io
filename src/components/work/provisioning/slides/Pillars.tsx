import { FileOutput, LayoutTemplate, ShieldCheck, UserCog, Wand2, Workflow, ListChecks } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* Slide 2: the five moves that modernize the operational process, and the three feature sets that carry them. */

const pillars: { Icon: LucideIcon; title: string; text: string }[] = [
  { Icon: ShieldCheck, title: "Validate and sanitize customer input", text: "So a request arrives complete and clean" },
  { Icon: Wand2, title: "Automate what you can", text: "Prefill, checks, and transformations" },
  { Icon: LayoutTemplate, title: "Templatize submissions", text: "One request, each partner's form prefilled" },
  { Icon: Workflow, title: "Streamline the workflow", text: "One place to work instead of ten" },
  { Icon: UserCog, title: "Give the ops team tooling", text: "Accounts, records, and search of their own" },
];

export function Pillars() {
  return (
    <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {pillars.map(({ Icon, title, text }, i) => (
        <li key={title} className="bubble-sm border border-rule bg-bg p-4">
          <div className="flex items-center gap-2">
            <span className="num grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent-soft text-[11px] font-semibold text-accent">{i + 1}</span>
            <Icon size={16} className="text-accent" aria-hidden="true" />
          </div>
          <div className="mt-3 text-[14px] font-semibold leading-snug text-ink">{title}</div>
          <div className="mt-1 text-[12.5px] leading-snug text-muted">{text}</div>
        </li>
      ))}
    </ol>
  );
}

const sets: { Icon: LucideIcon; title: string; text: string }[] = [
  { Icon: UserCog, title: "Account management", text: "Accounts, users, and a way in" },
  { Icon: FileOutput, title: "Read, Edit, and Transform", text: "From captured input to a PDF brief" },
  { Icon: ListChecks, title: "Submissions", text: "One request, several submissions" },
];

export function ThreeFeatureSets() {
  return (
    <div>
      <div className="label mb-3">3 Features:</div>
      <ul className="grid gap-3 sm:grid-cols-3">
        {sets.map(({ Icon, title, text }) => (
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
