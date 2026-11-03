import { ArrowRight, Check, X } from "lucide-react";

/* Slide 3: the handoff before and after. Figma file rebuilt by hand, versus a merge request built on. */

function Flow({ title, steps, tone }: { title: string; steps: { text: string; bad?: boolean; good?: boolean }[]; tone: "before" | "after" }) {
  return (
    <div className={`bubble-sm border p-4 ${tone === "after" ? "border-accent bg-surface" : "border-rule bg-surface"}`}>
      <div className={`label mb-3 ${tone === "after" ? "text-accent" : "text-muted"}`}>{title}</div>
      <ol className="flex flex-wrap items-center gap-1.5">
        {steps.map((s, i) => (
          <li key={s.text} className="flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[12px] ${
                s.bad ? "border-dashed border-rule text-muted line-through decoration-rule" : s.good ? "border-accent bg-accent-soft text-accent" : "border-rule bg-bg text-body"
              }`}
            >
              {s.bad && <X size={11} aria-hidden="true" />}
              {s.good && <Check size={11} aria-hidden="true" />}
              {s.text}
            </span>
            {i < steps.length - 1 && <ArrowRight size={12} className="text-muted" aria-hidden="true" />}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function Handoff() {
  return (
    <div className="grid gap-3">
      <Flow
        tone="before"
        title="Before: a picture of the thing"
        steps={[
          { text: "Design in Figma" },
          { text: "Annotate and hand off" },
          { text: "Engineering interprets" },
          { text: "Rebuilds it by hand", bad: true },
          { text: "“That's not what I meant” rounds", bad: true },
          { text: "Ships, roughly" },
        ]}
      />
      <Flow
        tone="after"
        title="After: the thing itself"
        steps={[
          { text: "Design in code, on a branch" },
          { text: "Open a merge request", good: true },
          { text: "Prototype deploys to its own URL", good: true },
          { text: "Engineering builds on the MR" },
          { text: "Ships, as designed" },
        ]}
      />
      <p className="text-[12.5px] leading-snug text-muted">The rebuild step is gone. Developers pick up the merge request and build on it, instead of recreating what they see in Figma.</p>
    </div>
  );
}
