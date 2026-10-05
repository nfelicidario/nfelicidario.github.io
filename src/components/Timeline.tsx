"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Milestone } from "@/content/timeline";

function Row({ m }: { m: Milestone }) {
  const inner = (
    <>
      <span className="label num pt-[3px]">{m.when}</span>
      <span className="text-[14.5px] text-body group-hover:text-ink">{m.what}</span>
    </>
  );
  const cls = "group grid grid-cols-[72px_1fr] items-start gap-3 rounded-lg px-2 py-1.5 -mx-2";
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
    <div className="grid gap-1">
      {recent.map((m) => (
        <Row key={m.when + m.what} m={m} />
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
            <div className="grid gap-1 py-1">
              {more.map((m, i) => (
                <motion.div
                  key={m.when + m.what}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.25 }}
                >
                  <Row m={m} />
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
        className="label -mx-2 grid grid-cols-[72px_1fr] items-center gap-3 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-raised hover:text-ink"
      >
        <span aria-hidden="true" className="text-rule">
          ·····
        </span>
        <span>{open ? "Show less" : `See full timeline · ${more.length} more`}</span>
      </button>

      <Row m={origin} />
    </div>
  );
}
