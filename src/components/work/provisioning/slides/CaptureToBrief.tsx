import { ArrowDown, ArrowRight, Check, CodeXml, FileText, ListTodo, PencilLine } from "lucide-react";

/* Slide 5: one record from capture, through edits, to the PDF brief. Mock data. */

function Card({ title, icon, children, on }: { title: string; icon: React.ReactNode; children: React.ReactNode; on?: boolean }) {
  return (
    <div className={`bubble-sm flex min-w-0 flex-col gap-2.5 border p-4 ${on ? "border-accent bg-accent-soft/40" : "border-rule bg-bg"}`}>
      <div className="flex items-center gap-2 text-[13.5px] font-semibold text-ink">
        <span aria-hidden="true" className="grid h-7 w-7 place-items-center rounded-full bg-accent-soft text-accent">{icon}</span>
        {title}
      </div>
      {children}
    </div>
  );
}

const fields = [
  { k: "Brand", v: "Poblano's Mexican Grill" },
  { k: "Website", v: "poblanos.example" },
  { k: "Use case", v: "Order-ready alerts" },
  { k: "Sample message", v: "Your order's up, Sam…" },
];

export function CaptureToBrief() {
  return (
    <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] md:items-stretch">
      <Card title="Capture" icon={<ListTodo size={13} />}>
        <div className="flex gap-1.5 text-[10.5px] font-semibold">
          <span className="inline-flex items-center gap-1 rounded-full bg-raised px-2 py-0.5 text-muted"><ListTodo size={10} /> Guided form</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-raised px-2 py-0.5 text-muted"><CodeXml size={10} /> API</span>
        </div>
        <ul aria-hidden="true" className="grid gap-1">
          {fields.map((f) => (
            <li key={f.k} className="flex items-center justify-between gap-2 rounded-[6px] border border-rule bg-surface px-2 py-1 text-[11.5px]">
              <span className="text-muted">{f.k}</span>
              <span className="truncate text-ink">{f.v}</span>
            </li>
          ))}
        </ul>
      </Card>
      <Arrow />
      <Card title="Edit" icon={<PencilLine size={13} />}>
        <ul aria-hidden="true" className="grid gap-1">
          {fields.map((f, i) => (
            <li
              key={f.k}
              className={`flex items-center justify-between gap-2 rounded-[6px] border px-2 py-1 text-[11.5px] ${i === 2 ? "border-accent bg-accent-soft/60" : "border-rule bg-surface"}`}
            >
              <span className="text-muted">{f.k}</span>
              <span className="truncate text-ink">{i === 2 ? "Order-ready alerts and weekly specials" : f.v}</span>
            </li>
          ))}
        </ul>
        <div className="text-[11px] text-muted">A correction is a field change, not another email thread</div>
      </Card>
      <Arrow />
      <Card title="Brief" icon={<FileText size={13} />} on>
        <div aria-hidden="true" className="rounded-[8px] border border-rule bg-surface p-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-ink">Provisioning brief.pdf</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-ok-soft px-1.5 py-0.5 text-[10px] font-semibold text-ok"><Check size={9} /> Ready</span>
          </div>
          <div className="mt-2 grid gap-1">
            <span className="h-1.5 w-full rounded bg-raised" />
            <span className="h-1.5 w-4/5 rounded bg-raised" />
            <span className="h-1.5 w-3/5 rounded bg-raised" />
            <span className="mt-1 h-1.5 w-full rounded bg-raised" />
            <span className="h-1.5 w-2/3 rounded bg-raised" />
          </div>
        </div>
        <div className="text-[11px] text-muted">The document compliance review and the partners actually need</div>
      </Card>
    </div>
  );
}

function Arrow() {
  return (
    <div aria-hidden="true" className="flex items-center justify-center text-muted">
      <ArrowRight size={18} className="hidden md:block" />
      <ArrowDown size={18} className="md:hidden" />
    </div>
  );
}
