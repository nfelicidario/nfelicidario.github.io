"use client";

import { createContext, useCallback, useContext, useEffect, useId, useMemo, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Images, MousePointerClick, Play, Film, Video } from "lucide-react";

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

/** What a prototype publishes to the stage footer: its steps, the current one, and its actions. */
export type HeroFooterState = {
  steps?: string[];
  current?: number;
  /** jump to a step; when present and the tier is interactive, the footer shows step arrows */
  onStep?: (index: number) => void;
  actions?: { label: string; icon?: ReactNode; onClick: () => void; hidden?: boolean }[];
};
const HeroFooterContext = createContext<{ set: (s: HeroFooterState | null) => void } | null>(null);

/** Prototypes call this to drive the footer. No-op outside a HeroStage. */
export function useHeroFooter() {
  const ctx = useContext(HeroFooterContext);
  return useMemo(() => ({ set: ctx?.set ?? (() => {}) }), [ctx]);
}

export type HeroStageProps = {
  label: string;
  interactive: ReactNode;
  autoplay?: ReactNode;
  gif?: { src: string; alt: string };
  /** a recorded video of the animation tier, with a cursor; optional until recorded */
  video?: { src: string; poster?: string };
  stills: Still[];
  /** aspect ratio of the stage, e.g. "16 / 9" */
  aspect?: string;
  frame?: boolean;
};

type Mode = "interactive" | "autoplay" | "video" | "gif" | "stills";

export function HeroStage({
  label,
  interactive,
  autoplay,
  gif,
  video,
  stills,
  aspect = "16 / 9",
  frame = true,
}: HeroStageProps) {
  const [mode, setMode] = useState<Mode>("interactive");
  const [frameIdx, setFrameIdx] = useState(0);
  const [footer, setFooter] = useState<HeroFooterState | null>(null);
  const setFooterStable = useCallback((f: HeroFooterState | null) => setFooter(f), []);
  const ctx = useMemo(() => ({ set: setFooterStable }), [setFooterStable]);
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
    { key: "video", icon: <Video size={14} />, title: video ? "Video" : "Video, not recorded yet", available: !!video },
    { key: "gif", icon: <Film size={14} />, title: "GIF", available: !!gif },
    { key: "stills", icon: <Images size={14} />, title: "Stills", available: stills.length > 0 },
  ];

  const still = stills[Math.min(frameIdx, stills.length - 1)];
  const card = "bubble overflow-hidden border border-rule bg-surface";

  const showProtoFooter = (mode === "interactive" || mode === "autoplay") && footer;

  return (
    <HeroFooterContext.Provider value={ctx}>
    <figure className="relative" aria-labelledby={id}>
      <div className={`relative w-full ${frame ? card : ""}`} style={{ aspectRatio: aspect }}>
        {mode === "interactive" && <div className="absolute inset-0">{interactive}</div>}
        {mode === "autoplay" && <div className="absolute inset-0">{autoplay ?? interactive}</div>}
        {mode === "video" && video && (
          <div className={`absolute inset-0 ${frame ? "" : card}`}>
            <video src={video.src} poster={video.poster} className="h-full w-full object-cover" autoPlay muted loop playsInline />
          </div>
        )}
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
        className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-1 pt-3"
      >
        <span className="sr-only">{label}</span>
        <span className="flex items-center gap-1">
          {showProtoFooter &&
            footer.actions
              ?.filter((a) => !a.hidden)
              .map((a) => (
                <button
                  key={a.label}
                  type="button"
                  onClick={a.onClick}
                  className="label inline-flex items-center gap-1 rounded-full px-2 py-1 transition-colors hover:bg-raised hover:text-ink"
                >
                  {a.icon}
                  {a.label}
                </button>
              ))}
        </span>
        <span className="flex flex-col items-center justify-center gap-1.5">
          {showProtoFooter && footer.steps && (
            <>
              <span className="flex items-center gap-2" aria-label={`Step ${(footer.current ?? 0) + 1} of ${footer.steps.length}`}>
                {mode === "interactive" && footer.onStep && (
                  <button
                    type="button"
                    aria-label="Previous step"
                    disabled={(footer.current ?? 0) <= 0}
                    onClick={() => footer.onStep?.((footer.current ?? 0) - 1)}
                    className="rounded-full p-1 text-muted transition-colors hover:bg-raised hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronLeft size={14} />
                  </button>
                )}
                <span className="flex items-center gap-1.5" aria-hidden="true">
                  {footer.steps.map((name, i) => (
                    <span
                      key={name}
                      title={name}
                      className={`block h-1.5 rounded-full transition-all duration-300 ${
                        i === footer.current ? "w-4 bg-accent" : "w-1.5 bg-rule"
                      }`}
                    />
                  ))}
                </span>
                {mode === "interactive" && footer.onStep && (
                  <button
                    type="button"
                    aria-label="Next step"
                    disabled={(footer.current ?? 0) >= footer.steps.length - 1}
                    onClick={() => footer.onStep?.((footer.current ?? 0) + 1)}
                    className="rounded-full p-1 text-muted transition-colors hover:bg-raised hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronRight size={14} />
                  </button>
                )}
              </span>
              <span className="label text-ink">{footer.steps[footer.current ?? 0]}</span>
            </>
          )}
        </span>
        <span className="flex items-center gap-1">
          {showProtoFooter &&
            footer.actions
              ?.filter((a) => !a.hidden)
              .map((a) => (
                <button
                  key={a.label}
                  type="button"
                  onClick={a.onClick}
                  className="label inline-flex items-center gap-1 rounded-full px-2 py-1 transition-colors hover:bg-raised hover:text-ink"
                >
                  {a.icon}
                  {a.label}
                </button>
              ))}
        </span>
        <span className="flex items-center justify-center gap-3">
          {showProtoFooter && footer.steps && (
            <span className="flex items-center gap-2" aria-label={`Step ${(footer.current ?? 0) + 1} of ${footer.steps.length}`}>
              <span className="flex items-center gap-1.5" aria-hidden="true">
                {footer.steps.map((name, i) => (
                  <span
                    key={name}
                    title={name}
                    className={`block h-1.5 rounded-full transition-all duration-300 ${
                      i === footer.current ? "w-4 bg-accent" : "w-1.5 bg-rule"
                    }`}
                  />
                ))}
              </span>
              <span className="label text-ink">{footer.steps[footer.current ?? 0]}</span>
            </span>
          )}
        </span>
        <span role="group" aria-label="Fidelity" className="flex items-center justify-end gap-0.5">
          {tiers
            .filter((t) => t.available || t.key === "video")
            .map((t) => (
              <button
                key={t.key}
                type="button"
                title={t.title}
                aria-pressed={mode === t.key}
                disabled={!t.available}
                onClick={() => setMode(t.key)}
                className={`rounded-full p-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
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
    </HeroFooterContext.Provider>
  );
}
