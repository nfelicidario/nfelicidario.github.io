"use client";

import { useState } from "react";
import { Check, CircleDashed, PenLine } from "lucide-react";

/*
 * Slide 5: the vote board. Eighteen ideas in two groups, each shown as Nexus today next to Nexus next,
 * voted agree / agree with changes / not yet. The ideas are illustrative; the votes are the viewer's.
 */

type Vote = "agree" | "changes" | "later" | null;
const VOTES: { key: Exclude<Vote, null>; label: string; Icon: typeof Check }[] = [
  { key: "agree", label: "Agree", Icon: Check },
  { key: "changes", label: "With changes", Icon: PenLine },
  { key: "later", label: "Not yet", Icon: CircleDashed },
];

const GROUPS: { title: string; ideas: string[] }[] = [
  {
    title: "Look and feel",
    ideas: [
      "One accent colour, reserved for the next step",
      "A neutral scale for surfaces and text",
      "Smaller, tighter type",
      "A 4px spacing scale",
      "Softer corners",
      "Lucide icons, stroke not fill",
      "Status colours only for status",
    ],
  },
  {
    title: "Page patterns",
    ideas: [
      "One app shell",
      "A page header with actions on the right",
      "The list toolbar: search, group by, sort, filters",
      "A detail page template",
      "A settings page template",
      "A form page template",
      "A dashboard template",
      "Empty states that say what to do",
      "Error states that say what happened",
      "One date range picker",
      "Bulk actions and pagination",
    ],
  },
];

export function DirectionVote() {
  const [votes, setVotes] = useState<Record<string, Vote>>({});
  const total = GROUPS.reduce((n, g) => n + g.ideas.length, 0);
  const cast = Object.values(votes).filter(Boolean).length;

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
      <div className="bubble-sm overflow-hidden border border-rule bg-bg">
        <div className="flex items-center justify-between gap-3 border-b border-rule px-4 py-2.5">
          <span className="label">Design direction review</span>
          <span className="label num text-muted">
            {cast} / {total} voted
          </span>
        </div>
        <div className="grid md:grid-cols-2">
          {GROUPS.map((g) => (
            <div key={g.title} className="border-rule md:first:border-r">
              <div className="flex items-center justify-between border-b border-rule bg-surface px-4 py-2">
                <span className="text-[13px] font-semibold text-ink">{g.title}</span>
                <span className="label num text-muted">{g.ideas.length} ideas</span>
              </div>
              <ol className="divide-y divide-rule">
                {g.ideas.map((idea) => {
                  const v = votes[idea] ?? null;
                  return (
                    <li key={idea} className="flex items-center gap-2 px-4 py-1.5">
                      <span className="flex min-w-0 flex-1 items-center gap-2 text-[12.5px] text-body">
                        <span className="flex shrink-0 items-center gap-0.5" aria-hidden="true" title="Nexus today, Nexus next">
                          <span className="block h-3 w-3 rounded-[2px] bg-[#6b3fd6]" />
                          <span className="block h-3 w-3 rounded-full bg-accent" />
                        </span>
                        <span className="truncate">{idea}</span>
                      </span>
                      <span role="group" aria-label={`Vote on ${idea}`} className="flex shrink-0 items-center gap-0.5">
                        {VOTES.map(({ key, label, Icon }) => (
                          <button
                            key={key}
                            type="button"
                            title={label}
                            aria-pressed={v === key}
                            onClick={() => setVotes((p) => ({ ...p, [idea]: p[idea] === key ? null : key }))}
                            className={`grid h-6 w-6 place-items-center rounded-full transition-colors ${
                              v === key ? "bg-accent text-bg" : "text-muted hover:bg-raised hover:text-ink"
                            }`}
                          >
                            <Icon size={12} aria-hidden="true" />
                            <span className="sr-only">{label}</span>
                          </button>
                        ))}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-rule px-4 py-2 text-[11.5px] text-muted">
          <span className="flex items-center gap-1.5"><span className="block h-3 w-3 rounded-[2px] bg-[#6b3fd6]" /> Nexus today</span>
          <span className="flex items-center gap-1.5"><span className="block h-3 w-3 rounded-full bg-accent" /> Nexus next</span>
          {VOTES.map(({ key, label, Icon }) => (
            <span key={key} className="flex items-center gap-1"><Icon size={11} aria-hidden="true" /> {label}</span>
          ))}
        </div>
      </div>

      <div className="grid content-start gap-3">
        <div className="bubble-sm border border-rule bg-bg p-4">
          <div className="label mb-2">In the room</div>
          <ul className="grid gap-1 text-[12.5px] text-body">
            <li>Design, product, and engineering leads from both products</li>
            <li>Sales and marketing, for the brand view</li>
          </ul>
        </div>
        <div className="bubble-sm border border-rule bg-bg p-4">
          <div className="label mb-2">Reacting to real UI</div>
          <p className="text-[12.5px] leading-snug text-body">
            Each idea is shown on a working prototype, Nexus next in Storybook, not on a mockup. Notes are recorded with every vote.
          </p>
        </div>
        <div className="bubble-sm border border-dashed border-rule p-4">
          <div className="label mb-1">Deliverable</div>
          <p className="text-[12.5px] leading-snug text-body">An agreed design direction, written up as a short set of design principles.</p>
        </div>
      </div>
    </div>
  );
}
