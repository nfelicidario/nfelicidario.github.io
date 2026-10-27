import { KeyRound, Pencil, Plus, UserRoundPlus } from "lucide-react";

/* Slide 4: the accounts page, abstracted. Mock data. */

const rows = [
  { name: "Poblano's Mexican Grill", plan: "Self-serve", senders: 2, status: "Active" },
  { name: "Northwind Outfitters", plan: "Enterprise", senders: 5, status: "Active" },
  { name: "Harbor Dental Group", plan: "Self-serve", senders: 1, status: "Suspended" },
];

export function AccountManagement() {
  return (
    <div aria-hidden="true" className="bubble-sm overflow-hidden border border-rule bg-bg">
      <div className="flex items-center justify-between gap-3 border-b border-rule px-4 py-3">
        <span className="text-[13.5px] font-semibold text-ink">Accounts</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-bg">
          <Plus size={11} /> Create account
        </span>
      </div>
      <div className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_auto_auto_auto] items-center gap-x-3 px-4 py-2 text-[10.5px] font-semibold uppercase tracking-[0.06em] text-muted">
        <span>Account</span>
        <span>Plan</span>
        <span>Senders</span>
        <span>Status</span>
        <span />
      </div>
      {rows.map((r) => (
        <div key={r.name} className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_auto_auto_auto] items-center gap-x-3 border-t border-rule px-4 py-2.5 text-[12.5px]">
          <span className="truncate font-medium text-ink">{r.name}</span>
          <span className="text-body">{r.plan}</span>
          <span className="num text-body">{r.senders}</span>
          <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${r.status === "Active" ? "bg-ok-soft text-ok" : "bg-warn-soft text-warn"}`}>{r.status}</span>
          <span className="flex items-center gap-1 text-muted">
            <span className="grid h-6 w-6 place-items-center rounded-[6px] border border-rule bg-surface" title="Edit">
              <Pencil size={11} />
            </span>
            <span className="grid h-6 w-6 place-items-center rounded-[6px] border border-rule bg-surface" title="Add user">
              <UserRoundPlus size={11} />
            </span>
            <span className="grid h-6 w-6 place-items-center rounded-[6px] border border-rule bg-surface" title="Impersonate">
              <KeyRound size={11} />
            </span>
          </span>
        </div>
      ))}
      <div className="flex items-center gap-2 border-t border-dashed border-rule bg-surface px-4 py-2 text-[11.5px] text-muted">
        <KeyRound size={11} className="text-accent" />
        Impersonate: sign in as the account to add a user, until a real invite flow ships
      </div>
    </div>
  );
}
