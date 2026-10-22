import { BadgeCheck, Bot, Check, ClipboardCheck, Clock } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* Slide 5: a launch timeline and three statuses, so a customer can see where their agent is. Mock states. */

const stages = ["Submitted", "Brand verified", "Agent verified", "Campaign approved", "Live"];
const CURRENT = 2; // the stage in progress

type Status = { label: string; Icon: LucideIcon; state: "done" | "active" | "todo"; value: string; next: string };

const statuses: Status[] = [
  { label: "Brand", Icon: BadgeCheck, state: "done", value: "Approved", next: "Nothing to do" },
  { label: "Agent", Icon: Bot, state: "active", value: "In review", next: "With third-party partners, 3 to 5 business days" },
  { label: "Campaign", Icon: ClipboardCheck, state: "todo", value: "Not started", next: "Opens once the agent is verified" },
];

const pill: Record<Status["state"], string> = {
  done: "bg-accent text-bg",
  active: "border border-accent bg-accent-soft text-accent",
  todo: "border border-rule bg-surface text-muted",
};

export function AgentTracking() {
  return (
    <div className="grid gap-5">
      <div>
        <div className="label mb-3">Launch progression</div>
        <ol className="grid gap-2 sm:grid-cols-5 sm:gap-0">
          {stages.map((s, i) => {
            const state = i < CURRENT ? "done" : i === CURRENT ? "active" : "todo";
            return (
              <li key={s} className="relative flex items-center gap-2.5 sm:flex-col sm:items-stretch sm:gap-2">
                <div className="flex items-center sm:w-full">
                  <span
                    aria-hidden="true"
                    className={`hidden h-[2px] flex-1 sm:block ${i === 0 ? "bg-transparent" : i <= CURRENT ? "bg-accent" : "bg-rule"}`}
                  />
                  <span
                    className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 ${
                      state === "done"
                        ? "border-accent bg-accent text-bg"
                        : state === "active"
                          ? "border-accent bg-bg text-accent"
                          : "border-rule bg-bg text-muted"
                    }`}
                  >
                    {state === "done" ? <Check size={12} aria-hidden="true" /> : state === "active" ? <Clock size={12} aria-hidden="true" /> : null}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`hidden h-[2px] flex-1 sm:block ${i === stages.length - 1 ? "bg-transparent" : i < CURRENT ? "bg-accent" : "bg-rule"}`}
                  />
                </div>
                <span className={`text-[12.5px] leading-tight sm:text-center ${state === "todo" ? "text-muted" : "font-medium text-ink"}`}>{s}</span>
              </li>
            );
          })}
        </ol>
      </div>

      <div>
        <div className="label mb-3">Statuses</div>
        <div className="grid gap-3 sm:grid-cols-3">
          {statuses.map(({ label, Icon, state, value, next }) => (
            <div key={label} className={`bubble-sm flex flex-col gap-2 border p-4 ${state === "active" ? "border-accent bg-accent-soft/40" : "border-rule bg-bg"}`}>
              <div className="flex items-center gap-2">
                <span aria-hidden="true" className="grid h-7 w-7 place-items-center rounded-full bg-raised text-ink">
                  <Icon size={14} />
                </span>
                <span className="text-[14px] font-semibold text-ink">{label}</span>
                <span className={`ml-auto rounded-full px-2 py-0.5 text-[11px] font-semibold ${pill[state]}`}>{value}</span>
              </div>
              <p className="text-[12.5px] leading-snug text-muted">
                <span className="font-medium text-body">Next: </span>
                {next}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
