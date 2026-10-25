import type { LucideIcon } from "lucide-react";
import { FlaskConical, Route, ShieldCheck, Timer, UserPlus } from "lucide-react";

type Card = { icon: LucideIcon; claim: string; evidence: string; stat?: string };

const cards: Card[] = [
  {
    icon: UserPlus,
    claim: "Customers will start on their own",
    evidence:
      "Customers signed up and got an agent into Test Mode on their own, a first for a company that had only sold through a sales team.",
  },
  {
    icon: FlaskConical,
    claim: "Self-serve lets customers try first",
    evidence: "Test Mode put a working agent in a customer's hands, minutes after sign-up and before any conversation about launching.",
  },
  {
    icon: ShieldCheck,
    claim: "Testing builds confidence",
    evidence: "Self-serve and enterprise customers alike reach the aha moment sooner when they can test how the app fits into their workflow.",
  },
  {
    icon: Timer,
    claim: "Provisioning was the product",
    evidence: "Every RCS agent Vibes provisions now goes through RCS Studio, almost all of them without help from Vibes staff.",
  },
];

/* Timeline runs Aug 2025 to Jul 2026: 11 months. */
const ticks = [
  { label: "Aug 2025", pos: 0, align: "left" },
  { label: "Feb 2026 · Beta", pos: 6 / 11, align: "right", middle: true },
  { label: "Mar 2026", pos: 7 / 11, align: "left", middle: true },
  { label: "Jul 2026 · GA", pos: 1, align: "right" },
] as const;

export function Proof() {
  return (
    <div>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ icon: Icon, claim, evidence, stat }) => (
          <li
            key={claim}
            className={`bubble-sm border p-4 ${stat ? "border-accent bg-accent-soft/40" : "border-rule bg-bg"}`}
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-accent-soft text-accent">
              <Icon size={16} aria-hidden="true" />
            </span>
            {stat && <div className="num mt-3 font-display text-[22px] font-bold text-ink">{stat}</div>}
            <p className={`${stat ? "mt-1" : "mt-3"} text-[15px] font-semibold leading-snug text-ink`}>{claim}</p>
            <p className="mt-1 text-[13px] leading-snug text-body">{evidence}</p>
          </li>
        ))}
      </ul>

      <p className="bubble-sm mt-3 flex items-start gap-2 border border-dashed border-rule bg-bg px-4 py-2.5 text-[13px] text-body">
        <Route size={14} className="mt-[3px] shrink-0 text-muted" aria-hidden="true" />
        Where it leaked: some customers reached Test Mode and never booked the launch conversation.
      </p>

      <div className="mt-4 border-t border-rule pt-4">
        <div className="label">How my work changed shape</div>
        <div className="mt-2 flex h-2 gap-0.5" aria-hidden="true">
          <span className="flex-[7] rounded-l-full bg-raised" />
          <span className="flex-[4] rounded-r-full bg-accent" />
        </div>
        <div className="relative mt-1 h-9 sm:h-5">
          {ticks.map((t) => (
            <span
              key={t.label}
              className={`num absolute whitespace-nowrap text-[11.5px] text-muted ${
                "middle" in t && t.middle ? "top-4 sm:top-0" : "top-0"
              }`}
              style={
                t.align === "left"
                  ? { left: `${t.pos * 100}%` }
                  : { right: `${(1 - t.pos) * 100}%` }
              }
            >
              {t.label}
            </span>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-[7fr_4fr] gap-3 text-[12.5px] text-muted">
          <p>Figma design docs, epics, stories, and a roadmap</p>
          <p className="text-body">Production TypeScript: sign-up, sign-in, provisioning flows</p>
        </div>
      </div>
    </div>
  );
}
