"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Images, MousePointerClick, Play, Film } from "lucide-react";

/**
 * The case-study hero. Four fidelity tiers of the same story, highest first:
 *  1. interactive  — the real prototype the viewer can operate
 *  2. autoplay     — the same prototype driving itself (an "animation")
 *  3. gif          — a recorded loop for low-power or narrow screens (optional until recorded)
 *  4. stills       — 3–5 static frames of the key moments, in a carousel; the ultimate fallback
 *
 * Default tier: interactive on pointer devices; stills when the viewer prefers reduced motion;
 * gif (or stills) under 640px. A quiet control in the corner lets the viewer switch.
 */
export type Still = { render: ReactNode; caption: string };

export type HeroStageProps = {
  label: string;
  interactive: ReactNode;
  autoplay?: ReactNode;
  gif?: { src: string; alt: string };
  stills: Still[];
  /** aspect ratio of the stage, e.g. "16 / 9" */
  aspect?: string;
};

type Mode = "interactive" | "autoplay" | "gif" | "stills";

export function HeroStage({ label, interactive, autoplay, gif, stills, aspect = "16 / 9" }: HeroStageProps) {
  const [mode, setMode] = useState<Mode>("interactive");
  const [frame, setFrame] = useState(0);
  const id = useId();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrow = window.matchMedia("(max-width: 640px)").matches;
    let next: Mode = "interactive";
    if (narrow) next = gif ? "gif" : "stills";
    if (reduced) next = "stills";
    const t = setTimeout(() => setMode(next), 0);
    return () => clearTimeout(t);
  }, [gif]);

  const tiers: { key: Mode; icon: ReactNode; title: string; available: boolean }[] = [
    { key: "interactive", icon: <MousePointerClick size={14} />, title: "Interactive", available: true },
    { key: "autoplay", icon: <Play size={14} />, title: "Animation", available: !!autoplay },
    { key: "gif", icon: <Film size={14} />, title: "GIF", available: !!gif },
    { key: "stills", icon: <Images size={14} />, title: "Stills", available: stills.length > 0 },
  ];

  const still = stills[Math.min(frame, stills.length - 1)];

  return (
    <figure className="bubble relative overflow-hidden border border-rule bg-surface" aria-labelledby={id}>
      <div className="relative w-full" style={{ aspectRatio: aspect }}>
        {mode === "interactive" && <div className="absolute inset-0">{interactive}</div>}
        {mode === "autoplay" && <div className="absolute inset-0">{autoplay ?? interactive}</div>}
        {mode === "gif" && gif && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={gif.src} alt={gif.alt} className="absolute inset-0 h-full w-full object-cover" />
        )}
        {mode === "stills" && still && (
          <div className="absolute inset-0 grid grid-rows-[1fr_auto]">
            <div className="relative min-h-0">{still.render}</div>
            <div className="flex items-center justify-between gap-3 border-t border-rule bg-surface px-4 py-2 text-[13px] text-body">
              <button
                type="button"
                aria-label="Previous frame"
                onClick={() => setFrame((f) => (f - 1 + stills.length) % stills.length)}
                className="rounded-full p-1 text-muted hover:bg-raised hover:text-ink"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="min-w-0 flex-1 text-center">
                <span className="label mr-2">
                  {frame + 1}/{stills.length}
                </span>
                {still.caption}
              </span>
              <button
                type="button"
                aria-label="Next frame"
                onClick={() => setFrame((f) => (f + 1) % stills.length)}
                className="rounded-full p-1 text-muted hover:bg-raised hover:text-ink"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <figcaption
        id={id}
        className="flex items-center justify-between gap-3 border-t border-rule px-4 py-2"
      >
        <span className="label">{label}</span>
        <span role="group" aria-label="Fidelity" className="flex items-center gap-0.5">
          {tiers
            .filter((t) => t.available)
            .map((t) => (
              <button
                key={t.key}
                type="button"
                title={t.title}
                aria-pressed={mode === t.key}
                onClick={() => setMode(t.key)}
                className={`rounded-full p-1.5 transition-colors ${
                  mode === t.key ? "bg-raised text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {t.icon}
                <span className="sr-only">{t.title}</span>
              </button>
            ))}
        </span>
      </figcaption>
    </figure>
  );
}
