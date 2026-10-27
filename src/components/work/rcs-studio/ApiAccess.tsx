import { Copy, KeyRound, Send, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* Slide 6: the two APIs, each with its own self-serve keys. Mock values only. */

type Api = { Icon: LucideIcon; title: string; text: string; keys: { name: string; env: "Live" | "Test"; value: string }[] };

const apis: Api[] = [
  {
    Icon: ShieldCheck,
    title: "Provisioning API",
    text: "Register a brand, an agent, and a campaign, and track their review",
    keys: [
      { name: "Production", env: "Live", value: "prov_live_••••••••4f2a" },
      { name: "Staging", env: "Test", value: "prov_test_••••••••91c0" },
    ],
  },
  {
    Icon: Send,
    title: "Messaging API",
    text: "Send test messages right away, and customer messages once the agent is live",
    keys: [
      { name: "Production", env: "Live", value: "msg_live_••••••••b7e3" },
      { name: "Staging", env: "Test", value: "msg_test_••••••••0d58" },
    ],
  },
];

export function ApiAccess() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {apis.map(({ Icon, title, text, keys }) => (
        <div key={title} className="bubble-sm flex flex-col gap-3 border border-rule bg-bg p-4">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
              <Icon size={16} />
            </span>
            <div className="min-w-0">
              <div className="text-[14.5px] font-semibold text-ink">{title}</div>
              <div className="text-[12.5px] leading-snug text-muted">{text}</div>
            </div>
          </div>
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
                  <span className="num ml-auto truncate font-mono text-[10.5px] text-muted">{k.value}</span>
                  <Copy size={11} className="shrink-0 text-muted" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
