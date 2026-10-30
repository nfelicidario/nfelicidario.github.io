"use client";

import { useEffect, useState } from "react";
import { ChevronUp, List, SlidersHorizontal } from "lucide-react";
import { useBeats } from "./beatsStore";
import { TOC_VARIANTS, setTocVariant, useTocVariant } from "./tocStore";

/**
 * The table of contents for a case page. The sections are found by id (the hero is #overview, the
 * Summary #summary, the story #full-story); the active one is the last whose top has passed the top
 * of the viewport. `Nav` renders the pills in the site header for the default "navbar" treatment;
 * `CaseNav`, placed right after the hero, renders the alternatives and the review toggle.
 */
export type Section = { id: string; label: string };

export const CASE_SECTIONS: Section[] = [
  { id: "overview", label: "Overview" },
  { id: "summary", label: "Summary" },
  { id: "full-story", label: "The full story" },
];

const OFFSET = 64;

export function jumpToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const y = id === "overview" ? 0 : el.getBoundingClientRect().top + window.scrollY - OFFSET;
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

/** "3 / 10", optionally with the slide dots and the slide name; renders nothing outside the story */
export function SlideProgress({ active, dots = false, name = false }: { active: string; dots?: boolean; name?: boolean }) {
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
      {name && <span className="label max-w-[22ch] truncate text-ink">{beats.titles[beats.current]?.title}</span>}
    </div>
  );
}

/* ------------------------------------------------------- the alternatives */

function StickyBar({ active }: { active: string }) {
  return (
    <nav aria-label="On this page" className="sticky top-0 z-30 -mx-4 border-b border-rule bg-bg/85 px-4 backdrop-blur sm:-mx-6 sm:px-6">
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between gap-3">
        <TocPills active={active} />
        <div className="hidden sm:block">
          <SlideProgress active={active} dots name />
        </div>
        <div className="sm:hidden">
          <SlideProgress active={active} />
        </div>
      </div>
    </nav>
  );
}

function Rail({ active }: { active: string }) {
  const beats = useBeats();
  return (
    <nav
      aria-label="On this page"
      className="fixed top-1/2 z-30 hidden w-40 -translate-y-1/2 xl:block"
      style={{ left: "max(16px, calc((100vw - 72rem) / 2 - 176px))" }}
    >
      <ol className="grid gap-1">
        {CASE_SECTIONS.map((s) => {
          const on = s.id === active;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  jumpToId(s.id);
                }}
                className={`flex items-center gap-2 py-1 text-[13px] transition-colors ${on ? "font-semibold text-ink" : "text-muted hover:text-ink"}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${on ? "bg-accent" : "bg-rule"}`} aria-hidden="true" />
                {s.label}
              </a>
              {s.id === "full-story" && beats && beats.titles.length > 0 && (
                <ol className="ml-[3px] mt-1 grid gap-0.5 border-l border-rule pl-3">
                  {beats.titles.map((t, i) => (
                    <li key={t.id}>
                      <a
                        href={`#${t.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          jumpToId(t.id);
                        }}
                        className={`block truncate py-0.5 text-[12px] transition-colors ${
                          on && i === beats.current ? "font-semibold text-accent" : "text-muted hover:text-ink"
                        }`}
                      >
                        <span className="num mr-1.5 opacity-70">{i + 1}</span>
                        {t.title}
                      </a>
                    </li>
                  ))}
                </ol>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function JumpTo({ active }: { active: string }) {
  const [open, setOpen] = useState(false);
  const beats = useBeats();
  const label = CASE_SECTIONS.find((s) => s.id === active)?.label ?? "Contents";
  return (
    <div className="fixed bottom-4 left-4 z-40">
      {open && (
        <div className="bubble-sm mb-2 w-64 border border-rule bg-surface p-2 shadow-[var(--shadow)]">
          <div className="label px-2 pt-1 pb-1.5 text-muted">On this page</div>
          <ol className="grid gap-0.5">
            {CASE_SECTIONS.map((s) => {
              const on = s.id === active;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => {
                      jumpToId(s.id);
                      setOpen(false);
                    }}
                    className={`block w-full rounded-md px-2 py-1.5 text-left text-[13.5px] ${on ? "bg-accent-soft font-semibold text-accent" : "text-body hover:bg-raised"}`}
                  >
                    {s.label}
                  </button>
                  {s.id === "full-story" && beats && beats.titles.length > 0 && (
                    <ol className="ml-3 grid gap-0.5 border-l border-rule pl-2">
                      {beats.titles.map((t, i) => (
                        <li key={t.id}>
                          <button
                            type="button"
                            onClick={() => {
                              jumpToId(t.id);
                              setOpen(false);
                            }}
                            className={`block w-full truncate rounded-md px-2 py-1 text-left text-[12.5px] ${
                              on && i === beats.current ? "font-semibold text-accent" : "text-muted hover:bg-raised hover:text-ink"
                            }`}
                          >
                            <span className="num mr-1.5 opacity-70">{i + 1}</span>
                            {t.title}
                          </button>
                        </li>
                      ))}
                    </ol>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      )}
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="bubble-sm inline-flex items-center gap-2 border border-rule bg-surface px-3 py-2 text-[13px] font-medium text-ink shadow-[var(--shadow)] transition-colors hover:border-accent"
      >
        <List size={14} aria-hidden="true" />
        {label}
        {active === "full-story" && beats && (
          <span className="num text-muted">
            {beats.current + 1}/{beats.titles.length}
          </span>
        )}
        <ChevronUp size={14} aria-hidden="true" className={`text-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
    </div>
  );
}

function Strip({ active }: { active: string }) {
  return (
    <nav aria-label="On this page" className="mx-auto mt-6 flex max-w-6xl flex-wrap items-center gap-3 border-y border-rule py-2.5">
      <span className="label text-muted">On this page</span>
      <TocPills active={active} />
    </nav>
  );
}

/** the review toggle, bottom right, shown only with ?review (remembered for the session) */
function TocToggle() {
  const variant = useTocVariant();
  const [review, setReview] = useState(false);
  useEffect(() => {
    try {
      if (new URLSearchParams(window.location.search).has("review")) sessionStorage.setItem("review", "1");
      if (sessionStorage.getItem("review") === "1") {
        const t = setTimeout(() => setReview(true), 0);
        return () => clearTimeout(t);
      }
    } catch {}
  }, []);
  if (!review) return null;
  const current = TOC_VARIANTS.find((t) => t.id === variant);
  return (
    <div className="bubble-sm fixed bottom-4 right-4 z-50 grid gap-1 border border-rule bg-surface p-1 shadow-[var(--shadow)]">
      <div role="group" aria-label="Table of contents style" className="flex items-center gap-1">
        <span className="label inline-flex items-center gap-1 px-2 text-muted">
          <SlidersHorizontal size={12} aria-hidden="true" />
          Contents
        </span>
        {TOC_VARIANTS.map((t) => (
          <button
            key={t.id}
            type="button"
            aria-pressed={t.id === variant}
            onClick={() => setTocVariant(t.id)}
            className={`rounded-md px-2.5 py-1 text-[12px] font-medium transition-colors ${t.id === variant ? "bg-ink text-bg" : "text-body hover:bg-raised"}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {current && <div className="px-2 pb-1 text-[11.5px] text-muted">{current.blurb}</div>}
    </div>
  );
}

export function CaseNav() {
  const variant = useTocVariant();
  const active = useActiveSection();
  return (
    <>
      {variant === "bar" && <StickyBar active={active} />}
      {variant === "rail" && (
        <>
          <Rail active={active} />
          <div className="xl:hidden">
            <StickyBar active={active} />
          </div>
        </>
      )}
      {variant === "jump" && <JumpTo active={active} />}
      {variant === "strip" && <Strip active={active} />}
      <TocToggle />
    </>
  );
}
