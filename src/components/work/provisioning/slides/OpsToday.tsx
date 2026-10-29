import { AppWindow, Inbox, ListOrdered, Timer } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* Slide 1: what one RCS agent cost the operations team before Vibes Admin. Rounded, from internal notes. */

const facts: { Icon: LucideIcon; value: string; label: string }[] = [
  { Icon: AppWindow, value: "10", label: "interfaces per request, plus the email thread" },
  { Icon: Inbox, value: "6+", label: "emails back and forth per request" },
  { Icon: Timer, value: "~4 hrs", label: "of operations time per RCS agent" },
  { Icon: ListOrdered, value: "14", label: "steps, most of them never written down" },
];

export function OpsToday() {
  return (
    <div>
      <div className="label mb-3">The process, per RCS agent</div>
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {facts.map(({ Icon, value, label }) => (
          <li key={label} className="bubble-sm border border-rule bg-bg p-4">
            <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-full bg-accent-soft text-accent">
              <Icon size={15} />
            </span>
            <div className="num mt-3 font-display text-[24px] font-bold leading-none text-ink">{value}</div>
            <div className="mt-1.5 text-[12.5px] leading-snug text-body">{label}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
