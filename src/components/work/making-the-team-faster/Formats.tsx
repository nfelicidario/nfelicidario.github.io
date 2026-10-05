import type { ReactNode } from "react";

/** Abstract template thumbnails. Bars stand in for text; nothing here is real content. */
function Bar({ w, tone = "raised", h = "h-1.5" }: { w: string; tone?: "raised" | "accent" | "ink" | "ok"; h?: string }) {
  const bg =
    tone === "accent" ? "bg-accent/70" : tone === "ink" ? "bg-ink/70" : tone === "ok" ? "bg-ok/70" : "bg-raised";
  return <span className={`block ${h} rounded-full ${bg}`} style={{ width: w }} aria-hidden="true" />;
}

function Thumb({
  title,
  tag,
  tagTone = "muted",
  children,
}: {
  title: string;
  tag: string;
  tagTone?: "muted" | "accent";
  children: ReactNode;
}) {
  return (
    <figure className="grid gap-2">
      <div className="bubble-sm aspect-[4/3] overflow-hidden border border-rule bg-surface p-3">{children}</div>
      <figcaption className="flex items-baseline justify-between gap-2">
        <span className="text-[12.5px] font-semibold text-ink">{title}</span>
        <span className={`text-[10.5px] ${tagTone === "accent" ? "font-medium text-accent" : "text-muted"}`}>{tag}</span>
      </figcaption>
    </figure>
  );
}

function Roadmap() {
  const rows = [
    { start: 0, len: 3, tone: "accent" as const },
    { start: 2, len: 4, tone: "accent" as const },
    { start: 1, len: 2, tone: "ok" as const },
    { start: 4, len: 4, tone: "accent" as const },
    { start: 6, len: 2, tone: "ok" as const },
  ];
  return (
    <div className="grid h-full grid-rows-[auto_1fr] gap-2">
      <div className="grid grid-cols-[52px_1fr] items-center gap-2">
        <Bar w="80%" tone="ink" h="h-2" />
        <div className="grid grid-cols-4 gap-px text-[8px] text-muted" aria-hidden="true">
          {["Q1", "Q2", "Q3", "Q4"].map((q) => (
            <span key={q} className="border-l border-rule pl-1">
              {q}
            </span>
          ))}
        </div>
      </div>
      <div className="grid content-start gap-1.5" aria-hidden="true">
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-[52px_1fr] items-center gap-2">
            <Bar w={`${55 + (i % 3) * 15}%`} />
            <div className="relative h-3 rounded-sm bg-raised/50">
              <span
                className={`absolute inset-y-0 rounded-sm ${r.tone === "ok" ? "bg-ok/70" : "bg-accent/70"}`}
                style={{ left: `${(r.start / 8) * 100}%`, width: `${(r.len / 8) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SprintReview() {
  const cols = [
    { label: "Shipped", n: 3, tone: "ok" as const },
    { label: "In progress", n: 2, tone: "accent" as const },
    { label: "Next", n: 2, tone: "raised" as const },
  ];
  return (
    <div className="grid h-full grid-rows-[auto_1fr] gap-2">
      <div className="flex items-center justify-between">
        <Bar w="45%" tone="ink" h="h-2" />
        <span className="text-[8px] text-muted">Sprint 14</span>
      </div>
      <div className="grid grid-cols-3 gap-1.5" aria-hidden="true">
        {cols.map((c) => (
          <div key={c.label} className="grid content-start gap-1">
            <span className="text-[8px] font-medium text-muted">{c.label}</span>
            {Array.from({ length: c.n }).map((_, i) => (
              <span key={i} className="grid gap-1 rounded-md border border-rule bg-raised/60 p-1.5">
                <Bar w={`${60 + i * 10}%`} tone={c.tone === "raised" ? "raised" : c.tone} h="h-1" />
                <Bar w="40%" h="h-1" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function LeadershipUpdate() {
  return (
    <div className="grid h-full content-start gap-2.5">
      <Bar w="60%" tone="ink" h="h-2" />
      <div className="grid grid-cols-3 gap-1.5" aria-hidden="true">
        {["62%", "9", "4.1"].map((v) => (
          <span key={v} className="grid gap-1 rounded-md border border-rule bg-raised/60 p-1.5">
            <span className="num text-[11px] font-bold text-ink">{v}</span>
            <Bar w="70%" h="h-1" />
          </span>
        ))}
      </div>
      <div className="grid gap-1.5" aria-hidden="true">
        <Bar w="92%" />
        <Bar w="84%" />
        <Bar w="88%" />
        <Bar w="60%" />
      </div>
      <div className="mt-auto flex items-center gap-1.5" aria-hidden="true">
        <span className="h-1.5 w-1.5 rounded-full bg-ok" />
        <Bar w="35%" tone="ok" h="h-1" />
      </div>
    </div>
  );
}

function AllHandsDeck() {
  return (
    <div className="grid h-full grid-rows-[1fr_auto] gap-2">
      <div className="relative grid content-end gap-2 overflow-hidden rounded-md bg-ink p-3" aria-hidden="true">
        <span className="absolute top-2 right-2 h-6 w-6 rounded-full bg-accent/80" />
        <span className="block h-2.5 w-3/4 rounded-full bg-white/80" />
        <span className="block h-2.5 w-1/2 rounded-full bg-white/80" />
        <span className="block h-1.5 w-2/5 rounded-full bg-white/40" />
      </div>
      <div className="grid grid-cols-4 gap-1" aria-hidden="true">
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="aspect-video rounded-sm border border-rule bg-raised/60" />
        ))}
      </div>
    </div>
  );
}

export function Formats() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Thumb title="Roadmap" tag="Teams to executives">
        <Roadmap />
      </Thumb>
      <Thumb title="Sprint review" tag="Across product and technology">
        <SprintReview />
      </Thumb>
      <Thumb title="Leadership update" tag="A variant of the review">
        <LeadershipUpdate />
      </Thumb>
      <Thumb title="All Hands deck" tag="Next · first Claude Design template" tagTone="accent">
        <AllHandsDeck />
      </Thumb>
    </div>
  );
}

/** Two scattered sources merged into one system, with the first template still ahead. Static. */
export function SystemMerge() {
  return (
    <div className="grid gap-3">
      <div className="grid gap-2 md:grid-cols-[1fr_auto_1fr]">
        <div className="grid gap-2">
          <div className="bubble-sm grid gap-1.5 border border-dashed border-rule bg-raised/60 p-3">
            <span className="label">Before</span>
            <span className="text-[12.5px] font-semibold text-ink">Product design system</span>
            <span className="text-[11.5px] text-body">Scattered across Figma and component code</span>
            <span className="flex gap-1 pt-1" aria-hidden="true">
              {["bg-accent", "bg-accent/70", "bg-accent/40", "bg-raised"].map((c) => (
                <span key={c} className={`h-3 w-3 rounded-[3px] border border-rule ${c}`} />
              ))}
            </span>
          </div>
          <div className="bubble-sm grid gap-1.5 border border-dashed border-rule bg-raised/60 p-3">
            <span className="label">Before</span>
            <span className="text-[12.5px] font-semibold text-ink">Marketing identity</span>
            <span className="text-[11.5px] text-body">Scattered across old decks</span>
            <span className="flex gap-1 pt-1" aria-hidden="true">
              {["bg-ink", "bg-ink/70", "bg-warn/70", "bg-raised"].map((c) => (
                <span key={c} className={`h-3 w-3 rounded-[3px] border border-rule ${c}`} />
              ))}
            </span>
          </div>
        </div>
        <span aria-hidden="true" className="flex items-center justify-center text-muted md:rotate-0 rotate-90">
          <svg width="28" height="16" viewBox="0 0 28 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M1 8h24M19 2l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div className="bubble-sm grid content-start gap-2 border border-accent bg-accent-soft p-3">
          <span className="label text-accent">One system · Claude Design</span>
          <span className="text-[12.5px] font-semibold text-ink">Product&apos;s concise, UX-first language</span>
          <span className="text-[12.5px] font-semibold text-ink">+ marketing&apos;s visual identity</span>
          <div className="grid grid-cols-2 gap-1.5 pt-1" aria-hidden="true">
            <span className="grid gap-1 rounded-md border border-rule bg-surface p-1.5">
              <span className="text-[8px] text-muted">Type</span>
              <Bar w="80%" tone="ink" h="h-2" />
              <Bar w="55%" h="h-1" />
            </span>
            <span className="grid gap-1 rounded-md border border-rule bg-surface p-1.5">
              <span className="text-[8px] text-muted">Color</span>
              <span className="flex gap-1">
                {["bg-accent", "bg-ink", "bg-ok", "bg-warn"].map((c) => (
                  <span key={c} className={`h-3 w-3 rounded-full ${c}`} />
                ))}
              </span>
            </span>
            <span className="col-span-2 grid gap-1 rounded-md border border-rule bg-surface p-1.5">
              <span className="text-[8px] text-muted">Templates</span>
              <span className="flex flex-wrap gap-1 text-[9px]">
                <span className="rounded-full bg-accent px-1.5 py-0.5 font-medium text-white">All Hands · first</span>
                <span className="rounded-full border border-dashed border-rule px-1.5 py-0.5 text-muted">Sales · next</span>
                <span className="rounded-full border border-dashed border-rule px-1.5 py-0.5 text-muted">Business review · next</span>
                <span className="rounded-full border border-dashed border-rule px-1.5 py-0.5 text-muted">Marketing · next</span>
              </span>
            </span>
          </div>
          <span className="text-[10.5px] text-muted">Built in a week. First use: an upcoming All Hands.</span>
        </div>
      </div>
    </div>
  );
}
