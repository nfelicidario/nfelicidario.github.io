import { Check, FileText, Mail, MailX, Repeat, Send, ShieldCheck, SquarePen, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* Slide 4: what the audit found, drawn as the path a customer actually walked, next to the path that replaced it. */

type Step = { Icon: LucideIcon; label: string };

const before: Step[] = [
  { Icon: FileText, label: "Read the Word doc" },
  { Icon: SquarePen, label: "Fill a bare form" },
  { Icon: Mail, label: "Email it in" },
  { Icon: MailX, label: "Ops finds gaps" },
  { Icon: Repeat, label: "Corrections, by email" },
];

const after: Step[] = [
  { Icon: SquarePen, label: "Guided form, one step at a time" },
  { Icon: ShieldCheck, label: "Problems caught inline" },
  { Icon: Send, label: "Submit once" },
];

function Path({ steps, tone }: { steps: Step[]; tone: "before" | "after" }) {
  const on = tone === "after";
  return (
    <ol className="flex flex-wrap items-center gap-2">
      {steps.map(({ Icon, label }, i) => (
        <li key={label} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden="true" className={`h-px w-3 ${on ? "bg-accent" : "bg-rule"}`} />}
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12.5px] font-medium ${
              on ? "border-accent bg-surface text-ink" : "border-dashed border-rule bg-surface text-body"
            }`}
          >
            <Icon size={13} className={on ? "text-accent" : "text-muted"} aria-hidden="true" />
            {label}
          </span>
        </li>
      ))}
    </ol>
  );
}

export function AuditToForm() {
  return (
    <div className="grid gap-3">
      <div className="bubble-sm grid gap-3 border border-dashed border-rule bg-bg p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <div className="label">What the audit found</div>
            <div className="mt-0.5 text-[16px] font-semibold text-ink">Five steps, and a loop that ran until the submission was right</div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-rule bg-surface px-2 py-0.5 text-[11.5px] text-muted">
            <X size={11} aria-hidden="true" />
            No validation, no guidance
          </span>
        </div>
        <Path steps={before} tone="before" />
      </div>

      <div className="bubble-sm grid gap-3 border border-accent bg-accent-soft/40 p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <div className="label text-accent">What replaced it</div>
            <div className="mt-0.5 text-[16px] font-semibold text-ink">Three steps, no loop</div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-accent bg-accent-soft px-2 py-0.5 text-[11.5px] text-accent">
            <Check size={11} aria-hidden="true" />
            Instructions and validation inside the form
          </span>
        </div>
        <Path steps={after} tone="after" />
      </div>
    </div>
  );
}
