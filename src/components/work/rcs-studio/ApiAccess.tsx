import { ArrowDown, ArrowRight, Copy, KeyRound, Lock, LockOpen, Send, ShieldCheck } from "lucide-react";

/* Slide 6: self-serve credentials, and the two APIs they unlock. Mock values only. */

function Credentials() {
  return (
    <div aria-hidden="true" className="rounded-[10px] border border-rule bg-surface p-3">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-semibold text-ink">API keys</span>
        <span className="rounded-full bg-accent px-2 py-0.5 text-[10.5px] font-semibold text-bg">Create key</span>
      </div>
      <div className="mt-2.5 grid gap-1.5">
        {[
          { name: "Production", env: "Live", key: "vb_live_••••••••••••4f2a" },
          { name: "Staging", env: "Test", key: "vb_test_••••••••••••91c0" },
        ].map((k) => (
          <div key={k.name} className="flex items-center gap-2 rounded-[6px] border border-rule bg-bg px-2.5 py-1.5">
            <KeyRound size={12} className="shrink-0 text-muted" />
            <span className="text-[11.5px] font-medium text-ink">{k.name}</span>
            <span className={`rounded-full px-1.5 text-[10px] font-semibold ${k.env === "Live" ? "bg-accent-soft text-accent" : "bg-raised text-muted"}`}>
              {k.env}
            </span>
            <span className="num ml-auto truncate text-[10.5px] text-muted">{k.key}</span>
            <Copy size={11} className="shrink-0 text-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ApiAccess() {
  return (
    <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1.2fr)] md:items-stretch">
      <div className="bubble-sm flex flex-col gap-3 border border-accent bg-accent-soft/40 p-4">
        <div>
          <div className="label text-accent">Self-serve credentials</div>
          <div className="mt-0.5 text-[16px] font-semibold text-ink">Keys without a ticket</div>
        </div>
        <Credentials />
        <p className="text-[12.5px] text-muted">Create, label, and rotate keys for Test or Live. No one to email.</p>
      </div>

      <div aria-hidden="true" className="flex items-center justify-center text-muted">
        <ArrowRight size={18} className="hidden md:block" />
        <ArrowDown size={18} className="md:hidden" />
      </div>

      <div className="grid gap-3">
        <div className="bubble-sm flex gap-3 border border-rule bg-bg p-4">
          <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-bg">
            <ShieldCheck size={16} />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[14.5px] font-semibold text-ink">Provisioning API</span>
              <span className="inline-flex items-center gap-1 rounded-full border border-rule bg-surface px-2 py-0.5 text-[11px] font-medium text-muted">
                <LockOpen size={10} aria-hidden="true" />
                Available from day one
              </span>
            </div>
            <p className="mt-1 text-[13px] leading-snug text-body">Register a brand, agent, and campaign from code, and read their statuses.</p>
          </div>
        </div>
        <div className="bubble-sm flex gap-3 border border-rule bg-bg p-4">
          <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-raised text-ink">
            <Send size={16} />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[14.5px] font-semibold text-ink">Messaging API</span>
              <span className="inline-flex items-center gap-1 rounded-full border border-accent bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent">
                <Lock size={10} aria-hidden="true" />
                Unlocks when the agent is live
              </span>
            </div>
            <p className="mt-1 text-[13px] leading-snug text-body">Send rich messages from the live agent, from code or from the flow builder.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
