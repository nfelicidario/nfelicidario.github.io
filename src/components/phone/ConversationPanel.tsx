"use client";

import type { CSSProperties, ReactNode } from "react";

/**
 * The lighter panel the conversation sits in: full width, rounded at the top only, and
 * running to the bottom of the screen (the gesture bar sits below it on the device). Two
 * regions stack inside it: the thread (your children: `DemoBanner`, then the messages as a
 * `flex: 1; min-height: 0` column that justifies to the end, then `SuggestionChips`), and an
 * optional `composer` pinned under it behind a faint divider, so the thread visually passes
 * beneath the composer as it scrolls.
 */
export type ConversationPanelProps = {
  children: ReactNode;
  /** pinned to the bottom of the panel, under the divider; usually `<Composer />` */
  composer?: ReactNode;
  style?: CSSProperties;
};

export const PANEL_RADIUS = 24;
/** horizontal inset `AgentInfo` keeps from the screen edge */
export const PANEL_INSET = 8;
/** the thread's inner padding; pass it to `SuggestionChips` as `bleed` */
export const PANEL_PADDING = 10;

export function ConversationPanel({ children, composer, style }: ConversationPanelProps) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: 0,
        flex: 1,
        flexDirection: "column",
        margin: 0,
        overflow: "hidden",
        borderRadius: `${PANEL_RADIUS}px ${PANEL_RADIUS}px 0 0`,
        background: "var(--ph-surface)",
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          minHeight: 0,
          flex: 1,
          flexDirection: "column",
          gap: 8,
          padding: PANEL_PADDING,
          overflow: "hidden",
        }}
      >
        {children}
      </div>
      {composer && (
        <div
          style={{
            flexShrink: 0,
            borderTop: "1px solid color-mix(in srgb, var(--ph-outline-variant) 55%, transparent)",
          }}
        >
          {composer}
        </div>
      )}
    </div>
  );
}
