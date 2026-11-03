import { ArrowDown, GitBranch, Layers, ListChecks, Palette, Repeat, Route, Shapes, Shuffle, Sparkles, Wand2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* Slide 2: how Nexus and Studio related before and after promotion, and the eight steps of the plan. */

function Box({ title, sub, tone = "plain" }: { title: string; sub: string; tone?: "plain" | "accent" | "muted" }) {
  const cls = tone === "accent" ? "border-accent bg-accent-soft" : tone === "muted" ? "border-dashed border-rule bg-transparent" : "border-rule bg-bg";
  return (
    <div className={`bubble-sm border px-3 py-2.5 ${cls}`}>
      <div className={`text-[13.5px] font-semibold leading-tight ${tone === "muted" ? "text-muted" : "text-ink"}`}>{title}</div>
      <div className="mt-0.5 text-[12px] leading-snug text-muted">{sub}</div>
    </div>
  );
}

export function Promotion() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="bubble-sm self-start border border-rule bg-surface p-4">
        <div className="label mb-3 flex items-center gap-2 text-muted">
          <Shuffle size={13} aria-hidden="true" /> Before: two tracks
        </div>
        <div className="grid gap-2">
          <Box title="Nexus" sub="Evolved on its own, built for a mobile marketer" />
          <div className="grid grid-cols-2 gap-2">
            <Box title="Platform" sub="Ported old screens onto Nexus, page by page" tone="muted" />
            <Box title="RCS Studio" sub="Iterated fast on feedback and drifted away" tone="muted" />
          </div>
        </div>
        <p className="mt-3 text-[12.5px] leading-snug text-muted">Every improvement lived in one app. The gap widened with each release.</p>
      </div>
      <div className="bubble-sm border border-accent bg-surface p-4">
        <div className="label mb-3 flex items-center gap-2 text-accent">
          <Repeat size={13} aria-hidden="true" /> After: promote up
        </div>
        <div className="grid gap-2">
          <Box title="RCS Studio" sub="Builds new components and patterns first" />
          <div className="flex items-center justify-center gap-2 text-accent">
            <ArrowDown size={14} aria-hidden="true" />
            <span className="label">anything that should be shared</span>
          </div>
          <Box title="Nexus" sub="Where the standard lives, fed by the product evolving fastest" tone="accent" />
          <div className="flex items-center justify-center gap-2 text-accent">
            <ArrowDown size={14} aria-hidden="true" />
            <span className="label">through the system</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Box title="Platform" sub="Gets the improvement everywhere at once" />
            <Box title="Every other app" sub="Starts from Nexus parts" />
          </div>
        </div>
      </div>
    </div>
  );
}

const steps: { Icon: LucideIcon; title: string; text: string }[] = [
  { Icon: ListChecks, title: "Assess, pick the first win", text: "Audit Nexus and the UI, score the candidates" },
  { Icon: Shapes, title: "Rebuild the icon library", text: "One standard, every app: the first promotion" },
  { Icon: Route, title: "Agree on a direction", text: "Big ideas before exact values, on a prototype" },
  { Icon: Palette, title: "Set the foundations", text: "Tokens in layers, one source for design and code" },
  { Icon: Layers, title: "Rebuild the core components", text: "Accessible primitives, one API, every state" },
  { Icon: Wand2, title: "Add page patterns", text: "Shell, templates, and repeating patterns from Studio" },
  { Icon: GitBranch, title: "Adopt across products", text: "Studio first, then Platform, in layers" },
  { Icon: Sparkles, title: "Keep promoting", text: "Tiers, a path, a group, and real releases" },
];

export function EightSteps() {
  return (
    <div>
      <div className="label mb-3">8 Steps:</div>
      <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map(({ Icon, title, text }, i) => (
          <li key={title} className="bubble-sm flex items-start gap-3 border border-rule bg-bg p-3">
            <span className="num grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent-soft text-[11px] font-semibold text-accent">{i + 1}</span>
            <span className="min-w-0">
              <span className="flex items-center gap-1.5 text-[13.5px] font-semibold leading-tight text-ink">
                <Icon size={13} className="shrink-0 text-accent" aria-hidden="true" />
                {title}
              </span>
              <span className="mt-0.5 block text-[12px] leading-snug text-muted">{text}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
