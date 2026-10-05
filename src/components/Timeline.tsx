"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Milestone } from "@/content/timeline";

type Line = "down" | "both" | "up" | "none";

function Row({ m, line, filled = false }: { m: Milestone; line: Line; filled?: boolean }) {
  const inner = (
    <>
      <span className="label num pt-[3px] text-right">{m.when}</span>
      <span className="tl-marker self-stretch" data-line={line}>
        <span className="tl-dot" data-filled={filled} />
      </span>
      <span className="text-[14.5px] text-body group-hover:text-ink">{m.what}</span>
    </>
  );
  const cls = "group grid grid-cols-[64px_20px_1fr] gap-x-3 rounded-lg px-2 py-1.5 -mx-2";
  return m.href ? (
    <Link href={m.href} className={`${cls} transition-colors hover:bg-raised`}>
      {inner}
    </Link>
  ) : (
    <div className={cls}>{inner}</div>
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
        className="label -mx-2 grid grid-cols-[64px_20px_1fr] gap-x-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-raised hover:text-ink"
      >
        <span />
        <span className="tl-marker self-stretch" data-line="both" />
        <span>{open ? "Collapse timeline" : `Expand timeline · ${more.length} more`}</span>
      </button>

      <Row m={origin} line="up" />
    </div>
  );
}
