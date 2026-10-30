import { ArrowDown, ArrowDownToDot, ArrowRight, CodeXml, ListTodo } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* Slide 3: the customer's path before and after, and where each step happened. */

type Where = "product" | "email" | "blocked";

const where: Record<Where, { chip: string; cls: string; row: string }> = {
  product: { chip: "In RCS Studio", cls: "bg-accent text-bg", row: "border-accent/40 bg-surface" },
  email: { chip: "Over email", cls: "border border-dashed border-rule bg-bg text-muted", row: "border-dashed border-rule bg-transparent" },
  blocked: { chip: "Weeks later", cls: "bg-warn-soft text-warn", row: "border-dashed border-rule bg-transparent" },
};

type PathStep = { label: string; at: Where };

const before: PathStep[] = [
  { label: "Build flows", at: "product" },
  { label: "Ask ops for an agent", at: "email" },
  { label: "Wait for the approvals", at: "email" },
  { label: "Send to customers", at: "blocked" },
];

const after: PathStep[] = [
  { label: "Get an agent live", at: "product" },
  { label: "Build flows", at: "product" },
  { label: "Send to customers", at: "product" },
];

function Path({ title, caption, steps, on }: { title: string; caption: string; steps: PathStep[]; on: boolean }) {
  return (
    <div className={`bubble-sm flex flex-col gap-3 border p-4 ${on ? "border-accent bg-accent-soft/40" : "border-dashed border-rule bg-bg"}`}>
      <div>
        <div className={`text-[17px] font-bold leading-tight ${on ? "text-accent" : "text-ink"}`}>{title}</div>
        <div className="mt-0.5 text-[12.5px] text-muted">{caption}</div>
      </div>
      <ol className="grid gap-1.5">
        {steps.map((st, i) => {
          const w = where[st.at];
          return (
            <li key={st.label} className={`flex items-center gap-2.5 rounded-[10px] border px-3 py-2 ${w.row}`}>
              <span className={`num grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10.5px] font-semibold ${st.at === "product" ? "bg-accent-soft text-accent" : "border border-dashed border-rule text-muted"}`}>
                {i + 1}
              </span>
              <span className={`min-w-0 flex-1 truncate text-[13.5px] font-medium ${st.at === "product" ? "text-ink" : "text-body"}`}>{st.label}</span>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${w.cls}`}>{w.chip}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function TheSolution() {
  return (
    <div className="grid gap-3">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-stretch">
        <Path title="Before" caption="RCS Studio covered one step. Getting an agent live happened over email, outside the product." steps={before} on={false} />
        <div aria-hidden="true" className="flex items-center justify-center text-muted">
          <ArrowRight size={18} className="hidden md:block" />
          <ArrowDown size={18} className="md:hidden" />
        </div>
        <Path title="After" caption="RCS Studio covers the whole path, and getting the agent live is step one." steps={after} on />
      </div>
      <p className="bubble-sm border border-rule bg-bg px-4 py-2.5 text-center text-[13.5px] text-body">
        <span className="font-semibold text-ink">What changed:</span> provisioning moved from an email thread into the product, and became the first step instead of an afterthought.
      </p>
    </div>
  );
}

const features: { Icon: LucideIcon; title: string; text: string }[] = [
  { Icon: ListTodo, title: "Customer form", text: "Clean, complete submissions" },
  { Icon: ArrowDownToDot, title: "Tracking", text: "Know where your agent is" },
  { Icon: CodeXml, title: "API experience", text: "Provision and send from code" },
];

/** the three features that followed, under the slide 3 bullets; each is a slide of its own */
export function ThreeFeatures() {
  return (
    <div>
      <div className="label mb-3">3 Features:</div>
      <ul className="grid gap-3 sm:grid-cols-3">
        {features.map(({ Icon, title, text }) => (
          <li key={title} className="bubble-sm flex items-center gap-3 border border-rule bg-bg p-4">
            <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
              <Icon size={17} />
            </span>
            <span>
              <span className="block text-[15px] font-semibold leading-tight text-ink">{title}</span>
              <span className="mt-0.5 block text-[13px] text-muted">{text}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
