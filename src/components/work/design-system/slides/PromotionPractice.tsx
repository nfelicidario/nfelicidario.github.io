import { ArrowRight, Check, Tag } from "lucide-react";

/* Slide 10: tiers, what qualifies, the path into Nexus, the group that reviews it, and real releases. */

const tiers = [
  { name: "App-only", text: "Lives in one app. Free to change." },
  { name: "Product-shared", text: "Shared across a product's own apps." },
  { name: "Nexus", text: "The standard. Every app can take it.", on: true },
];
const qualifies = ["Needed, or likely needed, by two or more apps", "Stable", "Uses tokens only", "Accessible"];
const path = ["Propose", "Review", "Generalize", "Land in Nexus", "Source app switches"];

export function PromotionPractice() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <div className="grid content-start gap-3">
        <div className="bubble-sm border border-rule bg-bg p-4">
          <div className="label mb-2 flex items-center gap-1.5"><Tag size={12} aria-hidden="true" /> Every component gets a tier</div>
          <ol className="grid gap-2 sm:grid-cols-3">
            {tiers.map((t) => (
              <li key={t.name} className={`rounded-[10px] border p-3 ${t.on ? "border-accent bg-accent-soft" : "border-rule bg-surface"}`}>
                <div className={`text-[13px] font-semibold ${t.on ? "text-accent" : "text-ink"}`}>{t.name}</div>
                <div className="mt-0.5 text-[12px] leading-snug text-muted">{t.text}</div>
              </li>
            ))}
          </ol>
        </div>
        <div className="bubble-sm border border-rule bg-bg p-4">
          <div className="label mb-2">What qualifies for Nexus</div>
          <ul className="grid gap-1.5 sm:grid-cols-2">
            {qualifies.map((q) => (
              <li key={q} className="flex items-start gap-2 text-[12.5px] text-body">
                <Check size={13} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                {q}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid content-start gap-3">
        <div className="bubble-sm border border-rule bg-bg p-4">
          <div className="label mb-3">The path</div>
          <ol className="flex flex-wrap items-center gap-1.5">
            {path.map((p, i) => (
              <li key={p} className="flex items-center gap-1.5">
                <span className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ${i === path.length - 2 ? "bg-accent text-bg" : "border border-rule bg-surface text-ink"}`}>{p}</span>
                {i < path.length - 1 && <ArrowRight size={12} className="text-muted" aria-hidden="true" />}
              </li>
            ))}
          </ol>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="bubble-sm border border-rule bg-bg p-4">
            <div className="label mb-1.5">A small design system group</div>
            <p className="text-[12.5px] leading-snug text-body">Design and engineering from each product, meeting regularly to review proposals.</p>
          </div>
          <div className="bubble-sm border border-rule bg-bg p-4">
            <div className="label mb-1.5">Released properly</div>
            <p className="text-[12.5px] leading-snug text-body">Version numbers, a changelog, and release notes, so apps upgrade on purpose.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
