import type { ReactNode } from "react";
import { ArrowDown, ArrowRight, Check, PenTool, Users } from "lucide-react";

function Header({ n, title }: { n: number; title: string }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="num grid h-5 w-5 place-items-center rounded-full bg-accent-soft text-[11px] text-accent">{n}</span>
      <span className="label text-ink">{title}</span>
    </div>
  );
}

function Prototype() {
  return (
    <>
      <div className="rounded-[10px] border border-rule bg-surface p-3" aria-hidden="true">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2, 3].map((d) => (
            <span key={d} className="contents">
              {d > 0 && <span className="h-px flex-1 bg-rule" />}
              <span className={`h-2 w-2 shrink-0 rounded-full ${d === 0 ? "bg-accent" : "bg-raised"}`} />
            </span>
          ))}
        </div>
        <div className="mt-3 grid gap-1.5">
          <div className="h-6 rounded-[6px] border border-rule bg-bg" />
          <div className="h-6 rounded-[6px] border border-rule bg-bg" />
        </div>
        <div className="mt-3 h-6 w-20 rounded-full bg-accent" />
      </div>
      <p className="mt-2.5 flex items-start gap-1.5 text-[12.5px] text-muted">
        <PenTool size={13} className="mt-[2px] shrink-0" aria-hidden="true" />
        The provisioning flow, as a clickable prototype
      </p>
    </>
  );
}

function Operations() {
  return (
    <div className="grid gap-3">
      <span className="grid h-9 w-9 place-items-center rounded-full bg-accent-soft text-accent">
        <Users size={16} aria-hidden="true" />
      </span>
      <p className="text-[13px] text-body">In front of the operations team, the people provisioning by hand.</p>
      <span className="inline-flex items-center gap-1 justify-self-start rounded-full bg-accent-soft px-2.5 py-0.5 text-[12px] font-semibold text-accent">
        <Check size={12} aria-hidden="true" />
        Won over the skeptics
      </span>
    </div>
  );
}

function Reframe() {
  return (
    <div className="grid gap-2">
      <div className="bubble-sm border border-dashed border-rule bg-surface p-3">
        <div className="label">A flow builder</div>
        <p className="mt-1 text-[13px] text-muted">Competes with one feature of the incumbents.</p>
        <div className="mt-2 h-2 w-1/5 rounded-full bg-raised" aria-hidden="true" />
      </div>
      <div className="bubble-sm border border-accent bg-accent-soft/40 p-3">
        <div className="label text-accent">A provisioning platform</div>
        <p className="mt-1 text-[13px] text-ink">Competes with the incumbents.</p>
        <div className="mt-2 h-2 w-full rounded-full bg-accent" aria-hidden="true" />
      </div>
    </div>
  );
}

const steps: { title: string; body: ReactNode }[] = [
  { title: "I built a prototype", body: <Prototype /> },
  { title: "Operations saw it", body: <Operations /> },
  { title: "The reframe", body: <Reframe /> },
];

export function PrototypeToReframe() {
  return (
    <ol className="grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1.2fr] sm:items-stretch">
      {steps.map((s, i) => [
        <li key={s.title} className="bubble-sm border border-rule bg-bg p-4">
          <Header n={i + 1} title={s.title} />
          {s.body}
        </li>,
        i < steps.length - 1 && (
          <li key={`${s.title}-arrow`} aria-hidden="true" className="flex items-center justify-center">
            <ArrowRight size={16} className="hidden text-muted sm:block" />
            <ArrowDown size={16} className="text-muted sm:hidden" />
          </li>
        ),
      ])}
    </ol>
  );
}
