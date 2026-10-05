"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { Project } from "@/content/projects";

export function ProjectCard({ p, index }: { p: Project; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.08 * index, ease: [0.2, 0.7, 0.2, 1] }}
    >
      <Link
        href={`/work/${p.slug}/`}
        className="bubble group grid h-full grid-rows-[auto_1fr_auto] gap-4 border border-rule bg-surface p-4 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-accent"
      >
        <div
          className="bubble-sm relative h-40 overflow-hidden"
          style={{
            background: `radial-gradient(120% 90% at 18% 12%, ${p.hues[0]}, ${p.hues[1]} 70%)`,
          }}
          aria-hidden="true"
        >
          {/* placeholder "message" marks until the real artifact lands */}
          <div className="absolute inset-x-4 bottom-4 flex flex-col gap-2">
            <span className="bubble h-3 w-2/3 bg-white/25" />
            <span className="bubble h-3 w-1/2 bg-white/15" />
            <span className="bubble-me h-3 w-1/3 self-end bg-white/40" />
          </div>
        </div>
        <div>
          <h3 className="text-[22px] font-bold text-ink">{p.title}</h3>
          <p className="mt-1.5 text-[14.5px] leading-snug">{p.summary}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="label">
            {p.org} · {p.years}
          </span>
          <span className="num text-[13px] font-semibold text-ink">{p.metric}</span>
        </div>
      </Link>
    </motion.div>
  );
}
