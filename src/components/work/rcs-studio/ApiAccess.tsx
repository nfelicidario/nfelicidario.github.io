import { ArrowDown, ArrowRight, Copy, KeyRound, Lock, LockOpen, Send, ShieldCheck } from "lucide-react";

/* Slide 6: self-serve credentials, and the two APIs they unlock. Mock values only. */

const keys = [
  { name: "Production", env: "Live", key: "vb_live_••••••••4f2a" },
  { name: "Staging", env: "Test", key: "vb_test_••••••••91c0" },
];

export function ApiAccess() {
  return (
    <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-stretch">
      <div className="bubble-sm flex flex-col gap-3 border border-accent bg-accent-soft/40 p-4">
        <div className="label text-accent">Self-serve credentials</div>
        <div aria-hidden="true" className="rounded-[10px] border border-rule bg-surface p-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-ink">API keys</span>
            <span className="rounded-full bg-accent px-2 py-0.5 text-[10.5px] font-semibold text-bg">Create key</span>
          </div>
          <div className="mt-2.5 grid gap-1.5">
            {keys.map((k) => (
              <div key={k.name} className="flex items-center gap-2 rounded-[6px] border border-rule bg-bg px-2.5 py-1.5">
                <KeyRound size={12} className="shrink-0 text-muted" />
                <span className="text-[11.5px] font-medium text-ink">{k.name}</span>
                <span className={`rounded-full px-1.5 text-[10px] font-semibold ${k.env === "Live" ? "bg-accent-soft text-accent" : "bg-raised text-muted"}`}>
                  {k.env}
                </span>
                <span className="num ml-auto truncate font-mono text-[10.5px] text-muted">{k.key}</span>
                <Copy size={11} className="shrink-0 text-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="flex items-center justify-center text-muted">
        <ArrowRight size={18} className="hidden md:block" />
        <ArrowDown size={18} className="md:hidden" />
      </div>

      <div className="grid gap-3">
        <div className="bubble-sm flex items-center gap-3 border border-rule bg-bg p-4">
          <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-bg">
            <ShieldCheck size={16} />
          </span>
          <div className="min-w-0">
            <div className="text-[14.5px] font-semibold text-ink">Provisioning API</div>
            <span className="mt-1 inline-flex items-center gap-1 rounded-full border border-rule bg-surface px-2 py-0.5 text-[11px] font-medium text-muted">
              <LockOpen size={10} aria-hidden="true" />
              Available from day one
            </span>
          </div>
        </div>
        <div className="bubble-sm flex items-center gap-3 border border-rule bg-bg p-4">
          <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-raised text-ink">
            <Send size={16} />
          </span>
          <div className="min-w-0">
            <div className="text-[14.5px] font-semibold text-ink">Messaging API</div>
            <span className="mt-1 inline-flex items-center gap-1 rounded-full border border-accent bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent">
              <Lock size={10} aria-hidden="true" />
              Unlocks when the agent is live
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
