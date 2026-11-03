"use client";

import { useEffect, useState } from "react";
import { useBeats } from "./beatsStore";

/**
 * The table of contents for a case page. The sections are found by id (the hero is #prototype, the
 * Summary #summary, the story #full-story); the active one is the last whose top has passed the top
 * of the viewport. `Nav` renders the pills and the slide counter in the sticky site header.
 */
export type Section = { id: string; label: string };

export const CASE_SECTIONS: Section[] = [
  { id: "prototype", label: "Prototype" },
  { id: "summary", label: "Summary" },
  { id: "full-story", label: "Full story" },
];

const OFFSET = 64;

export function jumpToId(id: string) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const el = document.getElementById(id);
  if (id !== CASE_SECTIONS[0].id && !el) return;
  const y = id === CASE_SECTIONS[0].id || !el ? 0 : el.getBoundingClientRect().top + window.scrollY - OFFSET;
  window.scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" });
  history.replaceState(null, "", `#${id}`);
}

export function useActiveSection(sections: Section[] = CASE_SECTIONS): string {
  const [active, setActive] = useState(sections[0]?.id);
  useEffect(() => {
    const pick = () => {
      let best = sections[0]?.id;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= OFFSET + 24) best = s.id;
      }
      setActive(best);
    };
    pick();
    window.addEventListener("scroll", pick, { passive: true });
    window.addEventListener("resize", pick);
    return () => {
      window.removeEventListener("scroll", pick);
      window.removeEventListener("resize", pick);
    };
  }, [sections]);
  return active;
}

export function TocPills({ sections = CASE_SECTIONS, active, size = "md" }: { sections?: Section[]; active: string; size?: "sm" | "md" }) {
  return (
    <ol className="flex min-w-0 items-center gap-1 overflow-x-auto">
      {sections.map((s) => {
        const on = s.id === active;
        return (
          <li key={s.id} className="shrink-0">
            <a
              href={`#${s.id}`}
              aria-current={on ? "location" : undefined}
              onClick={(e) => {
                e.preventDefault();
                jumpToId(s.id);
              }}
              className={`block rounded-full font-medium transition-colors ${size === "sm" ? "px-2.5 py-1 text-[12px]" : "px-3 py-1.5 text-[12.5px]"} ${
                on ? "bg-accent-soft text-accent" : "text-muted hover:bg-raised hover:text-ink"
              }`}
            >
              {s.label}
            </a>
          </li>
        );
      })}
    </ol>
  );
}

/** "3 / 10", optionally with the slide dots; renders nothing outside the story */
export function SlideProgress({ active, dots = false }: { active: string; dots?: boolean }) {
  const beats = useBeats();
  if (active !== "full-story" || !beats || beats.titles.length === 0) return null;
  return (
    <div className="flex min-w-0 items-center gap-3">
      {dots && (
        <ol className="flex items-center gap-1.5" aria-label="Slides">
          {beats.titles.map((t, i) => (
            <li key={t.id} className="flex">
              <a
                href={`#${t.id}`}
                title={t.title}
                aria-current={i === beats.current ? "step" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  jumpToId(t.id);
                }}
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  i === beats.current ? "w-6 bg-accent" : i < beats.current ? "w-1.5 bg-accent/50" : "w-1.5 bg-rule"
                }`}
              >
                <span className="sr-only">
                  Slide {i + 1}: {t.title}
                </span>
              </a>
            </li>
          ))}
        </ol>
      )}
      <span className="label num shrink-0 text-muted">
        {beats.current + 1}
        <span className="mx-1 opacity-60">/</span>
        {beats.titles.length}
      </span>
    </div>
  );
}
