"use client";

import { useEffect, useState, type ReactNode } from "react";
import { SlidersHorizontal } from "lucide-react";

/**
 * Toggle Tool: a floating review control, bottom right, for switching between copy or layout
 * variants in place. Shown only when the URL has `?review` (remembered for the session), so
 * visitors never see it. Usage:
 *   <ToggleTool id="rcs-h1" label="Headline" variants={[{name:"Pivot", render:<H1 .../>}, ...]} />
 */
export type ToggleVariant = { name: string; render: ReactNode };

export function ToggleTool({ id, label, variants }: { id: string; label: string; variants: ToggleVariant[] }) {
  const [i, setI] = useState(0);
  const [review, setReview] = useState(false);

  useEffect(() => {
    let on = false;
    try {
      if (new URLSearchParams(window.location.search).has("review")) {
        sessionStorage.setItem("review", "1");
      }
      on = sessionStorage.getItem("review") === "1";
      const saved = Number(sessionStorage.getItem(`toggle:${id}`));
      if (!Number.isNaN(saved) && saved >= 0 && saved < variants.length) {
        const t = setTimeout(() => setI(saved), 0);
        if (on) setTimeout(() => setReview(true), 0);
        return () => clearTimeout(t);
      }
    } catch {}
    if (on) {
      const t = setTimeout(() => setReview(true), 0);
      return () => clearTimeout(t);
    }
  }, [id, variants.length]);

  function choose(n: number) {
    setI(n);
    try {
      sessionStorage.setItem(`toggle:${id}`, String(n));
    } catch {}
  }

  return (
    <>
      {variants[i]?.render}
      {review && (
        <div
          role="group"
          aria-label={`Toggle Tool: ${label}`}
          className="bubble-sm fixed bottom-4 right-4 z-50 flex items-center gap-1 border border-rule bg-surface p-1 shadow-[var(--shadow)]"
        >
          <span className="label inline-flex items-center gap-1 px-2 text-muted">
            <SlidersHorizontal size={12} aria-hidden="true" />
            {label}
          </span>
          {variants.map((v, n) => (
            <button
              key={v.name}
              type="button"
              aria-pressed={n === i}
              onClick={() => choose(n)}
              className={`rounded-md px-2.5 py-1 text-[12px] font-medium transition-colors ${
                n === i ? "bg-ink text-bg" : "text-body hover:bg-raised"
              }`}
            >
              {v.name}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
