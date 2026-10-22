import { ArrowRight } from "lucide-react";

/* Slide 6: the same provisioning step drawn in the inherited system and in RCS Studio. Mock content, no real screens. */

const changes = [
  { n: 1, label: "Type", from: "Large display type", to: "Small, dense type" },
  { n: 2, label: "Spacing", from: "Generous", to: "Tight" },
  { n: 3, label: "Color", from: "Several colors, used freely", to: "One color, for the next step" },
];

function Field({ label, value, big }: { label: string; value: string; big?: boolean }) {
  return (
    <div>
      <div className={`font-medium text-ink ${big ? "mb-2 text-[14px]" : "mb-1 text-[11.5px]"}`}>{label}</div>
      <div
        className={`flex items-center rounded-[8px] border border-rule bg-bg text-body ${big ? "h-12 px-4 text-[15px]" : "h-8 px-2.5 text-[12.5px]"}`}
      >
        {value}
      </div>
    </div>
  );
}

function Inherited() {
  return (
    <div aria-hidden="true" className="rounded-[12px] border border-rule bg-surface p-7">
      <div className="mb-6 flex items-center gap-2">
        <span className="h-2 flex-1 rounded-full bg-[var(--ok)]" />
        <span className="h-2 flex-1 rounded-full bg-[var(--warn)]" />
        <span className="h-2 flex-1 rounded-full bg-rule" />
      </div>
      <div className="font-display text-[26px] leading-none font-bold tracking-[-0.03em] text-ink">Register your brand</div>
      <p className="mt-3 text-[14px] text-body">Tell us about the business that will be sending messages.</p>
      <div className="mt-6 grid gap-5">
        <Field label="Brand name" value="Acme Coffee" big />
        <Field label="Website" value="acmecoffee.com" big />
      </div>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <span className="inline-flex h-12 items-center rounded-full bg-[var(--warn)] px-6 text-[15px] font-semibold text-bg">Continue</span>
        <span className="inline-flex h-12 items-center rounded-full border-2 border-[var(--ok)] px-6 text-[15px] font-semibold text-[var(--ok)]">
          Save draft
        </span>
        <span className="text-[14px] font-semibold text-accent underline">Skip for now</span>
      </div>
    </div>
  );
}

function Studio() {
  return (
    <div aria-hidden="true" className="rounded-[12px] border border-rule bg-surface p-4">
      <div className="mb-3 flex items-center gap-1.5">
        <span className="h-1 flex-1 rounded-full bg-accent" />
        <span className="h-1 flex-1 rounded-full bg-rule" />
        <span className="h-1 flex-1 rounded-full bg-rule" />
      </div>
      <div className="label text-muted">Step 1 of 3</div>
      <div className="mt-1 text-[15px] font-semibold tracking-[-0.01em] text-ink">Register your brand</div>
      <p className="mt-1 text-[12px] text-muted">The business that will be sending messages.</p>
      <div className="mt-3 grid gap-2.5">
        <Field label="Brand name" value="Acme Coffee" />
        <Field label="Website" value="acmecoffee.com" />
      </div>
      <div className="mt-4 flex items-center gap-3">
        <span className="inline-flex h-8 items-center rounded-full bg-accent px-3.5 text-[12.5px] font-semibold text-bg">Continue</span>
        <span className="text-[12px] text-muted">Save draft</span>
      </div>
    </div>
  );
}

export function LookShift() {
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 md:items-start">
        <div>
          <div className="label mb-2">Inherited system · built for a marketing product</div>
          <Inherited />
        </div>
        <div>
          <div className="label mb-2 text-accent">RCS Studio · built for a step-by-step form</div>
          <Studio />
        </div>
      </div>

      <div className="mt-4 grid gap-x-3 gap-y-1.5 text-[13px] sm:grid-cols-[auto_auto_1fr_auto_1fr] sm:items-center">
        {changes.map((c) => (
          <div key={c.n} className="contents">
            <span className="num grid h-5 w-5 place-items-center rounded-full bg-ink text-[10px] text-bg">{c.n}</span>
            <span className="font-medium text-ink">{c.label}</span>
            <span className="text-muted">{c.from}</span>
            <ArrowRight size={12} aria-hidden="true" className="hidden text-muted sm:block" />
            <span className="text-ink">{c.to}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <figure className="bubble-sm border border-rule bg-bg px-3 py-1.5">
          <blockquote className="text-[13px] text-ink">&ldquo;Elegant and modern&rdquo;</blockquote>
          <figcaption className="label">Customers and sales</figcaption>
        </figure>
        <span className="rounded-full border border-accent bg-accent-soft px-2.5 py-1 text-[12px] text-accent">
          Now the direction for next-generation products
        </span>
      </div>
    </div>
  );
}
