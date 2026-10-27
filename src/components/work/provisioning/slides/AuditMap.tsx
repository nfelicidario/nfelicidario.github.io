import { Eye, FlaskConical, MessagesSquare, PencilRuler } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* Slide 3: how the process was learned, and the condensed map that came out of it. */

const methods: { Icon: LucideIcon; label: string }[] = [
  { Icon: Eye, label: "Shadowed requests end to end" },
  { Icon: MessagesSquare, label: "Interviewed the operations team" },
  { Icon: FlaskConical, label: "Ran the flow with mock data" },
  { Icon: PencilRuler, label: "Drew the map from memory" },
];

const steps: { step: string; written: boolean }[] = [
  { step: "Customer emails a request to the shared inbox", written: true },
  { step: "Register the brand and agent in the registry console", written: true },
  { step: "Resize the logo and banner to each console's limits", written: false },
  { step: "Email details to the verification vendor, then wait about a week", written: true },
  { step: "Email campaign details to each carrier, one template each", written: false },
  { step: "Chase the customer for every missing field", written: false },
  { step: "Track every request by hand in a spreadsheet", written: false },
  { step: "Build the weekly status report for the customer", written: false },
];

export function AuditMap() {
  return (
    <div className="grid gap-3 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <div className="bubble-sm border border-rule bg-bg p-4">
        <div className="label mb-3">How I learned it</div>
        <ul className="grid gap-2">
          {methods.map(({ Icon, label }) => (
            <li key={label} className="flex items-center gap-2.5 text-[13.5px] text-ink">
              <span aria-hidden="true" className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                <Icon size={14} />
              </span>
              {label}
            </li>
          ))}
        </ul>
      </div>
      <div className="bubble-sm border border-rule bg-bg p-4">
        <div className="label mb-3">The map, condensed</div>
        <ol className="grid gap-1.5">
          {steps.map((s, i) => (
            <li key={s.step} className="grid grid-cols-[22px_1fr_auto] items-center gap-2 text-[13px]">
              <span className="num text-muted">{i + 1}.</span>
              <span className="text-body">{s.step}</span>
              <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${s.written ? "bg-raised text-muted" : "bg-warn-soft text-warn"}`}>
                {s.written ? "documented" : "unwritten"}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
