"use client";

import type { ReactNode } from "react";

/**
 * The agent is typing: the agent's small logo at the left (pass anything 1:1; it is masked
 * to a rounded square), then three dots that bounce in a wave, staggered, on no bubble.
 * Under reduced motion the dots sit still.
 *
 * The wave is a CSS animation, on purpose. It used to be a Motion `animate` keyframe loop,
 * and that never played inside the RCS Studio hero: the phone column there sits in an
 * `AnimatePresence initial={false}`, whose presence context tells every motion element
 * mounted inside it to skip its mount animation, and a looping `animate` is a mount
 * animation, so Motion parked the dots at their final keyframe. (Motion's `PresenceChild`
 * memoizes that context on presence alone, so the block outlived the first render and hit
 * every later typing indicator in the thread too.) A `@keyframes` rule in a hoisted
 * `<style>` ships with the component, runs the moment the dots are in the DOM, and does not
 * care which presence or reduced-motion context it is rendered under.
 */
export type TypingIndicatorProps = {
  /** the agent's logo, masked to a 24px rounded square; omit for dots only */
  logo?: ReactNode;
  label?: string;
};

/** the wave: one full loop in 1.1 s, each dot 140 ms behind the last */
export const TYPING_LOOP_MS = 1100;
const DOT_STAGGER_MS = 140;

const TYPING_CSS =
  "@keyframes ph-typing{0%{transform:translateY(0);opacity:.5}22%{transform:translateY(-5px);opacity:1}44%,100%{transform:translateY(0);opacity:.5}}" +
  `[data-ph-typing-dot]{animation:ph-typing ${TYPING_LOOP_MS}ms ease-in-out infinite;will-change:transform,opacity}` +
  "@media (prefers-reduced-motion:reduce){[data-ph-typing-dot]{animation:none;opacity:.7}}";

export function TypingIndicator({ logo, label = "Typing" }: TypingIndicatorProps) {
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
      <style href="ph-typing" precedence="default">
        {TYPING_CSS}
      </style>
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
          <span
            key={k}
            aria-hidden="true"
            data-ph-typing-dot=""
            style={{
              display: "block",
              width: 7,
              height: 7,
              borderRadius: 999,
              background: "var(--ph-on-surface-variant)",
              opacity: 0.5,
              animationDelay: `${k * DOT_STAGGER_MS}ms`,
            }}
          />
        ))}
      </span>
    </div>
  );
}
