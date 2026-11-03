import { ArrowDownToLine, Copy, RefreshCw, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* Slide 11: what the promotion model sets up. The first is real today (icons); the rest are what the plan is for. */

const outcomes: { Icon: LucideIcon; title: string; text: string }[] = [
  { Icon: RefreshCw, title: "Nexus stays current", text: "It evolves with the product instead of falling behind it" },
  { Icon: Copy, title: "No duplicate work", text: "A pattern is built once and shared, not rebuilt in each app" },
  { Icon: ArrowDownToLine, title: "Platform gets Studio's improvements", text: "Automatically, as they're promoted" },
  { Icon: Sparkles, title: "Nexus becomes the starting point", text: "Teams build new features from existing parts, and promotion becomes an occasional, deliberate step" },
];

export function NexusOutcomes() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {outcomes.map(({ Icon, title, text }) => (
        <li key={title} className="bubble-sm border border-rule bg-bg p-4">
          <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-full bg-accent-soft text-accent">
            <Icon size={15} />
          </span>
          <div className="mt-3 text-[14px] font-semibold leading-snug text-ink">{title}</div>
          <div className="mt-1 text-[12.5px] leading-snug text-muted">{text}</div>
        </li>
      ))}
    </ul>
  );
}
