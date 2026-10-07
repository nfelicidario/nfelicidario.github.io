"use client";

import type { CSSProperties } from "react";

/**
 * Google's filled verified badge: the scalloped circle with a check. The path is the
 * "verified" glyph from Google's Material Symbols (Apache License 2.0,
 * https://github.com/google/material-design-icons), embedded inline so the kit makes no
 * network requests. Fills with `--ph-verified` (Google blue #1A73E8 in light, lifted in
 * dark); pass `color` to use the brand color instead.
 */
export type VerifiedBadgeProps = {
  /** CSS px */
  size?: number;
  /** any CSS color; defaults to the phone's verified token */
  color?: string;
  /** accessible name; pass "" to hide it from assistive tech when the text nearby already says it */
  label?: string;
  style?: CSSProperties;
};

/** Material Symbols "verified", filled, 960 unit grid */
export const VERIFIED_PATH =
  "m344-60-76-128-144-32 14-148-98-112 98-112-14-148 144-32 76-128 136 58 136-58 76 128 144 32-14 148 98 112-98 112 14 148-144 32-76 128-136-58-136 58Zm94-278 226-226-56-58-170 170-86-84-56 56 142 142Z";

export function VerifiedBadge({ size = 16, color = "var(--accent, #1F4FE0)", label = "Verified", style }: VerifiedBadgeProps) {
  const decorative = label === "";
  return (
    <svg
      viewBox="0 -960 960 960"
      width={size}
      height={size}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative ? true : undefined}
      focusable="false"
      style={{ display: "block", flexShrink: 0, ...style }}
    >
      <path d={VERIFIED_PATH} fill={color} />
    </svg>
  );
}
