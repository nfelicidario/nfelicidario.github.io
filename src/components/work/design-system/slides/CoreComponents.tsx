import { Check, ChevronDown, Info } from "lucide-react";

/* Slide 7: the core components under the new tokens, one button's states, and the definition of done. */

const dod = ["Uses tokens only", "Accessibility tested", "Every state in Storybook", "Visual regression tests", "Matched to a Figma component, linked with Code Connect", "A deprecation note on what it replaces"];

export function CoreComponents() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
      <div className="bubble-sm border border-rule bg-bg p-4">
        <div className="label mb-3">The most-used components first</div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Cell title="Button" states>
            <span className="rounded-[8px] bg-accent px-3 py-1.5 text-[12.5px] font-semibold text-bg">Primary</span>
            <span className="rounded-[8px] border border-rule bg-surface px-3 py-1.5 text-[12.5px] font-semibold text-ink">Secondary</span>
            <span className="rounded-[8px] px-3 py-1.5 text-[12.5px] font-semibold text-accent">Ghost</span>
          </Cell>
          <Cell title="Input and select">
            <span className="flex min-w-[120px] flex-1 items-center rounded-[8px] border border-rule bg-surface px-2.5 py-1.5 text-[12.5px] text-muted">Brand name</span>
            <span className="flex items-center gap-2 rounded-[8px] border border-rule bg-surface px-2.5 py-1.5 text-[12.5px] text-ink">
              RCS <ChevronDown size={12} className="text-muted" aria-hidden="true" />
            </span>
          </Cell>
          <Cell title="Checkbox and radio">
            <span className="flex items-center gap-1.5 text-[12.5px] text-ink">
              <span className="grid h-4 w-4 place-items-center rounded-[4px] bg-accent text-bg"><Check size={11} /></span> Opt-in
            </span>
            <span className="flex items-center gap-1.5 text-[12.5px] text-ink">
              <span className="grid h-4 w-4 place-items-center rounded-full border-2 border-accent"><span className="h-2 w-2 rounded-full bg-accent" /></span> Monthly
            </span>
            <span className="flex items-center gap-1.5 text-[12.5px] text-muted">
              <span className="h-4 w-4 rounded-full border-2 border-rule" /> Weekly
            </span>
          </Cell>
          <Cell title="Tabs">
            <span className="flex items-center gap-3 border-b border-rule text-[12.5px]">
              <span className="-mb-px border-b-2 border-accent pb-1 font-semibold text-ink">Overview</span>
              <span className="pb-1 text-muted">Audience</span>
              <span className="pb-1 text-muted">Reports</span>
            </span>
          </Cell>
          <Cell title="Badge and tooltip">
            <span className="rounded-full bg-ok-soft px-2 py-0.5 text-[11.5px] font-semibold text-ok">Live</span>
            <span className="rounded-full bg-warn-soft px-2 py-0.5 text-[11.5px] font-semibold text-warn">In review</span>
            <span className="relative inline-flex items-center gap-1 text-[12.5px] text-muted">
              <Info size={13} aria-hidden="true" /> Why?
              <span className="ml-1 rounded-[6px] bg-ink px-2 py-1 text-[11px] text-bg">Explains the status</span>
            </span>
          </Cell>
          <Cell title="Toast">
            <span className="flex items-center gap-2 rounded-[10px] border border-rule bg-surface px-3 py-2 text-[12.5px] text-ink shadow-[var(--shadow)]">
              <Check size={13} className="text-ok" aria-hidden="true" /> Campaign scheduled
              <span className="ml-2 text-accent">Undo</span>
            </span>
          </Cell>
        </div>
        <div className="mt-3 rounded-[10px] border border-rule bg-surface p-3">
          <div className="label mb-2 text-muted">One API across every component</div>
          <div className="flex flex-wrap gap-1.5 font-mono text-[11px] text-body">
            {["size: sm | md | lg", "variant: primary | secondary | ghost", "state: default | hover | focus | disabled | loading"].map((t) => (
              <span key={t} className="rounded-md border border-rule bg-bg px-2 py-0.5">{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid content-start gap-3">
        <div className="bubble-sm border border-rule bg-bg p-4">
          <div className="label mb-2">Built on accessible primitives</div>
          <p className="text-[12.5px] leading-snug text-body">Radix underneath, so keyboard use, focus, and screen readers work by default instead of by effort.</p>
        </div>
        <div className="bubble-sm border border-rule bg-bg p-4">
          <div className="label mb-2">Definition of done</div>
          <ul className="grid gap-1.5">
            {dod.map((d) => (
              <li key={d} className="flex items-start gap-2 text-[12.5px] text-body">
                <span className="mt-[3px] grid h-3.5 w-3.5 shrink-0 place-items-center rounded-[3px] bg-accent text-bg"><Check size={9} /></span>
                {d}
              </li>
            ))}
          </ul>
        </div>
        <div className="bubble-sm border border-dashed border-rule p-4">
          <div className="label mb-1">Retiring the old</div>
          <p className="text-[12.5px] leading-snug text-body">Gradually, with deprecation warnings and a clear replacement for each.</p>
        </div>
      </div>
    </div>
  );
}

function Cell({ title, states, children }: { title: string; states?: boolean; children: React.ReactNode }) {
  return (
    <div className="rounded-[10px] border border-rule bg-surface p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[12.5px] font-semibold text-ink">{title}</span>
        {states && <span className="label text-muted">every state documented</span>}
      </div>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}
