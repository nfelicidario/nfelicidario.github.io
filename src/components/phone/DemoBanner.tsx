"use client";

import { Info } from "lucide-react";

/**
 * A small neutral note floating over the top of the conversation panel that says the agent
 * is a demo. A tonal gray pill on the panel surface (`--ph-surface-high`), a 1 px dark gray
 * outline (`--ph-on-surface-variant` at 60%), 16 px corners. The info icon sits immediately
 * to the left of the text as one inline group, the group centered in the banner, the icon
 * vertically centered on the first line of the (centered, balanced) two-line text. It spans
 * the thread's content width: `ConversationPanel` positions it with the panel padding as its
 * side insets. Reads phone tokens only, so it looks the same whatever the brand color.
 */
export type DemoBannerProps = {
  /** the message; defaults to the RCS Studio line */
  text?: string;
};

export const DEMO_BANNER_TEXT = "Demo agent. Create an account in RCS Studio to make it live.";

/** the banner's height at its two-line default copy: two 14 px lines, 6 px padding, 1 px border */
export const BANNER_HEIGHT = 42;

const LINE = 14;
const ICON = 14;

export function DemoBanner({ text = DEMO_BANNER_TEXT }: DemoBannerProps) {
  return (
    <div
      role="note"
      style={{
        display: "flex",
        width: "100%",
        flexShrink: 0,
        alignItems: "flex-start",
        justifyContent: "center",
        gap: 6,
        padding: "6px 12px",
        borderRadius: 16,
        border: "1px solid color-mix(in srgb, var(--ph-on-surface-variant) 60%, transparent)",
        background: "var(--ph-surface-high)",
        color: "var(--ph-on-surface-variant)",
        fontSize: 11.5,
        lineHeight: `${LINE}px`,
        letterSpacing: 0.1,
      }}
    >
      {/* the icon is as tall as one line, so it centers on the first line of a wrapped text */}
      <Info size={ICON} aria-hidden="true" style={{ flexShrink: 0, marginTop: (LINE - ICON) / 2, color: "var(--ph-on-surface-variant)" }} />
      <span style={{ minWidth: 0, textAlign: "center", textWrap: "balance" }}>{text}</span>
    </div>
  );
}
