"use client";

import type { ReactNode } from "react";
import { VerifiedBadge } from "./VerifiedBadge";

/**
 * The top of a new RCS business thread in Google Messages: the agent's logo centered,
 * masked to a rounded square on no background (a transparent PNG stays transparent, a round
 * logo stays round, sharp corners get rounded), the display name with the filled verified
 * badge, a short description in muted text, then a faint full-width divider. Place it first in
 * the thread column, before the day divider.
 */
export type ThreadIntroProps = {
  /** anything 1:1 */
  logo: ReactNode;
  name: string;
  description?: string;
  verified?: boolean;
  /** CSS px, the logo's square */
  logoSize?: number;
};

export const INTRO_LOGO_SIZE = 64;
/** the logo's corner radius at `INTRO_LOGO_SIZE`; scales with `logoSize` */
export const INTRO_LOGO_RADIUS = 16;

export function ThreadIntro({ logo, name, description, verified = false, logoSize = INTRO_LOGO_SIZE }: ThreadIntroProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        alignSelf: "stretch",
        flexShrink: 0,
        gap: 6,
        padding: "12px 16px 0",
        textAlign: "center",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          display: "block",
          width: logoSize,
          height: logoSize,
          overflow: "hidden",
          borderRadius: Math.round((INTRO_LOGO_RADIUS * logoSize) / INTRO_LOGO_SIZE),
          background: "transparent",
        }}
      >
        {logo}
      </span>
      <div style={{ display: "flex", maxWidth: "100%", alignItems: "center", gap: 5, marginTop: 4, fontSize: 18, fontWeight: 500, lineHeight: 1.2 }}>
        <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</span>
        {verified && <VerifiedBadge size={20} />}
      </div>
      {description && (
        <p
          style={{
            margin: 0,
            maxWidth: "100%",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            textAlign: "center",
            fontSize: 13,
            lineHeight: "18px",
            color: "var(--ph-on-surface-variant)",
          }}
        >
          {description}
        </p>
      )}
      <hr
        aria-hidden="true"
        style={{
          width: "100%",
          height: 1,
          margin: "12px 0 4px",
          border: 0,
          background: "color-mix(in srgb, var(--ph-outline-variant) 55%, transparent)",
        }}
      />
    </div>
  );
}
