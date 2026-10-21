import Link from "next/link";
import { ArrowDown, ArrowRight, CodeXml, Megaphone, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* Slide 3: the reframe (flow builder → provisioning platform) and who the product serves now. */

const pill = "rounded-full px-2.5 py-0.5 text-[11.5px] font-medium whitespace-nowrap";
const on = "bg-accent text-bg";
const off = "border border-rule bg-surface text-muted";
const missing = "border border-dashed border-rule bg-transparent text-muted";

type Customer = { name: string; line: string; Icon: LucideIcon; builds: boolean };

const customers: Customer[] = [
  { name: "Marketing operations", line: "Needs an agent for a campaign. Has never written code.", Icon: Megaphone, builds: false },
  { name: "Technical builders", line: "Wants the flow builder once an agent exists.", Icon: CodeXml, builds: true },
];

function Steps({ first, second }: { first: string; second: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`${pill} ${first}`}>1 Provision</span>
      <span aria-hidden="true" className="h-px w-3 bg-rule" />
      <span className={`${pill} ${second}`}>2 Build</span>
    </div>
  );
}

export function TheSolution() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-stretch">
        <div className="bubble-sm border border-dashed border-rule bg-bg p-4">
          <div className="label">Launched as</div>
          <div className="mt-1 text-[18px] font-bold leading-tight text-ink">A flow builder</div>
          <p className="mt-1 text-[13px] text-muted">Competes with one feature of the incumbents</p>
          <div className="mt-3">
            <Steps first={missing} second={on} />
          </div>
        </div>
        <div aria-hidden="true" className="flex items-center justify-center text-muted">
          <ArrowRight size={18} className="hidden sm:block" />
          <ArrowDown size={18} className="sm:hidden" />
        </div>
        <div className="bubble-sm border border-accent bg-accent-soft/40 p-4">
          <div className="label text-accent">Repositioned as</div>
          <div className="mt-1 text-[18px] font-bold leading-tight text-ink">A provisioning platform</div>
          <p className="mt-1 text-[13px] text-body">Competes with the incumbents, with the builder as step two</p>
          <div className="mt-3">
            <Steps first={on} second={on} />
          </div>
        </div>
      </div>

      <div className="label mt-2">Who it serves now</div>
      <div className="grid gap-3 sm:grid-cols-2">
        {customers.map(({ name, line, Icon, builds }) => (
          <div key={name} className="bubble-sm flex gap-3 border border-rule bg-bg p-4">
            <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-bg">
              <Icon size={16} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <div className="text-[14.5px] font-semibold text-ink">{name}</div>
              <p className="mt-0.5 text-[13px] leading-snug text-body">{line}</p>
              <div className="mt-2.5">
                <Steps first={on} second={builds ? on : off} />
              </div>
            </div>
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
