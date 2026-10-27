import { ArrowDown, ArrowRight, Check, X } from "lucide-react";

/* Slide 4: the customer form before and after, in one row. */

const before = ["Bare form, no validation", "Instructions in a separate Word doc", "Corrections over email, until it was right"];
const after = ["Guided form, one step at a time", "Instructions and validation inside the form", "Submit once"];

function Column({ title, items, on }: { title: string; items: string[]; on: boolean }) {
  return (
    <div className={`bubble-sm flex flex-col gap-3 border p-4 ${on ? "border-accent bg-accent-soft/40" : "border-dashed border-rule bg-bg"}`}>
      <div className={`text-[17px] font-bold leading-tight ${on ? "text-accent" : "text-ink"}`}>{title}</div>
      <ul className="grid gap-2">
        {items.map((t) => (
          <li key={t} className="flex items-center gap-2.5 text-[13.5px] text-ink">
            <span
              aria-hidden="true"
              className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${on ? "bg-accent text-bg" : "border border-dashed border-rule text-muted"}`}
            >
              {on ? <Check size={11} /> : <X size={11} />}
            </span>
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AuditToForm() {
  return (
    <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-stretch">
      <Column title="Before" items={before} on={false} />
      <div aria-hidden="true" className="flex items-center justify-center text-muted">
        <ArrowRight size={18} className="hidden md:block" />
        <ArrowDown size={18} className="md:hidden" />
      </div>
      <Column title="After" items={after} on />
    </div>
  );
}
