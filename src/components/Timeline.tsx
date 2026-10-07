"use client";

import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronsDownUp, ChevronsUpDown, Globe, Newspaper, SquareArrowOutUpRight } from "lucide-react";
import type { Milestone } from "@/content/timeline";

type Line = "down" | "both" | "up" | "none";

const OPEN_DELAY = 240; // hover intent: a passing cursor opens nothing
const CLOSE_DELAY = 180;
const EASE = [0.2, 0.7, 0.2, 1] as const;

function PressIcon({ className = "" }: { className?: string }) {
  // flipped horizontally per the design
  return <Newspaper size={14} aria-hidden="true" className={`-scale-x-100 ${className}`} />;
}

function Details({ m }: { m: Milestone }) {
  return (
    <div className="grid gap-1.5">
      {!!m.sub?.length && (
        <ul className="grid gap-1 pl-4 text-[13px] leading-snug text-muted marker:text-rule" style={{ listStyle: "disc" }}>
          {m.sub.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      )}
      {!!m.links?.length && (
        <ul className="grid gap-1 pt-0.5">
          {m.links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                target="_blank"
                rel="noopener"
                onClick={(e) => e.stopPropagation()}
                className="label inline-flex items-center gap-1.5 text-accent hover:underline"
              >
                {l.kind === "web" ? <Globe size={14} aria-hidden="true" /> : <PressIcon />}
                <span>{l.label}</span>
                <SquareArrowOutUpRight size={12} aria-label="Opens in a new tab" />
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Row({
  m,
  line,
  filled = false,
  open,
  onIntent,
  onLeave,
  onToggle,
}: {
  m: Milestone;
  line: Line;
  filled?: boolean;
  open: boolean;
  onIntent: () => void;
  onLeave: () => void;
  onToggle: () => void;
}) {
  const hasDetails = !!(m.sub?.length || m.links?.length);
  const kinds = Array.from(new Set((m.links ?? []).map((l) => (l.kind === "web" ? "web" : "press"))));

  const cell = "py-1.5 transition-colors duration-200 group-hover:bg-raised";
  const inner: ReactNode = (
    <>
      <span className={`label num justify-self-end whitespace-nowrap rounded-l-lg pl-2 pr-3 pt-[9px] ${cell}`}>
        {m.when.includes(" ") ? (
          <>
            <span className="opacity-50">{m.when.split(" ")[0]}</span> {m.when.split(" ")[1]}
          </>
        ) : (
          m.when
        )}
      </span>
      <span className={`tl-marker self-stretch ${cell}`} data-line={line}>
        <span className="tl-dot" data-filled={filled} />
      </span>
      <span
        className={`relative min-w-0 rounded-r-lg pl-3 pr-3 ${cell}`}
        onMouseEnter={onIntent}
        onMouseLeave={onLeave}
      >
        <span className="text-[14.5px] text-body group-hover:text-ink">
          {m.what}
          {kinds.map((k) => (
            <span
              key={k}
              className="ml-1.5 inline-block align-[-2px] text-muted"
              title={k === "web" ? "Live product" : "Press coverage"}
            >
              {k === "web" ? <Globe size={14} aria-hidden="true" /> : <PressIcon />}
            </span>
          ))}
        </span>
        {/* Details float below the line so the page never reflows (no scroll-anchoring jumps). */}
        <AnimatePresence initial={false}>
          {open && hasDetails && (
            <motion.span
              key="details"
              className="bubble-sm absolute left-3 right-0 top-full z-20 mt-1 block border border-rule bg-surface px-3 py-2.5 shadow-[var(--shadow)]"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22, ease: EASE }}
            >
              <Details m={m} />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </>
  );

  const cls = "group grid grid-cols-[60px_20px_auto] justify-start";
  const handlers = {
    onFocus: onIntent,
    onBlur: onLeave,
  };

  if (m.href) {
    return (
      <Link href={m.href} className={cls} {...handlers}>
        {inner}
      </Link>
    );
  }
  return (
    <div
      className={`${cls} ${hasDetails ? "cursor-default" : ""}`}
      tabIndex={hasDetails ? 0 : -1}
      role={hasDetails ? "button" : undefined}
      aria-expanded={hasDetails ? open : undefined}
      onClick={hasDetails ? onToggle : undefined}
      onKeyDown={(e) => {
        if (hasDetails && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onToggle();
        }
      }}
      {...handlers}
    >
      {inner}
    </div>
  );
}

export function Timeline({
  recent,
  more,
  origin,
}: {
  recent: Milestone[];
  more: Milestone[];
  origin: Milestone;
}) {
  const [expanded, setExpanded] = useState(false);
  const [settled, setSettled] = useState(false); // expanded block finished animating: release overflow clip
  const [openKey, setOpenKey] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const keyOf = (m: Milestone) => m.when + m.what;

  function intent(k: string) {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpenKey(k), OPEN_DELAY);
  }
  function leave(k: string) {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpenKey((cur) => (cur === k ? null : cur)), CLOSE_DELAY);
  }
  function toggle(k: string) {
    if (timer.current) clearTimeout(timer.current);
    setOpenKey((cur) => (cur === k ? null : k));
  }

  const row = (m: Milestone, line: Line, filled = false) => {
    const k = keyOf(m);
    return (
      <Row
        key={k}
        m={m}
        line={line}
        filled={filled}
        open={openKey === k}
        onIntent={() => intent(k)}
        onLeave={() => leave(k)}
        onToggle={() => toggle(k)}
      />
    );
  };

  return (
    <div className="grid" style={{ overflowAnchor: "none" }}>
      {recent.map((m, i) => row(m, i === 0 ? "down" : "both", i === 0))}

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="more"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            onAnimationComplete={() => setSettled(expanded)}
            style={{ overflow: settled ? "visible" : "hidden" }}
          >
            <div className="grid">
              {more.map((m, i) => (
                <motion.div
                  key={keyOf(m)}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.25 }}
                >
                  {row(m, "both")}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-[60px_20px_auto] justify-start">
        <span />
        <button
          type="button"
          onClick={() => {
            setSettled(false);
            setExpanded((v) => !v);
          }}
          aria-expanded={expanded}
          className="label col-span-2 grid grid-cols-[20px_auto] items-center gap-x-3 rounded-lg py-1.5 pr-3 text-left opacity-60 transition-[opacity,background-color,color] hover:bg-raised hover:text-ink hover:opacity-100 focus-visible:opacity-100"
        >
          <span className="flex justify-center" aria-hidden="true">
            {expanded ? <ChevronsDownUp size={16} strokeWidth={2} /> : <ChevronsUpDown size={16} strokeWidth={2} />}
          </span>
          <span>{expanded ? "Collapse timeline" : `Expand timeline · ${more.length} more`}</span>
        </button>
      </div>

      {row(origin, "up")}
    </div>
  );
}
