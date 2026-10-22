import { ArrowDown, ArrowRight, BarChart3, Handshake, MessagesSquare, PhoneCall, Presentation, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* Slide 2: where the provisioning question kept coming from, converging on the one question. */

const sources: { label: string; Icon: LucideIcon }[] = [
  { label: "Sales calls", Icon: PhoneCall },
  { label: "Prospect demos", Icon: Presentation },
  { label: "Onboarding conversations", Icon: Handshake },
  { label: "Customer interviews", Icon: MessagesSquare },
  { label: "Usage data", Icon: BarChart3 },
  { label: "Competitive analysis", Icon: Search },
];

export function SignalSources() {
  return (
    <div>
      <div className="label mb-3">Where we kept hearing it</div>
      <div className="grid gap-3 md:grid-cols-[minmax(0,3fr)_auto_minmax(0,2fr)] md:items-center">
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {sources.map(({ label, Icon }) => (
            <li key={label} className="bubble-sm flex items-center gap-2.5 border border-rule bg-bg px-3 py-2.5">
              <span aria-hidden="true" className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                <Icon size={14} />
              </span>
              <span className="text-[13px] font-medium leading-tight text-ink">{label}</span>
            </li>
          ))}
        </ul>
        <div aria-hidden="true" className="flex items-center justify-center text-muted">
          <ArrowRight size={18} className="hidden md:block" />
          <ArrowDown size={18} className="md:hidden" />
        </div>
        <figure className="bubble-sm border border-accent bg-accent-soft/40 p-4">
          <blockquote className="font-display text-[17px] font-semibold leading-snug text-ink">
            &ldquo;Cool demo, now how do I send to customers?&rdquo;
          </blockquote>
          <figcaption className="label mt-2 text-accent">The same question, every time</figcaption>
        </figure>
      </div>
    </div>
  );
}
