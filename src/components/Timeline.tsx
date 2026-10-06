"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Newspaper } from "lucide-react";
import type { Milestone } from "@/content/timeline";

type Line = "down" | "both" | "up" | "none";

function Row({ m, line, filled = false }: { m: Milestone; line: Line; filled?: boolean }) {
  const hasPress = !!m.links?.length;
  const inner = (
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
        {(m.sub?.length || hasPress) && (
          <span className="grid max-h-0 overflow-hidden transition-[max-height] duration-300 ease-out group-hover:max-h-40 group-focus-within:max-h-40">
            <span className="grid gap-0.5 pt-1.5 pb-1">
              {m.sub?.map((t) => (
                <span key={t} className="text-[13px] text-muted">
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
                      className="label inline-flex items-center gap-0.5 text-accent hover:underline"
                    >
                      {l.label}
                      <ArrowUpRight size={12} />
                    </a>
                  ))}
                </span>
              )}
            </span>
          </span>
        )}
      </span>
    </>
  );
  const cls = "group grid grid-cols-[72px_20px_1fr] gap-x-3 rounded-lg px-2 py-1.5 -mx-2";
  return m.href ? (
    <Link href={m.href} className={`${cls} transition-colors hover:bg-raised`}>
      {inner}
    </Link>
  ) : (
    <div className={`${cls} hover:bg-raised`} tabIndex={0}>
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
  const [open, setOpen] = useState(false);
  return (
    <div className="grid">
      {recent.map((m, i) => (
        <Row key={m.when + m.what} m={m} line={i === 0 ? "down" : "both"} filled={i === 0} />
      ))}

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="more"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="grid">
              {more.map((m, i) => (
                <motion.div
                  key={m.when + m.what}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.25 }}
                >
                  <Row m={m} line="both" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="label -mx-2 grid grid-cols-[72px_20px_1fr] gap-x-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-raised hover:text-ink"
      >
        <span />
        <span className="tl-marker self-stretch" data-line="both" />
        <span>{open ? "Collapse timeline" : `Expand timeline · ${more.length} more`}</span>
      </button>

      <Row m={origin} line="up" />
    </div>
  );
}
