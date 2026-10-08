"use client";

import type { CSSProperties, ReactNode } from "react";
import { GESTURE_BAR_H } from "./AndroidPhone";
import { BANNER_HEIGHT } from "./DemoBanner";

/**
 * The lighter panel the conversation sits in: full width, rounded at the top only, and
 * running to the bottom of the screen (the gesture bar sits below it on the device). Two
 * regions stack inside it: the thread region, which your children fill edge to edge (make the
 * scroller `flex: 1; min-height: 0; overflow-y: auto` and give it its own padding, see
 * `PANEL_PADDING` and `BANNER_CLEARANCE`), and an optional `composer` pinned under it behind a
 * faint divider. Nothing clips the thread except the panel's top edge and that divider, so
 * content disappears exactly there, and passes beneath the composer as it scrolls.
 *
 * `banner` (usually `DemoBanner`) floats over the thread region, centered at the top with a
 * small margin, so messages scroll beneath it; pad the scroller's top by `BANNER_CLEARANCE`.
 */
export type ConversationPanelProps = {
  children: ReactNode;
  /** floats centered at the top of the thread region; usually `<DemoBanner />` */
  banner?: ReactNode;
  /** pinned to the bottom of the panel, under the divider; usually `<Composer />` */
  composer?: ReactNode;
  style?: CSSProperties;
};

export const PANEL_RADIUS = 24;
/** horizontal inset a nested panel keeps from the screen edge */
export const PANEL_INSET = 8;
/** the thread scroller's inner padding; pass it to `SuggestionChips` and `RichCardCarousel` as `bleed` */
export const PANEL_PADDING = 10;
/** how far down the floating banner sits from the panel's top */
export const BANNER_TOP = 8;
/** top padding for a scroller under a floating `DemoBanner` (its two-line note, the margin above, and a gap below) */
export const BANNER_CLEARANCE = BANNER_TOP + BANNER_HEIGHT + 8;

export function ConversationPanel({ children, banner, composer, style }: ConversationPanelProps) {
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
          position: "relative",
          display: "flex",
          minHeight: 0,
          flex: 1,
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {children}
        {banner && (
          <div
            style={{
              position: "absolute",
              top: BANNER_TOP,
              left: PANEL_PADDING,
              right: PANEL_PADDING,
              display: "flex",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            {banner}
          </div>
        )}
      </div>
      {composer && (
        <div
          style={{
            flexShrink: 0,
            paddingBottom: GESTURE_BAR_H - 6,
            borderTop: "1px solid color-mix(in srgb, var(--ph-outline-variant) 55%, transparent)",
          }}
        >
          {composer}
        </div>
      )}
    </div>
  );
}
