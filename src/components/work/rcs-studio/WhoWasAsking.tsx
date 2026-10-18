import type { ReactNode } from "react";
import { Briefcase, CodeXml } from "lucide-react";

const questions = ["What is RCS?", "Why is it better than SMS?", "How do we get started?"];

const steps = ["Register brand and agent", "Approval by third-party partners", "Then build the flow"];

function StepRow({ n, children, accent }: { n: number; children: ReactNode; accent?: boolean }) {
  return (
    <div className="bubble-sm flex items-center gap-2.5 border border-rule bg-surface px-3 py-2 text-[13.5px] text-ink">
      <span
        className={`num grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] font-semibold ${
          accent ? "bg-accent text-bg" : "bg-raised text-muted"
        }`}
      >
        {n}
      </span>
      {children}
    </div>
  );
}

export function WhoWasAsking() {
  return (
    <div className="grid gap-4 sm:grid-cols-[2fr_3fr]">
      <div className="bubble-sm border border-dashed border-rule bg-bg p-4">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-raised text-ink">
            <CodeXml size={14} aria-hidden="true" />
          </span>
          <div>
            <div className="label">Builders</div>
            <div className="text-[12px] text-muted">a few</div>
          </div>
          <span className="label ml-auto shrink-0 self-start whitespace-nowrap rounded-full border border-rule px-2 py-0.5 text-[10.5px] text-muted">
            Assumption 3
          </span>
        </div>
        <div className="mt-3 grid">
          <p className="bubble-sm justify-self-start bg-raised px-3 py-2 text-[13.5px] text-body">Can I build a flow?</p>
        </div>
        <div className="label mt-4 mb-2">What we built for them</div>
        <StepRow n={1}>Build a flow</StepRow>
        <p className="mt-3 text-[12.5px] text-muted">Real, but not the ones deciding.</p>
      </div>

      <div className="bubble-sm border border-accent bg-accent-soft/40 p-4">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
            <Briefcase size={14} aria-hidden="true" />
          </span>
          <div>
            <div className="label text-accent">Buyers</div>
            <div className="text-[12px] text-muted">the ones who sign off</div>
          </div>
        </div>
        <div className="mt-3 grid gap-2">
          {questions.map((q, i) => (
            <p
              key={q}
              className={`bubble-sm border bg-surface px-3 py-2 text-[13.5px] text-ink ${
                i % 2 === 0 ? "justify-self-start" : "justify-self-end"
              } ${i === questions.length - 1 ? "border-accent" : "border-rule"}`}
            >
              {q}
            </p>
          ))}
        </div>
        <span aria-hidden="true" className="mt-2 ml-3 block h-4 border-l border-dashed border-rule" />
        <div className="label mt-2 mb-2 text-accent">What getting started meant</div>
        <ol className="grid gap-1.5">
          {steps.map((s, i) => (
            <li key={s}>
              <StepRow n={i + 1} accent>
                {s}
                {i === steps.length - 1 && (
                  <span className="ml-auto shrink-0 rounded-full border border-rule px-2 text-[11px] text-muted">
                    where builders start
                  </span>
                )}
              </StepRow>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-[12.5px] text-muted">Weeks of email, handled by hand.</p>
      </div>
    </div>
  );
}
