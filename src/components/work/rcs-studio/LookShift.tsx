import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

/* Abstract mock of one step, drawn twice. Type scale, spacing, and color only. No real screens. */

const pinClass = "num absolute grid h-5 w-5 place-items-center rounded-full bg-ink text-[10px] text-bg";

function Pin({ n, className }: { n: number; className: string }) {
  return (
    <span aria-hidden="true" className={`${pinClass} ${className}`}>
      {n}
    </span>
  );
}

const inheritedPills = ["bg-accent", "bg-[var(--ok)]", "bg-[var(--warn)]", "bg-ink", "bg-muted"];

const changes = [
  { n: 1, label: "Type", from: "Large", to: "Small" },
  { n: 2, label: "Spacing", from: "Generous", to: "Tight" },
  { n: 3, label: "Color", from: "Used freely", to: "Next step only" },
];

const path = ["Reviewed with the head of design", "Fed back into the shared system", "Direction for next-generation products"];

function Headline({ className }: { className: string }) {
  return (
    <div className="relative">
      <Pin n={1} className="top-0 right-full mr-2 translate-y-[2px]" />
      <div className={`font-display leading-none font-bold text-ink ${className}`}>Register your brand</div>
    </div>
  );
}

function Cta({ className }: { className: string }) {
  return (
    <span className="relative inline-flex">
      <span className={`inline-flex items-center rounded-full font-semibold text-bg ${className}`}>Continue</span>
      <Pin n={3} className="top-1/2 left-full ml-1.5 -translate-y-1/2" />
    </span>
  );
}

function Card({ children, className }: { children: ReactNode; className: string }) {
  return (
    <div aria-hidden="true" className={`relative rounded-[10px] border border-rule bg-surface ${className}`}>
      <Pin n={2} className="-top-2.5 -left-2.5" />
      {children}
    </div>
  );
}

export function LookShift() {
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="bubble-sm border border-dashed border-rule bg-bg p-4">
          <div className="label mb-3">Inherited · built for a marketing product</div>
          <Card className="p-6">
            <Headline className="text-[26px] tracking-[-0.03em]" />
            <div className="mt-4 grid gap-4">
              <div className="h-10 rounded-[8px] border border-rule bg-bg" />
              <div className="h-10 rounded-[8px] border border-rule bg-bg" />
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {inheritedPills.map((c) => (
                <span key={c} className={`h-6 w-12 rounded-full ${c}`} />
              ))}
            </div>
            <div className="mt-6">
              <Cta className="h-10 bg-[var(--warn)] px-5 text-[14px]" />
            </div>
          </Card>
        </div>

        <div className="bubble-sm border border-accent bg-accent-soft/40 p-4">
          <div className="label mb-3 text-accent">RCS Studio · one color, for the next step</div>
          <Card className="p-3">
            <Headline className="text-[15px] tracking-[-0.02em]" />
            <div className="mt-2 grid gap-1.5">
              <div className="h-7 rounded-[6px] border border-rule bg-bg" />
              <div className="h-7 rounded-[6px] border border-rule bg-bg" />
            </div>
            <div className="mt-3">
              <Cta className="h-6 bg-accent px-3 text-[11px]" />
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-[auto_auto_1fr_auto_1fr] items-center gap-x-3 gap-y-1 text-[12.5px]">
        {changes.map((c) => (
          <div key={c.n} className="contents">
            <span className="num grid h-5 w-5 place-items-center rounded-full bg-ink text-[10px] text-bg">{c.n}</span>
            <span className="font-medium text-ink">{c.label}</span>
            <span className="text-muted">{c.from}</span>
            <ArrowRight size={12} aria-hidden="true" className="text-muted" />
            <span className="text-ink">{c.to}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-rule pt-3">
        <figure className="bubble-sm border border-rule bg-surface px-3 py-1.5">
          <blockquote className="text-[13px] text-ink">“Elegant and modern”</blockquote>
          <figcaption className="label">Customers and sales</figcaption>
        </figure>
        <ol className="flex flex-wrap items-center gap-2">
          {path.map((p, i) => (
            <li key={p} className="flex items-center gap-2">
              {i > 0 && <ArrowRight size={12} aria-hidden="true" className="text-muted" />}
              <span
                className={`rounded-full border px-2.5 py-1 text-[12px] ${
                  i === path.length - 1 ? "border-accent bg-accent-soft text-accent" : "border-rule bg-surface text-body"
                }`}
              >
                {p}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
