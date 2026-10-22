import Link from "next/link";
import { ArrowDown, ArrowRight, Check, FileText, Mail, Users, X } from "lucide-react";

/* Slide 4: what the audit found (a bare form propped up by documents and email) and what replaced it. */

function Chip({ children, ok }: { children: string; ok?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11.5px] font-medium ${
        ok ? "border-accent bg-accent-soft text-accent" : "border-rule bg-surface text-muted"
      }`}
    >
      {ok ? <Check size={11} aria-hidden="true" /> : <X size={11} aria-hidden="true" />}
      {children}
    </span>
  );
}

function BareForm() {
  return (
    <div aria-hidden="true" className="rounded-[10px] border border-rule bg-surface p-3">
      <div className="grid gap-2.5">
        {["Question 1", "Question 2", "Question 3"].map((q) => (
          <div key={q}>
            <div className="mb-1 text-[11px] text-muted">{q}</div>
            <div className="h-7 rounded-[6px] border border-rule bg-bg" />
          </div>
        ))}
      </div>
      <div className="mt-3 h-6 w-16 rounded-[6px] bg-raised" />
    </div>
  );
}

function GuidedForm() {
  return (
    <div aria-hidden="true" className="rounded-[10px] border border-rule bg-surface p-3">
      <div className="mb-2 flex items-center gap-1.5">
        <span className="h-1 flex-1 rounded-full bg-accent" />
        <span className="h-1 flex-1 rounded-full bg-rule" />
        <span className="h-1 flex-1 rounded-full bg-rule" />
      </div>
      <div className="grid gap-2">
        <div>
          <div className="mb-1 text-[11px] font-medium text-ink">Brand name</div>
          <div className="h-7 rounded-[6px] border border-rule bg-bg" />
          <div className="mt-1 text-[10.5px] text-muted">The legal name on the registration, not a product name.</div>
        </div>
        <div>
          <div className="mb-1 text-[11px] font-medium text-ink">Website</div>
          <div className="h-7 rounded-[6px] border border-accent bg-bg" />
          <div className="mt-1 flex items-center gap-1 text-[10.5px] text-accent">
            <Check size={10} />
            Reachable, and it matches the brand
          </div>
        </div>
      </div>
      <div className="mt-3 h-6 w-20 rounded-full bg-accent" />
    </div>
  );
}

export function AuditToForm() {
  return (
    <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-stretch">
      <div className="bubble-sm flex flex-col gap-3 border border-dashed border-rule bg-bg p-4">
        <div>
          <div className="label">What the audit found</div>
          <div className="mt-0.5 text-[16px] font-semibold text-ink">A bare form, propped up from outside</div>
        </div>
        <BareForm />
        <div className="grid gap-1.5">
          <div className="flex items-center gap-2 text-[12.5px] text-muted">
            <FileText size={13} aria-hidden="true" />
            Instructions lived in supporting Word documents
          </div>
          <div className="flex items-center gap-2 text-[12.5px] text-muted">
            <Mail size={13} aria-hidden="true" />
            Corrections happened over email threads
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Chip>No validation</Chip>
          <Chip>No guidance</Chip>
        </div>
      </div>

      <div aria-hidden="true" className="flex items-center justify-center text-muted">
        <ArrowRight size={18} className="hidden md:block" />
        <ArrowDown size={18} className="md:hidden" />
      </div>

      <div className="bubble-sm flex flex-col gap-3 border border-accent bg-accent-soft/40 p-4">
        <div>
          <div className="label text-accent">What replaced it</div>
          <div className="mt-0.5 text-[16px] font-semibold text-ink">A guided form, one step at a time</div>
        </div>
        <GuidedForm />
        <div className="flex flex-wrap gap-1.5">
          <Chip ok>Step-by-step instructions</Chip>
          <Chip ok>Validation guardrails</Chip>
        </div>
        <Link
          href="/work/provisioning/"
          className="inline-flex items-center gap-1.5 self-start rounded-full border border-rule bg-surface px-2.5 py-1 text-[11.5px] font-medium text-body transition-colors hover:border-accent hover:text-accent"
        >
          <Users size={11} aria-hidden="true" />
          For the operations team: a read layer over submissions, in the next case study
          <ArrowRight size={11} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
