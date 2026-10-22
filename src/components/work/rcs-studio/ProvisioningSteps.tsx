import { BadgeCheck, Bot, ClipboardCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* Slide 2: what "getting started" actually means, as the three provisioning steps. */

const steps: { label: string; Icon: LucideIcon }[] = [
  { label: "Brand verification", Icon: BadgeCheck },
  { label: "Agent verification", Icon: Bot },
  { label: "Campaign review", Icon: ClipboardCheck },
];

export function ProvisioningSteps() {
  return (
    <div>
      <div className="label mb-3">Provisioning</div>
      <ol className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center">
        {steps.map(({ label, Icon }, i) => [
          <li key={label} className="bubble-sm flex items-center gap-3 border border-rule bg-bg p-4">
            <span className="num grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent-soft text-[12px] font-semibold text-accent">
              {i + 1}
            </span>
            <span className="text-[15px] font-semibold text-ink">{label}</span>
            <Icon size={16} className="ml-auto shrink-0 text-muted" aria-hidden="true" />
          </li>,
          i < steps.length - 1 && (
            <li key={`${label}-line`} aria-hidden="true" className="hidden h-px w-6 bg-rule md:block" />
          ),
        ])}
      </ol>
    </div>
  );
}
