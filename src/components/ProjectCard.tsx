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
        className="bubble group grid h-full grid-rows-[auto_1fr_auto] gap-5 border border-rule bg-surface p-5 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-accent"
      >
        <div
          className="bubble-sm relative h-44 overflow-hidden bg-raised"
          style={{
            background: `radial-gradient(120% 90% at 18% 12%, ${p.hues[0]}, ${p.hues[1]} 70%)`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.gif}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-top grayscale transition-[filter] duration-500 group-hover:grayscale-0"
          />
        </div>
        <div>
          <h3 className="text-[22px] font-bold text-ink">{p.title}</h3>
          <div className="mt-3 grid gap-3 text-[13.5px] leading-snug">
            <ul className="grid gap-1 pl-4 text-body marker:text-rule" style={{ listStyle: "disc" }}>
              {p.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <div>
              <div className="label mb-1">Outcome</div>
              <ul className="grid gap-1 pl-4 text-body marker:text-accent" style={{ listStyle: "disc" }}>
                {p.outcomes.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            </div>
          </div>
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
