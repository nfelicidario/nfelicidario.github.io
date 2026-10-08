"use client";

import { Info } from "lucide-react";

/**
 * A small tinted note at the top of the conversation panel that says the agent is a demo.
 * Centered text, the portfolio accent at low opacity over the panel surface, a 1 px accent
 * outline, and the info icon in the accent. Place it as `ConversationPanel`'s `banner`.
 *
 * This is the one piece of the kit that reads a site token (`--accent`, with the portfolio
 * blue as its fallback), because the banner speaks for the site, not for the phone.
 */
export type DemoBannerProps = {
  /** the message; defaults to the RCS Studio line */
  text?: string;
};

export const DEMO_BANNER_TEXT = "Demo agent. Create an account in RCS Studio to make it live.";

/** the site's accent, with the portfolio blue when the kit is rendered outside the site */
const ACCENT = "var(--accent, #1f4fe0)";
/** the banner's height at its two-line default copy: two 14 px lines, 6 px padding, 1 px border */
export const BANNER_HEIGHT = 42;

export function DemoBanner({ text = DEMO_BANNER_TEXT }: DemoBannerProps) {
  return (
    <div
      role="note"
      style={{
        alignSelf: "center",
        maxWidth: 300,
        flexShrink: 0,
        padding: "6px 12px",
        borderRadius: 14,
        border: `1px solid ${ACCENT}`,
        background: `color-mix(in srgb, ${ACCENT} 10%, var(--ph-surface))`,
        color: "var(--ph-on-surface-variant)",
        fontSize: 11.5,
        lineHeight: "14px",
        letterSpacing: 0.1,
        textAlign: "center",
        textWrap: "balance",
      }}
    >
      <Info size={13} aria-hidden="true" style={{ display: "inline-block", verticalAlign: -3, marginRight: 5, color: ACCENT }} />
      {text}
    </div>
  );
}
