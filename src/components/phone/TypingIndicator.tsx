"use client";

import { motion, useReducedMotion } from "motion/react";
import { BUBBLE_RADIUS, BUBBLE_TAIL } from "./MessageBubble";

/** three bouncing dots in an agent bubble; static under reduced motion */
export function TypingIndicator({ label = "Typing" }: { label?: string }) {
  const reduced = useReducedMotion();
  return (
    <div
      role="status"
      aria-label={label}
      style={{
        alignSelf: "flex-start",
        display: "flex",
        height: 40,
        alignItems: "center",
        gap: 5,
        padding: "0 18px",
        borderRadius: `${BUBBLE_RADIUS}px ${BUBBLE_RADIUS}px ${BUBBLE_RADIUS}px ${BUBBLE_TAIL}px`,
        background: "var(--ph-surface-high)",
      }}
    >
      {[0, 1, 2].map((k) => (
        <motion.span
          key={k}
          aria-hidden="true"
          style={{ display: "block", width: 8, height: 8, borderRadius: 999, background: "var(--ph-on-surface-variant)" }}
          animate={reduced ? { opacity: 0.6 } : { y: [0, -4, 0], opacity: [0.45, 1, 0.45] }}
          transition={reduced ? undefined : { duration: 0.9, repeat: Infinity, ease: "easeInOut", delay: k * 0.15 }}
        />
      ))}
    </div>
  );
}
