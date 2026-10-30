"use client";

import { useEffect, useState } from "react";
import { useBeats } from "./beatsStore";

/**
 * The sticky table of contents for a case page: one slim bar with the page's sections as pills, and,
 * while the reader is inside the full story, the slide counter and dots on the right. Place it right
 * after the hero so it appears as the Summary comes up and sticks from there on. Sections are found by
 * id; the active one is the last whose top has passed the bar.
 */
export type Section = { id: string; label: string };

export const CASE_SECTIONS: Section[] = [
  { id: "overview", label: "Overview" },
  { id: "summary", label: "Summary" },
  { id: "full-story", label: "The full story" },
];

const BAR = 48;

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const y = el.getBoundingClientRect().top + window.scrollY - (id === "overview" ? 0 : BAR + 8);
  window.scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" });
}

export function CaseNav({ sections = CASE_SECTIONS }: { sections?: Section[] }) {
  const [active, setActive] = useState(sections[0]?.id);
  const beats = useBeats();

  useEffect(() => {
    const pick = () => {
      let best = sections[0]?.id;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= BAR + 24) best = s.id;
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

  const inStory = active === "full-story" && beats && beats.titles.length > 0;

  return (
    <nav aria-label="On this page" className="sticky top-0 z-30 -mx-4 border-b border-rule bg-bg/85 px-4 backdrop-blur sm:-mx-6 sm:px-6">
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between gap-3">
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
                    scrollTo(s.id);
                    history.replaceState(null, "", `#${s.id}`);
                  }}
                  className={`block rounded-full px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
                    on ? "bg-accent-soft text-accent" : "text-muted hover:bg-raised hover:text-ink"
                  }`}
                >
                  {s.label}
                </a>
              </li>
            );
          })}
        </ol>
        {inStory && (
          <div className="flex min-w-0 items-center gap-3">
            <ol className="hidden items-center gap-1.5 sm:flex xl:hidden" aria-label="Slides">
              {beats.titles.map((t, i) => (
                <li key={t.id} className="flex">
                  <a
                    href={`#${t.id}`}
                    title={t.title}
                    aria-current={i === beats.current ? "step" : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(t.id);
                      history.replaceState(null, "", `#${t.id}`);
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
            <span className="label num shrink-0 text-muted">
              {beats.current + 1}
              <span className="mx-1 opacity-60">/</span>
              {beats.titles.length}
            </span>
            <span className="label hidden max-w-[22ch] truncate text-ink md:block">{beats.titles[beats.current]?.title}</span>
          </div>
        )}
      </div>
    </nav>
  );
}
