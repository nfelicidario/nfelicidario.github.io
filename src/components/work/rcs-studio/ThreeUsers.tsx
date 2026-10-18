import Link from "next/link";
import { ArrowRight, CodeXml, Megaphone, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Customer = { name: string; line: string; Icon: LucideIcon; built: boolean };

const customers: Customer[] = [
  {
    name: "Marketing operations",
    line: "Needs an agent for a campaign. Has never written code.",
    Icon: Megaphone,
    built: false,
  },
  {
    name: "Technical builders",
    line: "Wants the flow builder once an agent exists.",
    Icon: CodeXml,
    built: true,
  },
];

const pill = "rounded-full px-2.5 py-0.5 text-[11.5px] font-medium";
const on = "bg-accent text-bg";
const off = "border border-rule bg-surface text-muted";

export function ThreeUsers() {
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        {customers.map(({ name, line, Icon, built }) => (
          <div key={name}>
            <div className="bubble-sm border border-accent bg-accent-soft/40 p-4">
              <span aria-hidden="true" className="grid h-9 w-9 place-items-center rounded-full bg-accent text-bg">
                <Icon size={16} aria-hidden="true" />
              </span>
              <div className="label mt-3">Customer</div>
              <div className="mt-0.5 text-[14.5px] font-semibold text-ink">{name}</div>
              <p className="mt-1 text-[13px] leading-snug text-body">{line}</p>
              <div className="mt-3 flex items-center gap-1.5">
                <span className={`${pill} ${on}`}>1 Provision</span>
                <span aria-hidden="true" className="h-px w-3 bg-rule" />
                <span className={`${pill} ${built ? on : off}`}>2 Build</span>
              </div>
            </div>
            <span aria-hidden="true" className="mx-auto block h-5 w-px border-l border-dashed border-rule" />
          </div>
        ))}
      </div>

      <div className="bubble-sm flex flex-wrap items-center gap-3 border border-rule bg-bg p-4">
        <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-raised text-ink">
          <Users size={16} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="label">Behind both · internal</div>
          <div className="text-[14.5px] font-semibold text-ink">Our operations team</div>
          <p className="text-[13px] text-body">Did the provisioning work by hand, over weeks of email.</p>
        </div>
        <Link
          href="/work/provisioning/"
          className="ml-auto inline-flex items-center gap-1 rounded-full border border-rule px-3 py-1 text-[12.5px] text-body transition-colors hover:border-accent hover:text-accent"
        >
          Next case study
          <ArrowRight size={12} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
