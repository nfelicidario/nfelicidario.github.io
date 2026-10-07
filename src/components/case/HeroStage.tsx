"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Images, MousePointerClick, Play, Film } from "lucide-react";

/**
 * The case-study hero. Four fidelity tiers of the same story, highest first:
 *  1. interactive  — the real prototype the viewer can operate
 *  2. autoplay     — the same prototype driving itself (an "animation")
 *  3. gif          — a recorded loop for low-power or narrow screens
 *  4. stills       — 3–5 static frames of the key moments, in a carousel; the ultimate fallback
 *
 * Default tier: interactive on pointer devices; stills when the viewer prefers reduced motion;
 * gif (or stills) under 640px. A quiet control under the stage lets the viewer switch.
 *
 * `frame`: true wraps the stage in a card. false renders the prototype on the page ground so the
 * prototype draws its own cards per phase; the label and tier control then float below it.
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
  frame?: boolean;
};

type Mode = "interactive" | "autoplay" | "gif" | "stills";

export function HeroStage({
  label,
  interactive,
  autoplay,
  gif,
  stills,
  aspect = "16 / 9",
  frame = true,
}: HeroStageProps) {
  const [mode, setMode] = useState<Mode>("interactive");
  const [frameIdx, setFrameIdx] = useState(0);
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

  const still = stills[Math.min(frameIdx, stills.length - 1)];
  const card = "bubble overflow-hidden border border-rule bg-surface";

  return (
    <figure className="relative" aria-labelledby={id}>
      <div className={`relative w-full ${frame ? card : ""}`} style={{ aspectRatio: aspect }}>
        {mode === "interactive" && <div className="absolute inset-0">{interactive}</div>}
        {mode === "autoplay" && <div className="absolute inset-0">{autoplay ?? interactive}</div>}
        {mode === "gif" && gif && (
          <div className={`absolute inset-0 ${frame ? "" : card}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={gif.src} alt={gif.alt} className="h-full w-full object-cover" />
          </div>
        )}
        {mode === "stills" && still && (
          <div className={`absolute inset-0 grid grid-rows-[1fr_auto] ${frame ? "" : card}`}>
            <div className="relative min-h-0">{still.render}</div>
            <div className="flex items-center justify-between gap-3 border-t border-rule bg-surface px-4 py-2 text-[13px] text-body">
              <button
                type="button"
                aria-label="Previous frame"
                onClick={() => setFrameIdx((f) => (f - 1 + stills.length) % stills.length)}
                className="rounded-full p-1 text-muted hover:bg-raised hover:text-ink"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="min-w-0 flex-1 text-center">
                <span className="label mr-2">
                  {frameIdx + 1}/{stills.length}
                </span>
                {still.caption}
              </span>
              <button
                type="button"
                aria-label="Next frame"
                onClick={() => setFrameIdx((f) => (f + 1) % stills.length)}
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
        className={`flex items-center justify-between gap-3 px-1 pt-2.5 ${frame ? "" : ""}`}
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
