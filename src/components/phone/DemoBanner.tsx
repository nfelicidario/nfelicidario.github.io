"use client";

import { Info } from "lucide-react";

/**
 * A faint tonal pill at the top of the conversation panel that says the agent is a demo.
 * Small text, muted color, no border. Place it as the first child of `ConversationPanel`.
 */
export type DemoBannerProps = {
  /** the message; defaults to the RCS Studio line */
  text?: string;
};

export const DEMO_BANNER_TEXT = "Demo agent. Create an account in RCS Studio to make it live.";

export function DemoBanner({ text = DEMO_BANNER_TEXT }: DemoBannerProps) {
  return (
    <div
      role="note"
      style={{
        display: "flex",
        alignSelf: "center",
        alignItems: "center",
        gap: 6,
        maxWidth: "100%",
        flexShrink: 0,
        padding: "5px 12px 5px 10px",
        borderRadius: 999,
        background: "var(--ph-surface-low)",
        color: "var(--ph-on-surface-variant)",
        fontSize: 11.5,
        lineHeight: "14px",
        letterSpacing: 0.1,
      }}
    >
      <Info size={13} aria-hidden="true" style={{ flexShrink: 0, opacity: 0.85 }} />
      <span style={{ minWidth: 0, overflowWrap: "anywhere" }}>{text}</span>
    </div>
  );
}
