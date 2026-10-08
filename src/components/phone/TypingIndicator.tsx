"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * The agent is typing: the agent's small logo at the left (pass anything 1:1; it is masked
 * to a rounded square), then three dots that bounce in a wave, staggered, on no bubble.
 * Under reduced motion the dots sit still.
 */
export type TypingIndicatorProps = {
  /** the agent's logo, masked to a 24px rounded square; omit for dots only */
  logo?: ReactNode;
  label?: string;
};

/** the wave: one full loop in about 1.1 s */
const LOOP = 1.1;
const DOT_STAGGER = 0.14;

export function TypingIndicator({ logo, label = "Typing" }: TypingIndicatorProps) {
  const reduced = useReducedMotion();
  return (
    <div
      role="status"
      aria-label={label}
      style={{
        alignSelf: "flex-start",
        display: "flex",
        height: 28,
        alignItems: "center",
        gap: 10,
        padding: "0 2px",
      }}
    >
      {logo && (
        <span
          aria-hidden="true"
          style={{
            display: "block",
            width: 24,
            height: 24,
            flexShrink: 0,
            overflow: "hidden",
            borderRadius: 6,
            background: "transparent",
          }}
        >
          {logo}
        </span>
      )}
      <span style={{ display: "flex", alignItems: "center", gap: 4, height: 16 }}>
        {[0, 1, 2].map((k) => (
          <motion.span
            key={k}
            aria-hidden="true"
            style={{ display: "block", width: 7, height: 7, borderRadius: 999, background: "var(--ph-on-surface-variant)" }}
            animate={reduced ? { opacity: 0.7 } : { y: [0, -5, 0, 0], opacity: [0.5, 1, 0.5, 0.5] }}
            transition={
              reduced
                ? undefined
                : { duration: LOOP, times: [0, 0.22, 0.44, 1], repeat: Infinity, ease: "easeInOut", delay: k * DOT_STAGGER }
            }
          />
        ))}
      </span>
    </div>
  );
}
