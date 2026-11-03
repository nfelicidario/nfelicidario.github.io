import { ArrowRight, ClipboardList, Megaphone, Split, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* Slide 8: the four moves that took decks from hours of formatting to on-brand by default. Abstract thumbnails. */

const moves: { Icon: LucideIcon; title: string; text: string }[] = [
  { Icon: ClipboardList, title: "Audit the current state", text: "Collect existing decks, list the recurring problems, review the tools and templates people already use" },
  { Icon: Split, title: "Separate process from operational", text: "With stakeholders, sort what needs a new process from what just needs better templates. Most output from the fewest edits" },
  { Icon: Megaphone, title: "Prove it in public", text: "Build the quarterly All Hands deck with the design system, so the whole company sees it on a real, high-stakes deck" },
  { Icon: Sparkles, title: "Extend it everywhere", text: "Apply the system to every other slide type, and create the templates teams actually need" },
];

function Thumb({ messy }: { messy?: boolean }) {
  // an abstract slide: bars for text; the messy version misaligns and mixes colours
  return (
    <div className={`aspect-video rounded-[6px] border p-1.5 ${messy ? "border-rule bg-surface" : "border-accent/40 bg-bg"}`} aria-hidden="true">
      <div className={`h-1.5 rounded-sm ${messy ? "w-2/3 bg-[#6b3fd6]" : "w-1/2 bg-ink"}`} />
      <div className={`mt-1 h-1 rounded-sm ${messy ? "ml-2 w-5/6 bg-[#f26b1d]/70" : "w-3/4 bg-rule"}`} />
      <div className={`mt-1 h-1 rounded-sm ${messy ? "w-1/3 bg-[#1fb04a]/70" : "w-2/3 bg-rule"}`} />
      <div className={`mt-1.5 grid grid-cols-3 gap-1 ${messy ? "" : ""}`}>
        <div className={`h-3 rounded-sm ${messy ? "bg-[#ffd166]" : "bg-accent-soft"}`} />
        <div className={`h-3 rounded-sm ${messy ? "col-span-2 bg-[#6b3fd6]/40" : "bg-accent-soft"}`} />
        {!messy && <div className="h-3 rounded-sm bg-accent-soft" />}
      </div>
    </div>
  );
}

export function DeckPlaybook() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="bubble-sm border border-rule bg-surface p-4">
          <div className="label mb-2 text-muted">Before: formatted slide by slide</div>
          <div className="grid grid-cols-4 gap-2">
            <Thumb messy /><Thumb messy /><Thumb messy /><Thumb messy />
          </div>
          <p className="mt-2 text-[12px] text-muted">Off-brand layouts, hours spent on formatting, different every time.</p>
        </div>
        <div className="bubble-sm border border-accent bg-surface p-4">
          <div className="label mb-2 text-accent">After: on-brand by default</div>
          <div className="grid grid-cols-4 gap-2">
            <Thumb /><Thumb /><Thumb /><Thumb />
          </div>
          <p className="mt-2 text-[12px] text-muted">One design system, every slide type, reviewed for content instead of formatting.</p>
        </div>
      </div>
      <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {moves.map(({ Icon, title, text }, i) => (
          <li key={title} className="bubble-sm relative border border-rule bg-bg p-4">
            <div className="flex items-center gap-2">
              <span className="num grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent-soft text-[11px] font-semibold text-accent">{i + 1}</span>
              <Icon size={15} className="text-accent" aria-hidden="true" />
            </div>
            <div className="mt-3 text-[13.5px] font-semibold leading-snug text-ink">{title}</div>
            <div className="mt-1 text-[12px] leading-snug text-muted">{text}</div>
            {i < moves.length - 1 && <ArrowRight size={12} className="absolute -right-2 top-1/2 hidden -translate-y-1/2 text-muted lg:block" aria-hidden="true" />}
          </li>
        ))}
      </ol>
    </div>
  );
}
