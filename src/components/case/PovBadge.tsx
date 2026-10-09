"use client";

import { Eye } from "lucide-react";
import { usePov } from "./povStore";

/** The point-of-view badge. Static by default; a prototype can override it through povStore. */
export function PovBadge({ label }: { label: string }) {
  const live = usePov();
  const text = live?.label ?? label;
  const phase = live?.phase;
  const tone = live?.tone ?? "accent";
  const cls =
    tone === "muted"
      ? "border-rule bg-raised text-muted"
      : "border-accent bg-accent-soft text-accent";
  return (
    <span className={`label inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 transition-colors duration-500 ${cls}`}>
      <Eye size={13} aria-hidden="true" />
      <span>POV: {text}</span>
      {phase && (
        <>
          <span aria-hidden="true">·</span>
          <span className="pov-pulse font-bold">{phase}</span>
        </>
      )}
    </span>
  );
}
