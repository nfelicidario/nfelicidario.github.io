"use client";

import { useState } from "react";
import { Bot, FilePlus2, GitMerge, ListChecks, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* Slide 7: with all work in one place and one structure, agents can draft, summarize, and connect. Mock output. */

type Action = { Icon: LucideIcon; label: string; prompt: string; output: string[] };

const actions: Action[] = [
  {
    Icon: FilePlus2,
    label: "Draft issues",
    prompt: "Break the Saved views project into issues",
    output: ["Add a Save view action to the list toolbar", "Store views per user, with a default", "Switch views from the page header", "Rename and delete a saved view"],
  },
  {
    Icon: ListChecks,
    label: "Summarize status",
    prompt: "Where is the Submissions project this week?",
    output: ["Shaping finished Tuesday, four issues created", "Two issues In Progress, one Ready to Deploy", "Blocked: partner template fields, owner named", "On track for the release window"],
  },
  {
    Icon: GitMerge,
    label: "Connect work to code",
    prompt: "Link this issue to the prototype branch",
    output: ["Branch proto/saved-views attached to VIB-214", "Merge request !482 linked, prototype URL added", "Issue moves to In Progress when the MR opens", "Closes on merge"],
  },
];

export function AiReadable() {
  const [i, setI] = useState(0);
  const a = actions[i];
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
      <div className="grid content-start gap-3">
        <div className="bubble-sm border border-rule bg-bg p-4">
          <div className="label mb-2">One place, one structure</div>
          <ul className="grid gap-1 text-[12.5px] text-body">
            <li>Initiative → Project → Issue, the same everywhere</li>
            <li>Six project stages, the same everywhere</li>
            <li>Every issue can point at a branch and a merge request</li>
          </ul>
        </div>
        <div className="grid gap-1.5" role="group" aria-label="What an agent can do">
          {actions.map(({ Icon, label }, idx) => (
            <button
              key={label}
              type="button"
              aria-pressed={idx === i}
              onClick={() => setI(idx)}
              className={`flex items-center gap-2 rounded-[10px] border px-3 py-2 text-left text-[13px] font-semibold transition-colors ${
                idx === i ? "border-accent bg-accent-soft text-accent" : "border-rule bg-bg text-ink hover:border-accent"
              }`}
            >
              <Icon size={14} aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="bubble-sm overflow-hidden border border-rule bg-bg">
        <div className="flex items-center gap-2 border-b border-rule px-4 py-2.5">
          <Bot size={14} className="text-accent" aria-hidden="true" />
          <span className="label">Agent, on the tracker</span>
          <span className="label ml-auto text-muted">mock output</span>
        </div>
        <div className="grid gap-3 p-4">
          <div className="justify-self-end rounded-[12px] rounded-br-[4px] bg-accent px-3 py-2 text-[12.5px] text-bg">{a.prompt}</div>
          <div className="rounded-[12px] rounded-bl-[4px] border border-rule bg-surface p-3">
            <div className="mb-2 flex items-center gap-1.5 text-[11.5px] text-muted">
              <Sparkles size={11} aria-hidden="true" /> {a.label}
            </div>
            <ol className="grid gap-1.5">
              {a.output.map((o, n) => (
                <li key={o} className="flex items-start gap-2 text-[12.5px] text-body">
                  <span className="num mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-accent-soft text-[10px] font-semibold text-accent">{n + 1}</span>
                  {o}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
