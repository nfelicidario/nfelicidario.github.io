"use client";

import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Newspaper } from "lucide-react";
import type { Milestone } from "@/content/timeline";

type Line = "down" | "both" | "up" | "none";

const OPEN_DELAY = 260; // hover intent: sweeping the cursor across rows opens nothing
const CLOSE_DELAY = 160;
const EASE = [0.2, 0.7, 0.2, 1] as const;

function Details({ m }: { m: Milestone }) {
  return (
    <span className="grid gap-1 pt-2 pb-1.5">
      {m.sub?.map((t) => (
        <span key={t} className="text-[13px] leading-snug text-muted">
          {t}
        </span>
      ))}
      {m.links && (
        <span className="flex flex-wrap gap-x-3 pt-0.5">
          {m.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener"
              onClick={(e) => e.stopPropagation()}
              className="label inline-flex items-center gap-0.5 text-accent hover:underline"
            >
              {l.label}
              <ArrowUpRight size={12} />
            </a>
          ))}
        </span>
      )}
    </span>
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
  const hasPress = !!m.links?.length;

  const inner: ReactNode = (
    <>
      <span className="label num pt-[3px] text-right">{m.when}</span>
      <span className="tl-marker self-stretch" data-line={line}>
        <span className="tl-dot" data-filled={filled} />
      </span>
      <span className="min-w-0">
        <span className="flex items-start gap-1.5 text-[14.5px] text-body group-hover:text-ink">
          <span>{m.what}</span>
          {hasPress && (
            <Newspaper
              size={14}
              aria-label="Press coverage"
              className="mt-[4px] shrink-0 text-muted group-hover:text-accent"
            />
          )}
        </span>
        <AnimatePresence initial={false}>
          {open && hasDetails && (
            <motion.span
              key="details"
              className="block overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ height: { duration: 0.38, ease: EASE }, opacity: { duration: 0.25 } }}
            >
              <Details m={m} />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </>
  );

  const cls =
    "group grid grid-cols-[72px_20px_1fr] gap-x-3 rounded-lg px-2 py-1.5 -mx-2 transition-colors duration-200 hover:bg-raised";
  const handlers = {
    onMouseEnter: onIntent,
    onMouseLeave: onLeave,
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
    <div className="grid">
      {recent.map((m, i) => row(m, i === 0 ? "down" : "both", i === 0))}

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="more"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="overflow-hidden"
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

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="label -mx-2 grid grid-cols-[72px_20px_1fr] gap-x-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-raised hover:text-ink"
      >
        <span />
        <span className="tl-marker self-stretch" data-line="both" />
        <span>{expanded ? "Collapse timeline" : `Expand timeline · ${more.length} more`}</span>
      </button>

      {row(origin, "up")}
    </div>
  );
}
