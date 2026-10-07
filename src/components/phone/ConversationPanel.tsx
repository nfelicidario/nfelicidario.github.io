"use client";

import type { CSSProperties, ReactNode } from "react";

/**
 * The lighter rounded panel the conversation sits in, inset below the header on the
 * screen's darker ground (Material 3 "surface" on "surface container"; the Samsung
 * Messages layout). A flex column: put `DemoBanner` first, then the thread as a
 * `flex: 1; min-height: 0` column that justifies to the end.
 */
export type ConversationPanelProps = {
  children: ReactNode;
  style?: CSSProperties;
};

export const PANEL_RADIUS = 24;
export const PANEL_INSET = 8;

export function ConversationPanel({ children, style }: ConversationPanelProps) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: 0,
        flex: 1,
        flexDirection: "column",
        gap: 8,
        margin: `0 ${PANEL_INSET}px 2px`,
        padding: "10px 10px 10px",
        overflow: "hidden",
        borderRadius: PANEL_RADIUS,
        background: "var(--ph-surface)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
