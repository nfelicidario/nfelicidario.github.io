import { CalendarRange, CheckSquare, Filter, Search, SlidersHorizontal, SquareStack, Type } from "lucide-react";

/* Slide 8: the app shell, the page templates and their states, the repeating patterns, and content guidelines. */

function Wire({ title, kind }: { title: string; kind: "list" | "detail" | "settings" | "form" | "dashboard" | "shell" }) {
  return (
    <figure className="rounded-[10px] border border-rule bg-surface p-2">
      <div className="grid aspect-[4/3] grid-cols-[18%_1fr] gap-1 overflow-hidden rounded-[6px] border border-rule bg-bg p-1" aria-hidden="true">
        <div className="rounded-[3px] bg-raised" />
        <div className="grid min-h-0 grid-rows-[10%_1fr] gap-1">
          <div className="rounded-[3px] bg-raised" />
          <div className="min-h-0">
            {kind === "list" && (
              <div className="grid h-full grid-rows-[14%_repeat(5,1fr)] gap-[3px]">
                <div className="rounded-[3px] bg-accent-soft" />
                {[0, 1, 2, 3, 4].map((i) => <div key={i} className="rounded-[2px] bg-raised" />)}
              </div>
            )}
            {kind === "detail" && (
              <div className="grid h-full grid-cols-[1fr_38%] gap-[3px]">
                <div className="grid gap-[3px]"><div className="rounded-[3px] bg-raised" /><div className="rounded-[3px] bg-raised" /></div>
                <div className="rounded-[3px] bg-accent-soft" />
              </div>
            )}
            {kind === "settings" && (
              <div className="grid h-full grid-cols-[30%_1fr] gap-[3px]">
                <div className="rounded-[3px] bg-accent-soft" />
                <div className="grid gap-[3px]">{[0, 1, 2].map((i) => <div key={i} className="rounded-[2px] bg-raised" />)}</div>
              </div>
            )}
            {kind === "form" && (
              <div className="mx-auto grid h-full w-[70%] grid-rows-[repeat(4,1fr)_18%] gap-[3px]">
                {[0, 1, 2, 3].map((i) => <div key={i} className="rounded-[2px] bg-raised" />)}
                <div className="w-1/2 justify-self-end rounded-[3px] bg-accent" />
              </div>
            )}
            {kind === "dashboard" && (
              <div className="grid h-full grid-cols-3 grid-rows-[30%_1fr] gap-[3px]">
                {[0, 1, 2].map((i) => <div key={i} className="rounded-[3px] bg-accent-soft" />)}
                <div className="col-span-2 rounded-[3px] bg-raised" />
                <div className="rounded-[3px] bg-raised" />
              </div>
            )}
            {kind === "shell" && (
              <div className="grid h-full place-items-center rounded-[3px] border border-dashed border-rule text-[9px] text-muted">page</div>
            )}
          </div>
        </div>
      </div>
      <figcaption className="mt-1.5 px-0.5 text-[12px] font-semibold text-ink">{title}</figcaption>
    </figure>
  );
}

export function PagePatterns() {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Wire title="App shell" kind="shell" />
        <Wire title="List" kind="list" />
        <Wire title="Detail" kind="detail" />
        <Wire title="Settings" kind="settings" />
        <Wire title="Form" kind="form" />
        <Wire title="Dashboard" kind="dashboard" />
      </div>
      <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div className="bubble-sm border border-rule bg-bg p-4">
          <div className="label mb-2">Repeating patterns</div>
          <div className="flex flex-wrap items-center gap-1.5 rounded-[10px] border border-rule bg-surface p-2 text-[12px] text-ink">
            <span className="flex items-center gap-1 rounded-[7px] border border-rule px-2 py-1 text-muted"><Search size={12} aria-hidden="true" /> Search</span>
            <span className="flex items-center gap-1 rounded-[7px] border border-rule px-2 py-1"><SlidersHorizontal size={12} aria-hidden="true" /> Group by</span>
            <span className="flex items-center gap-1 rounded-[7px] border border-rule px-2 py-1"><Filter size={12} aria-hidden="true" /> Filters</span>
            <span className="flex items-center gap-1 rounded-[7px] border border-rule px-2 py-1"><CalendarRange size={12} aria-hidden="true" /> Date range</span>
            <span className="flex items-center gap-1 rounded-[7px] bg-accent-soft px-2 py-1 text-accent"><CheckSquare size={12} aria-hidden="true" /> 3 selected</span>
          </div>
          <p className="mt-2 text-[12px] leading-snug text-muted">List toolbar, date range picker, bulk actions, pagination. Mostly Studio&apos;s proven patterns: this is where promotion matters most.</p>
        </div>
        <div className="bubble-sm border border-rule bg-bg p-4">
          <div className="label mb-2 flex items-center gap-1.5"><SquareStack size={12} aria-hidden="true" /> Every template ships with</div>
          <ul className="grid gap-1 text-[12.5px] text-body">
            <li>An empty state that says what to do</li>
            <li>An error state that says what happened</li>
            <li>A loading state</li>
            <li>Guidance on when to use it</li>
          </ul>
        </div>
        <div className="bubble-sm border border-rule bg-bg p-4">
          <div className="label mb-2 flex items-center gap-1.5"><Type size={12} aria-hidden="true" /> Content guidelines</div>
          <ul className="grid gap-1 text-[12.5px] text-body">
            <li>Sentence case</li>
            <li>Voice and tone</li>
            <li>How to write an error message</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
