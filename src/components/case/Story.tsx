"use client";

import Link from "next/link";
import type React from "react";
import {
  Children,
  createContext,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ChevronDown, Keyboard } from "lucide-react";
import { Stats, type Stat } from "./CaseLayout";

/**
 * The slide-like story format. A `SixtySeconds` strip gives the whole arc (problem, the call,
 * the result, the numbers, three takeaways) right under the hero, then `Beats` lists numbered
 * `StoryBeat`s: one idea, one big visual, two or three lines, and a "Go deeper" disclosure that
 * holds the long version. The visual is sticky on desktop and stacks above the text on mobile. A
 * sticky rail across the top of the beats shows where the reader is, with anchor links to every
 * beat; the left and right arrow keys jump between beats (never while typing, and never inside
 * the hero prototype). The page always scrolls normally; nothing here captures the wheel.
 */

/* ------------------------------------------------------------ 60 seconds */

export type SixtySecondsProps = {
  problem: ReactNode;
  /** what Nolan did about it */
  work: ReactNode;
  /** label for the middle cell */
  workLabel?: string;
  result: ReactNode;
  stats?: Stat[];
  takeaways?: ReactNode[];
  takeawaysLabel?: string;
};

export function SixtySeconds({ problem, work, workLabel = "What I did", result, stats, takeaways, takeawaysLabel = "If you remember three things" }: SixtySecondsProps) {
  const cells = [
    { k: "The problem", v: problem },
    { k: workLabel, v: work },
    { k: "The result", v: result },
  ];
  return (
    <section className="mx-auto max-w-6xl pb-6" aria-label="The whole story in sixty seconds">
      <div className="bubble border border-rule bg-surface p-5 md:p-6">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 className="text-[20px] font-bold text-ink">The whole story in 60 seconds</h2>
          <span className="text-[13px] text-muted">The beats below tell it properly.</span>
        </div>
        <ol className="grid gap-4 md:grid-cols-3">
          {cells.map((c, i) => (
            <li key={c.k} className="bubble-sm border border-rule bg-bg px-4 py-3.5">
              <div className="label mb-1.5 flex items-center gap-2 text-accent">
                <span className="num">{i + 1}</span>
                {c.k}
              </div>
              <p className="text-[14.5px] leading-snug text-body">{c.v}</p>
            </li>
          ))}
        </ol>
        {stats && <div className="mt-4"><Stats items={stats} /></div>}
        {takeaways && (
        <div className="mt-5 border-t border-rule pt-4">
          <div className="label mb-2">{takeawaysLabel}</div>
          <ul className="grid gap-2 text-[14.5px] text-body md:grid-cols-3 md:gap-4">
            {takeaways.map((t, i) => (
              <li key={i} className="flex gap-2.5">
                <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
        )}
      </div>
    </section>
  );
}

/** a three-point mini timeline for a stat card: start, beta, general availability */
export function Span({ points }: { points: { at: string; what: string }[] }) {
  return (
    <div className="pt-1">
      <div className="relative mx-1 h-[3px] rounded-full bg-rule">
        {points.map((pt, i) => (
          <span
            key={pt.at}
            aria-hidden="true"
            className={`absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface ${i === points.length - 1 ? "bg-accent" : "bg-ink"}`}
            style={{ left: `${(i / (points.length - 1)) * 100}%` }}
          />
        ))}
      </div>
      <ol className="mt-2 grid text-[11.5px] leading-tight" style={{ gridTemplateColumns: `repeat(${points.length}, minmax(0, 1fr))` }}>
        {points.map((pt, i) => (
          <li
            key={pt.at}
            className={`${i === 0 ? "text-left" : i === points.length - 1 ? "text-right" : "text-center"}`}
          >
            <span className="num block font-semibold text-ink">{pt.at}</span>
            <span className="text-muted">{pt.what}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ----------------------------------------------------------------- beats */

type BeatInfo = { id: string; title: string };
const BeatsContext = createContext<Record<string, number>>({});

export function Beats({ children, label = "The story" }: { children: ReactNode; label?: string }) {
  const titles = useMemo(() => collectBeats(children), [children]);
  const [current, setCurrent] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const ctx = useMemo(() => Object.fromEntries(titles.map((t, i) => [t.id, i])), [titles]);

  // Track the beat nearest the top of the viewport.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const sections = Array.from(root.querySelectorAll<HTMLElement>("[data-beat]"));
    if (sections.length === 0) return;
    const pick = () => {
      const line = window.innerHeight * 0.35;
      let best = 0;
      sections.forEach((s, i) => {
        if (s.getBoundingClientRect().top <= line) best = i;
      });
      setCurrent(best);
    };
    pick();
    window.addEventListener("scroll", pick, { passive: true });
    window.addEventListener("resize", pick);
    return () => {
      window.removeEventListener("scroll", pick);
      window.removeEventListener("resize", pick);
    };
  }, [titles.length]);

  // Arrow keys jump beats, but only when nothing else wants the keys.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const fwd = e.key === "ArrowRight" || e.key === "ArrowDown";
      const back = e.key === "ArrowLeft" || e.key === "ArrowUp";
      if (!fwd && !back) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target instanceof HTMLElement ? e.target : null;
      if (t && (t.closest("input, textarea, select, [contenteditable], figure[aria-labelledby]") || t.isContentEditable)) return;
      const root = rootRef.current;
      if (!root) return;
      const r = root.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return; // only while the story is on screen
      const sections = Array.from(root.querySelectorAll<HTMLElement>("[data-beat]"));
      const next = fwd ? Math.min(current + 1, sections.length - 1) : Math.max(current - 1, 0);
      if (next === current) return;
      e.preventDefault();
      jumpTo(sections[next]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current]);

  const go = (t: BeatInfo) => (e: React.MouseEvent) => {
    const el = document.getElementById(t.id);
    if (!el) return;
    e.preventDefault();
    jumpTo(el);
    history.replaceState(null, "", `#${t.id}`);
  };

  return (
    <BeatsContext.Provider value={ctx}>
      <div ref={rootRef} className="relative mx-auto max-w-6xl lg:pl-20">
        {/* side rail, large screens */}
        <div className="absolute inset-y-0 left-0 hidden w-12 lg:block" aria-hidden={false}>
          <nav
            aria-label={`${label} progress`}
            className="group sticky top-[28vh] flex w-12 flex-col items-center gap-3"
          >
            <span className="label num text-muted">
              {current + 1}
              <span className="mx-0.5 opacity-60">/</span>
              {titles.length}
            </span>
            <ol className="flex flex-col items-center gap-2" aria-label="Beats">
              {titles.map((t, i) => (
                <li key={t.id} className="relative flex">
                  <a
                    href={`#${t.id}`}
                    aria-current={i === current ? "step" : undefined}
                    onClick={go(t)}
                    className={`peer block w-1.5 rounded-full transition-all duration-300 ${
                      i === current ? "h-6 bg-accent" : i < current ? "h-1.5 bg-accent/50 hover:bg-accent" : "h-1.5 bg-rule hover:bg-muted"
                    }`}
                  >
                    <span className="sr-only">
                      Beat {i + 1}: {t.title}
                    </span>
                  </a>
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md border border-rule bg-surface px-2 py-0.5 text-[12px] opacity-0 shadow-[var(--shadow)] transition-opacity peer-hover:opacity-100 ${
                      i === current ? "font-semibold text-ink" : "text-body"
                    }`}
                  >
                    {t.title}
                  </span>
                </li>
              ))}
            </ol>
            <span
              className="mt-1 flex flex-col items-center gap-1 text-muted"
              title="Arrow keys move between beats"
            >
              <Keyboard size={14} aria-hidden="true" />
              <span className="label whitespace-nowrap text-[10px] opacity-0 transition-opacity group-hover:opacity-100">
                ↑ ↓ keys
              </span>
            </span>
          </nav>
        </div>

        {/* compact top rail, small screens */}
        <nav
          aria-label={`${label} progress`}
          className="sticky top-0 z-20 -mx-1 border-b border-rule bg-bg/85 px-1 py-2.5 backdrop-blur lg:hidden"
        >
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
            <span className="label num text-muted">
              {current + 1}
              <span className="mx-1 opacity-60">/</span>
              {titles.length}
            </span>
            <ol className="flex items-center gap-1.5" aria-label="Beats">
              {titles.map((t, i) => (
                <li key={t.id} className="flex">
                  <a
                    href={`#${t.id}`}
                    title={t.title}
                    aria-current={i === current ? "step" : undefined}
                    onClick={go(t)}
                    className={`block h-1.5 rounded-full transition-all duration-300 ${
                      i === current ? "w-6 bg-accent" : i < current ? "w-1.5 bg-accent/50" : "w-1.5 bg-rule"
                    }`}
                  >
                    <span className="sr-only">
                      Beat {i + 1}: {t.title}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
            <span className="label truncate text-ink">{titles[current]?.title}</span>
          </div>
        </nav>
        {children}
      </div>
    </BeatsContext.Provider>
  );
}

function jumpTo(el: HTMLElement) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const y = el.getBoundingClientRect().top + window.scrollY - 48;
  window.scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" });
}

function collectBeats(children: ReactNode): BeatInfo[] {
  const out: BeatInfo[] = [];
  Children.forEach(children, (c) => {
    if (c && typeof c === "object" && "props" in c) {
      const p = (c as { props: { id?: string; title?: string } }).props;
      if (p?.id && p?.title) out.push({ id: p.id, title: p.title });
    }
  });
  return out;
}

/* ------------------------------------------------------------- one beat */

export function StoryBeat({
  id,
  title,
  children,
  visual,
  deeper,
}: {
  /** anchor id, e.g. "the-bet" */
  id: string;
  title: string;
  /** two or three lines; one idea */
  children: ReactNode;
  /** the one big visual for this beat */
  visual: ReactNode;
  /** the long version, shown behind "Go deeper" */
  deeper?: ReactNode;
}) {
  const n = (useContext(BeatsContext)[id] ?? 0) + 1;
  return (
    <section
      id={id}
      data-beat
      className="scroll-mt-14 border-t border-rule py-12 md:py-16 first-of-type:border-t-0"
      aria-labelledby={`${id}-title`}
    >
      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-start">
        <div className="order-2 md:order-1">
          <div className="label mb-3 flex items-center gap-2 text-accent">
            <span className="num">{String(n).padStart(2, "0")}</span>
          </div>
          <h2 id={`${id}-title`} className="text-[26px] font-bold text-ink md:text-[30px]">
            {title}
          </h2>
          <div className="mt-4 grid max-w-[46ch] gap-3 text-[16px] leading-relaxed [&>p]:text-body">{children}</div>
          {deeper && <GoDeeper>{deeper}</GoDeeper>}
        </div>
        <div className="order-1 min-w-0 md:order-2 md:sticky md:top-16">{visual}</div>
      </div>
    </section>
  );
}

function GoDeeper({ children }: { children: ReactNode }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-5">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="label inline-flex items-center gap-1.5 rounded-full border border-rule bg-surface px-3 py-1.5 text-ink transition-colors hover:border-accent hover:text-accent"
      >
        {open ? "Less" : "Go deeper"}
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      <div id={id} hidden={!open} className="mt-4 grid max-w-[52ch] gap-3 border-l-2 border-rule pl-4 text-[15px] [&>p]:text-body">
        {children}
      </div>
    </div>
  );
}

/** an inline link styled for story prose */
export function StoryLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="text-body underline decoration-rule underline-offset-2 transition-colors hover:text-accent hover:decoration-accent"
    >
      {children}
    </Link>
  );
}
