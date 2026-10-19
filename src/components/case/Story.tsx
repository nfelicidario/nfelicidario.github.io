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
import { ChevronDown, CircleAlert, Hammer, Keyboard, Trophy } from "lucide-react";
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

export type Term = { icon: ReactNode; title: string; text: ReactNode };
/** a bullet, optionally with sub-bullets */
export type Point = ReactNode | { text: ReactNode; sub: ReactNode[] };

export type SixtySecondsProps = {
  /** one line on what the product is, set large */
  lede?: ReactNode;
  /** the two or three terms a reader needs, as tiles */
  terms?: Term[];
  problem: Point[];
  work: Point[];
  workLabel?: string;
  result: Point[];
  stats?: Stat[];
  takeaways?: (ReactNode | { lead: string; text: ReactNode })[];
  takeawaysLabel?: string;
  /** centred heading above the card */
  heading?: string;
};

export function SixtySeconds({
  lede,
  terms,
  problem,
  work,
  workLabel = "The work",
  result,
  stats,
  takeaways,
  takeawaysLabel = "If you remember three things",
  heading = "Summary",
}: SixtySecondsProps) {
  const cells = [
    { k: "The problem", icon: <CircleAlert size={15} />, items: problem },
    { k: workLabel, icon: <Hammer size={15} />, items: work },
    { k: "The result", icon: <Trophy size={15} />, items: result },
  ];
  return (
    <section className="mx-auto max-w-6xl pt-14 pb-6 md:pt-16" aria-label={heading}>
      <h2 className="text-center text-[clamp(26px,3vw,34px)] font-bold tracking-[-0.02em] text-ink">{heading}</h2>
      <div className="bubble mt-8 border border-rule bg-surface p-5 md:p-7">

        {(lede || terms) && (
          <div className="mt-6 grid gap-5">
            {lede && (
              <p className="mx-auto max-w-[36ch] text-center font-display text-[clamp(20px,2vw,25px)] font-semibold leading-[1.3] tracking-[-0.01em] text-ink">
                {lede}
              </p>
            )}
            {terms && (
              <dl className="mx-auto grid w-full max-w-3xl gap-3 sm:grid-cols-2">
                {terms.map((t) => (
                  <div key={t.title} className="bubble-sm border border-rule bg-bg p-4">
                    <dt className="label flex items-center gap-2 text-ink">
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-accent-soft text-accent" aria-hidden="true">
                        {t.icon}
                      </span>
                      {t.title}
                    </dt>
                    <dd className="mt-2 text-[13.5px] leading-snug text-body">{t.text}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        )}

        <ol className={`grid gap-3 md:grid-cols-3 ${lede || terms ? "mt-5 border-t border-rule pt-5" : "mt-5"}`}>
          {cells.map((c) => (
            <li key={c.k} className="bubble-sm border border-rule bg-bg px-4 py-4">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-accent-soft text-accent" aria-hidden="true">
                  {c.icon}
                </span>
                <span className="label text-ink">{c.k}</span>
              </div>
              <ul className="mt-3 grid gap-1.5 pl-4 text-[14px] leading-snug text-body marker:text-rule" style={{ listStyle: "disc" }}>
                {c.items.map((it, j) => {
                  const pt = it && typeof it === "object" && "sub" in (it as object) ? (it as { text: ReactNode; sub: ReactNode[] }) : null;
                  return (
                    <li key={j}>
                      {pt ? pt.text : (it as ReactNode)}
                      {pt && (
                        <ul className="mt-1 grid gap-1 pl-4 text-[13.5px] text-muted marker:text-rule" style={{ listStyle: "circle" }}>
                          {pt.sub.map((sb, k) => (
                            <li key={k}>{sb}</li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ol>

        {stats && <div className="mt-4"><Stats items={stats} /></div>}
        {takeaways && (
          <div className="mt-5 border-t border-rule pt-4">
            <div className="label mb-2">{takeawaysLabel}</div>
            <ul className="grid gap-2 text-[14.5px] text-body md:grid-cols-3 md:gap-4">
              {takeaways.map((t, i) => {
                const lt = t && typeof t === "object" && "lead" in (t as object) ? (t as { lead: string; text: ReactNode }) : null;
                return (
                  <li key={i} className="flex gap-2.5">
                    <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>
                      {lt ? (
                        <>
                          <strong className="font-semibold text-ink">{lt.lead}</strong> {lt.text}
                        </>
                      ) : (
                        (t as ReactNode)
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

/** a three-point mini timeline: start, beta, general availability */
export function Span({ points, direction = "horizontal" }: { points: { at: string; what: string }[]; direction?: "horizontal" | "vertical" }) {
  if (direction === "vertical") {
    return (
      <ol className="relative grid gap-3 pl-5">
        <span aria-hidden="true" className="absolute top-1.5 bottom-1.5 w-[2px] rounded-full bg-rule" style={{ left: 5 }} />
        {points.map((pt, i) => (
          <li key={pt.at} className="relative text-[13px] leading-tight">
            <span
              aria-hidden="true"
              className={`absolute top-[3px] h-2.5 w-2.5 rounded-full border-2 border-bg ${i === points.length - 1 ? "bg-accent" : "bg-ink"}`}
              style={{ left: -19 }}
            />
            <span className="num font-semibold text-ink">{pt.at}</span>
            <span className="ml-2 text-muted">{pt.what}</span>
          </li>
        ))}
      </ol>
    );
  }
  return (
    <div className="pt-3">
      <div className="relative mx-1 h-[3px] rounded-full bg-rule">
        {points.map((pt, i) => (
          <span
            key={pt.at}
            aria-hidden="true"
            className={`absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-bg ${i === points.length - 1 ? "bg-accent" : "bg-ink"}`}
            style={{ left: `${(i / (points.length - 1)) * 100}%` }}
          />
        ))}
      </div>
      <ol className="mt-2 grid text-[11.5px] leading-tight" style={{ gridTemplateColumns: `repeat(${points.length}, minmax(0, 1fr))` }}>
        {points.map((pt, i) => (
          <li key={pt.at} className={`${i === 0 ? "text-left" : i === points.length - 1 ? "text-right" : "text-center"}`}>
            <span className="num block whitespace-nowrap font-semibold text-ink">{pt.at}</span>
            <span className="text-muted">{pt.what}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** three to five bullets, the body of a beat */
export function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="grid gap-2 pl-5 text-left text-body marker:text-rule" style={{ listStyle: "disc" }}>
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  );
}

/* ----------------------------------------------------------------- beats */

type BeatInfo = { id: string; title: string };
const BeatsContext = createContext<Record<string, number>>({});

export function Beats({
  children,
  label = "The story",
  heading = "The full story",
}: {
  children: ReactNode;
  /** used for the rail's accessible name */
  label?: string;
  /** centred heading above the first slide; empty string hides it */
  heading?: string;
}) {
  const titles = useMemo(() => collectBeats(children), [children]);
  const [current, setCurrent] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLElement>(null);
  // the side rail starts at the vertical centre of the first slide, then catches at the viewport centre
  const [railOffset, setRailOffset] = useState<{ start: number; end: number; half: number } | null>(null);
  useEffect(() => {
    const root = rootRef.current;
    const rail = railRef.current;
    if (!root || !rail) return;
    const beats = root.querySelectorAll<HTMLElement>("[data-beat]");
    const first = beats[0];
    const last = beats[beats.length - 1];
    if (!first || !last) return;
    const measure = () => {
      const rootRect = root.getBoundingClientRect();
      const f = first.getBoundingClientRect();
      const l = last.getBoundingClientRect();
      const half = rail.offsetHeight / 2;
      // the sticky rail stops where its container ends, so end the container half a rail below the last slide's centre
      setRailOffset({
        start: Math.max(0, f.top - rootRect.top + f.height / 2 - half),
        end: Math.max(0, rootRect.bottom - (l.top + l.height / 2 + half)),
        half,
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    ro.observe(first);
    ro.observe(last);
    ro.observe(rail);
    return () => ro.disconnect();
  }, [titles.length]);
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
      <div ref={rootRef} className="relative mx-auto max-w-6xl">
        {heading && (
          <h2 className="pt-10 text-center text-[clamp(26px,3vw,34px)] font-bold tracking-[-0.02em] text-ink md:pt-12">
            {heading}
          </h2>
        )}
        {/* side rail in the left gutter, only when the gutter has room for it */}
        <div className="absolute top-0 hidden w-12 xl:block" style={{ left: -72, bottom: railOffset?.end ?? 0 }} aria-hidden={false}>
          <nav
            ref={railRef}
            aria-label={`${label} progress`}
            className="group sticky flex w-12 flex-col items-center gap-3"
            style={{
              marginTop: railOffset?.start ?? 0,
              top: railOffset ? `calc(50vh - ${railOffset.half}px)` : "28vh",
            }}
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
          className="sticky top-0 z-20 -mx-1 border-b border-rule bg-bg/85 px-1 py-2.5 backdrop-blur xl:hidden"
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
      const p = (c as { props: { id?: string; title?: string; subtitle?: string } }).props;
      if (p?.id && p?.title) out.push({ id: p.id, title: p.subtitle ?? p.title });
    }
  });
  return out;
}

/* ------------------------------------------------------------- one beat */

export type BeatLayout = "split" | "split-reverse" | "stack" | "wide";

export function StoryBeat({
  id,
  title,
  children,
  visual,
  deeper,
  layout = "split",
  visualFirst = false,
  after,
  subtitle,
  align = "center",
  framed = true,
}: {
  /** anchor id, e.g. "the-bet" */
  id: string;
  title: string;
  /** two or three lines; one idea */
  children: ReactNode;
  /** the one big visual for this beat; a slide without one is just heading and bullets */
  visual?: ReactNode;
  /** the long version, shown behind "Go deeper" */
  deeper?: ReactNode;
  /**
   * split: text left, visual right (sticky). split-reverse: visual left. stack: centered text over
   * a full-width visual. wide: visual takes two thirds, text one third.
   */
  layout?: BeatLayout;
  /** stack only: the visual sits between the title and the body copy */
  visualFirst?: boolean;
  /** full-width content under everything else, e.g. a timeline */
  after?: ReactNode;
  /** the slide's short name, shown in the eyebrow after the number and used as the rail's name for the slide */
  subtitle?: string;
  /** stack only: where the heading sits (the body stays a centred column); split layouts are always left */
  align?: "left" | "center";
  /** draw the whole slide as an outlined card on the surface colour (default); false for the older open layout */
  framed?: boolean;
}) {
  const n = (useContext(BeatsContext)[id] ?? 0) + 1;
  const num = String(n);
  const centered = layout === "stack" && align === "center";
  const heading = (
    <>
      <div className={`label mb-3 flex items-center gap-2 text-muted ${centered ? "justify-center" : ""}`}>
        <span className="num">{num}</span>
        {subtitle && (
          <>
            <span aria-hidden="true">·</span>
            <span>{subtitle}</span>
          </>
        )}
      </div>
      <h2 id={`${id}-title`} className="text-[28px] font-bold text-ink md:text-[34px]">
        {title}
      </h2>
    </>
  );
  const body = (
    <>
      <div className={`mt-4 grid gap-3 text-[16.5px] leading-relaxed [&>p]:text-body ${layout === "stack" ? "mx-auto max-w-[58ch]" : "max-w-[46ch]"}`}>
        {children}
      </div>
      {deeper && <GoDeeper align={centered ? "center" : "left"}>{deeper}</GoDeeper>}
    </>
  );
  const text = (
    <>
      {heading}
      {body}
    </>
  );
  const grid =
    layout === "stack"
      ? "grid gap-10"
      : layout === "wide"
        ? "grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:items-start"
        : "grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-start";
  const textOrder = layout === "split-reverse" ? "order-2 md:order-2" : "order-2 md:order-1";
  const visualOrder = layout === "split-reverse" ? "order-1 md:order-1" : "order-1 md:order-2";
  return (
    <section
      id={id}
      data-beat
      className={framed ? "scroll-mt-14 py-4 md:py-5" : "scroll-mt-14 border-t border-rule py-16 first-of-type:border-t-0 md:min-h-[560px] md:py-24"}
      aria-labelledby={`${id}-title`}
    >
      <div className={framed ? "bubble border border-rule bg-surface p-5 sm:p-8 md:p-10" : ""}>
        {!visual ? (
          <div className="grid">
            <div className={centered ? "text-center" : ""}>{heading}</div>
            <div className={centered ? "text-center" : ""}>{body}</div>
          </div>
        ) : layout === "stack" && visualFirst ? (
          <div className="grid gap-8">
            <div className={centered ? "text-center" : ""}>{heading}</div>
            <div className="min-w-0">{visual}</div>
            <div className={centered ? "text-center" : ""}>{body}</div>
          </div>
        ) : layout === "stack" ? (
          <div className={grid}>
            <div className={centered ? "text-center" : ""}>{text}</div>
            <div className="min-w-0">{visual}</div>
          </div>
        ) : (
          <div className={grid}>
            <div className={textOrder}>{text}</div>
            <div className={`min-w-0 md:sticky md:top-16 ${visualOrder}`}>{visual}</div>
          </div>
        )}
        {after && <div className="mt-12">{after}</div>}
      </div>
    </section>
  );
}

function GoDeeper({ children, align = "left" }: { children: ReactNode; align?: "left" | "center" }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  return (
    <div className={`mt-5 ${align === "center" ? "flex flex-col items-center" : ""}`}>
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
      <div
        id={id}
        hidden={!open}
        className={`mt-4 grid max-w-[52ch] gap-3 text-[15px] [&>p]:text-body ${align === "center" ? "text-left" : "border-l-2 border-rule pl-4"}`}
      >
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
