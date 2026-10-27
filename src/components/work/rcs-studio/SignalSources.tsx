import { BarChart3, Handshake, MessagesSquare, PhoneCall, Presentation, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* Slide 2: where the provisioning question kept coming from. The quote itself sits in the bullets. */

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
      <div className="label mb-3">Evidence</div>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {sources.map(({ label, Icon }) => (
          <li key={label} className="bubble-sm flex items-center gap-2.5 border border-rule bg-bg px-3 py-2.5">
            <span aria-hidden="true" className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
              <Icon size={14} />
            </span>
            <span className="text-[13px] font-medium leading-tight text-ink">{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
