import { Funnel, Search } from "lucide-react";

/* Slide 6: the submissions list with advanced search. Mock data. */

const rows = [
  { customer: "Poblano's Mexican Grill", sender: "RCS", partner: "Verification vendor", status: "Approved" },
  { customer: "Poblano's Mexican Grill", sender: "RCS", partner: "Carrier A", status: "In review" },
  { customer: "Northwind Outfitters", sender: "Toll-free", partner: "Vendor portal", status: "Submitted" },
  { customer: "Harbor Dental Group", sender: "RCS", partner: "Carrier B", status: "Needs info" },
];

const tone: Record<string, string> = {
  Approved: "bg-ok-soft text-ok",
  "In review": "bg-accent-soft text-accent",
  Submitted: "bg-raised text-muted",
  "Needs info": "bg-warn-soft text-warn",
};

export function SubmissionsSearch() {
  return (
    <div aria-hidden="true" className="bubble-sm overflow-hidden border border-rule bg-bg">
      <div className="flex flex-wrap items-center gap-2 border-b border-rule px-4 py-3">
        <span className="text-[13.5px] font-semibold text-ink">Submissions</span>
        <span className="ml-auto inline-flex min-w-[180px] items-center gap-2 rounded-full border border-rule bg-surface px-3 py-1 text-[11.5px] text-muted">
          <Search size={12} /> poblano
        </span>
        {["Sender: RCS", "Partner: any", "Status: open"].map((f) => (
          <span key={f} className="inline-flex items-center gap-1 rounded-full border border-rule bg-surface px-2 py-1 text-[10.5px] font-medium text-body">
            <Funnel size={10} className="text-muted" /> {f}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-[minmax(0,1.5fr)_auto_minmax(0,1.2fr)_auto] items-center gap-x-3 px-4 py-2 text-[10.5px] font-semibold uppercase tracking-[0.06em] text-muted">
        <span>Customer</span>
        <span>Sender</span>
        <span>Partner</span>
        <span>Status</span>
      </div>
      {rows.map((r, i) => (
        <div key={i} className="grid grid-cols-[minmax(0,1.5fr)_auto_minmax(0,1.2fr)_auto] items-center gap-x-3 border-t border-rule px-4 py-2.5 text-[12.5px]">
          <span className="truncate font-medium text-ink">{r.customer}</span>
          <span className="rounded-full bg-raised px-2 py-0.5 text-[10.5px] font-semibold text-body">{r.sender}</span>
          <span className="truncate text-body">{r.partner}</span>
          <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${tone[r.status]}`}>{r.status}</span>
        </div>
      ))}
    </div>
  );
}
