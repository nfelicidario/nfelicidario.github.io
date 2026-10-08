"use client";

import type { CSSProperties, ReactNode } from "react";
import { Check, CheckCheck } from "lucide-react";

/**
 * One message in the thread. Agent messages sit left in a tonal container; user messages sit
 * right in the brand color. 28px corners, with a 4px "tail" corner on the latest bubble of a
 * run (`tail`). Place bubbles as direct children of a flex column; they align themselves.
 */
export type BubbleStatus = "sent" | "delivered" | "read";

export type MessageBubbleProps = {
  from: "agent" | "user";
  children: ReactNode;
  /** the last bubble in a run gets the small tail corner */
  tail?: boolean;
  /** user messages only: shown under the bubble */
  status?: BubbleStatus;
  /** small time label under the bubble */
  time?: string;
  /** dashed placeholder for "nothing here yet" previews */
  ghost?: boolean;
  style?: CSSProperties;
};

export const BUBBLE_RADIUS = 28;
export const BUBBLE_TAIL = 4;

export function MessageBubble({ from, children, tail = true, status, time, ghost = false, style }: MessageBubbleProps) {
  const user = from === "user";
  const radius = tail
    ? user
      ? `${BUBBLE_RADIUS}px ${BUBBLE_RADIUS}px ${BUBBLE_TAIL}px ${BUBBLE_RADIUS}px`
      : `${BUBBLE_RADIUS}px ${BUBBLE_RADIUS}px ${BUBBLE_RADIUS}px ${BUBBLE_TAIL}px`
    : BUBBLE_RADIUS;

  const bubble: CSSProperties = ghost
    ? { border: "1.5px dashed var(--ph-outline-variant)", color: "var(--ph-on-surface-variant)", background: "transparent" }
    : user
      ? { background: "var(--ph-brand)", color: "var(--ph-on-brand)" }
      : { background: "var(--ph-surface-high)", color: "var(--ph-on-surface)" };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: user ? "flex-end" : "flex-start",
        alignSelf: user ? "flex-end" : "flex-start",
        maxWidth: "80%",
        gap: 3,
        ...style,
      }}
    >
      <div
        style={{
          padding: "10px 16px",
          fontSize: 15,
          lineHeight: "20px",
          borderRadius: radius,
          overflowWrap: "anywhere",
          ...bubble,
        }}
      >
        {children}
      </div>
      {(status || time) && (
        <div
          aria-live="polite"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            padding: "0 6px",
            fontSize: 11.5,
            color: "var(--ph-on-surface-variant)",
          }}
        >
          {time}
          {time && status ? " · " : null}
          {status === "read" ? (
            <CheckCheck size={13} aria-hidden="true" style={{ color: "var(--ph-on-surface)" }} />
          ) : status ? (
            <Check size={13} aria-hidden="true" />
          ) : null}
          {status === "read" ? "Read" : status === "delivered" ? "Delivered" : status === "sent" ? "Sent" : null}
        </div>
      )}
    </div>
  );
}

/** centered day or time divider, e.g. "Today · 9:30 AM" */
export function Timestamp({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        alignSelf: "center",
        padding: "2px 0",
        fontSize: 12,
        fontWeight: 500,
        color: "var(--ph-on-surface-variant)",
      }}
    >
      {children}
    </div>
  );
}
