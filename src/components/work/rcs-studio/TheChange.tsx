import Link from "next/link";
import { ArrowDown, ArrowRight, Check, ClipboardList, Send, UserRound, Users } from "lucide-react";

/* Slide 4: a guided submission form for customers, and a read layer over those submissions for operations. */

function Chip({ children, ok }: { children: string; ok?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11.5px] font-medium ${
        ok ? "border-accent bg-accent-soft text-accent" : "border-rule bg-surface text-body"
      }`}
    >
      {ok && <Check size={11} aria-hidden="true" />}
      {children}
    </span>
  );
}

function FormMock() {
  return (
    <div aria-hidden="true" className="rounded-[10px] border border-rule bg-surface p-3">
      <div className="grid gap-2">
        <div>
          <div className="mb-1 h-2 w-16 rounded-full bg-muted/50" />
          <div className="h-7 rounded-[6px] border border-rule bg-bg" />
          <div className="mt-1 h-1.5 w-32 rounded-full bg-raised" />
        </div>
        <div>
          <div className="mb-1 h-2 w-20 rounded-full bg-muted/50" />
          <div className="h-7 rounded-[6px] border border-accent bg-bg" />
          <div className="mt-1 flex items-center gap-1 text-[10.5px] text-accent">
            <Check size={10} />
            <span className="h-1.5 w-24 rounded-full bg-accent/40" />
          </div>
        </div>
      </div>
      <div className="mt-3 h-6 w-20 rounded-full bg-accent" />
    </div>
  );
}

function RecordMock() {
  return (
    <div aria-hidden="true" className="rounded-[10px] border border-rule bg-surface p-3">
      <div className="grid gap-1.5">
        {[0, 1, 2].map((r) => (
          <div key={r} className="flex items-center gap-2">
            <span className="h-2 w-14 shrink-0 rounded-full bg-muted/50" />
            <span className="h-2 flex-1 rounded-full bg-raised" />
          </div>
        ))}
      </div>
      <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-rule bg-bg px-2.5 py-1 text-[11px] font-medium text-ink">
        <Send size={11} className="text-accent" />
        Send to the relevant parties
      </div>
    </div>
  );
}

export function TheChange() {
  return (
    <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-stretch">
      <div className="bubble-sm flex flex-col gap-3 border border-accent bg-accent-soft/40 p-4">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-full bg-accent text-bg">
            <UserRound size={15} />
          </span>
          <div>
            <div className="label text-accent">Customer</div>
            <div className="text-[14.5px] font-semibold text-ink">A guided submission form</div>
          </div>
        </div>
        <FormMock />
        <div className="flex flex-wrap gap-1.5">
          <Chip ok>Step-by-step instructions</Chip>
          <Chip ok>Validation guardrails</Chip>
        </div>
      </div>

      <div aria-hidden="true" className="flex flex-col items-center justify-center gap-1 text-muted">
        <ArrowRight size={18} className="hidden md:block" />
        <ArrowDown size={18} className="md:hidden" />
        <span className="label">submits</span>
      </div>

      <div className="bubble-sm flex flex-col gap-3 border border-rule bg-bg p-4">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-full bg-raised text-ink">
            <Users size={15} />
          </span>
          <div>
            <div className="label">Operations team</div>
            <div className="text-[14.5px] font-semibold text-ink">A read layer over submissions</div>
          </div>
        </div>
        <RecordMock />
        <div className="flex flex-wrap items-center gap-1.5">
          <Chip>Manual for now</Chip>
          <Link
            href="/work/provisioning/"
            className="inline-flex items-center gap-1 rounded-full border border-rule px-2 py-0.5 text-[11.5px] font-medium text-body transition-colors hover:border-accent hover:text-accent"
          >
            <ClipboardList size={11} aria-hidden="true" />
            Automated in the next case study
            <ArrowRight size={11} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
