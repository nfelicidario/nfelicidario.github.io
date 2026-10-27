import { ArrowDown, ArrowDownToDot, ArrowRight, CodeXml, ListTodo } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* Slide 3: the product's shape before and after, in one row. */

type Tone = "on" | "outline" | "missing";

const tile: Record<Tone, string> = {
  on: "border-accent bg-accent text-bg",
  outline: "border-rule bg-surface text-ink",
  missing: "border-dashed border-rule bg-transparent text-muted",
};

function Step({ n, label, tone, note }: { n: number; label: string; tone: Tone; note?: string }) {
  return (
    <div className={`flex min-w-0 flex-1 flex-col gap-0.5 rounded-[10px] border px-3 py-2.5 ${tile[tone]}`}>
      <div className="flex items-center gap-2">
        <span
          className={`num grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10.5px] font-semibold ${
            tone === "on" ? "bg-bg/20" : tone === "outline" ? "bg-accent-soft text-accent" : "border border-dashed border-rule"
          }`}
        >
          {n}
        </span>
        <span className="text-[13.5px] font-semibold">{label}</span>
      </div>
      {note && <span className={`pl-7 text-[11.5px] ${tone === "on" ? "text-bg/80" : "text-muted"}`}>{note}</span>}
    </div>
  );
}

export function TheSolution() {
  return (
    <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-stretch">
      <div className="bubble-sm flex flex-col gap-3 border border-dashed border-rule bg-bg p-4">
        <div className="text-[17px] font-bold leading-tight text-ink">Before</div>
        <div className="flex items-stretch gap-2">
          <Step n={1} label="Provisioning" tone="missing" note="Outside the product, by email" />
          <Step n={2} label="Flow Building" tone="on" note="For technical developers" />
        </div>
      </div>

      <div aria-hidden="true" className="flex items-center justify-center text-muted">
        <ArrowRight size={18} className="hidden md:block" />
        <ArrowDown size={18} className="md:hidden" />
      </div>

      <div className="bubble-sm flex flex-col gap-3 border border-accent bg-accent-soft/40 p-4">
        <div className="text-[17px] font-bold leading-tight text-accent">After</div>
        <div className="flex items-stretch gap-2">
          <Step n={1} label="Provisioning" tone="on" note="For customers and our internal operations team" />
          <Step n={2} label="Flow Building" tone="outline" note="The flow builder, as step two" />
        </div>
      </div>
    </div>
  );
}

const features: { Icon: LucideIcon; title: string; text: string }[] = [
  { Icon: ListTodo, title: "Customer form", text: "From a bare form to a guided one" },
  { Icon: ArrowDownToDot, title: "Tracking", text: "Know where your agent is" },
  { Icon: CodeXml, title: "API experience", text: "Provision and send by API" },
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
