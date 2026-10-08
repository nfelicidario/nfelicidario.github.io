"use client";

import type { CSSProperties, ReactNode } from "react";
import { clampLabel, suggestionIcon, type SuggestionKind } from "./SuggestionChips";
import { useDragScroll } from "./useDragScroll";

/**
 * An RBM rich card: media on top, title, description, then up to four suggestions as
 * full-width rows inside the card, the way Google Messages draws them: a lighter rounded row
 * on the card's tonal ground, the action's icon in a small circle at the left, label left-aligned.
 * Media heights follow Google's spec: short 112, medium 168, tall 264 dp. A standalone vertical
 * card spans the screen width minus the 16 dp margins.
 */
export type CardSuggestion = {
  label: string;
  kind?: SuggestionKind;
  onSelect?: () => void;
  /** rendered inside the (positioned) button, over the label: a focus ring, a hint pulse */
  overlay?: ReactNode;
};

export type RichCardProps = {
  title: string;
  /** a string, or a few lines of your own */
  description?: ReactNode;
  /** anything (an illustration, an <img>); a brand gradient placeholder renders when omitted */
  media?: ReactNode;
  mediaHeight?: "short" | "medium" | "tall";
  /** small text at the right of the title, e.g. a price */
  meta?: string;
  suggestions?: CardSuggestion[];
  /** CSS width; default fills the thread width */
  width?: number | string;
  disabled?: boolean;
  style?: CSSProperties;
};

export const MEDIA_HEIGHT = { short: 112, medium: 168, tall: 264 } as const;
export const CARD_RADIUS = 24;

export function RichCard({
  title,
  description,
  media,
  mediaHeight = "medium",
  meta,
  suggestions = [],
  width = "100%",
  disabled = false,
  style,
}: RichCardProps) {
  const actions = suggestions.slice(0, 4);
  return (
    <div
      style={{
        alignSelf: "flex-start",
        display: "flex",
        flexDirection: "column",
        width,
        maxWidth: "100%",
        overflow: "hidden",
        borderRadius: CARD_RADIUS,
        background: "var(--ph-surface-high)",
        color: "var(--ph-on-surface)",
        ...style,
      }}
    >
      <div aria-hidden="true" style={{ height: MEDIA_HEIGHT[mediaHeight], overflow: "hidden", flexShrink: 0 }}>
        {media ?? <MediaPlaceholder />}
      </div>
      <div style={{ padding: `12px 14px ${actions.length ? 10 : 14}px` }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
          <div style={{ fontSize: 16, fontWeight: 500, lineHeight: "22px" }}>{title}</div>
          {meta && <div style={{ fontSize: 14, fontWeight: 500, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{meta}</div>}
        </div>
        {description && (
          <div style={{ margin: "4px 0 0", fontSize: 14, lineHeight: "19px", color: "var(--ph-on-surface-variant)" }}>{description}</div>
        )}
      </div>
      {actions.length > 0 && (
        <>
          <style href="ph-card-action" precedence="default">
            {"[data-ph-card-action]:not(:disabled):hover{background:color-mix(in srgb,var(--ph-brand) 8%,var(--ph-surface))}"}
          </style>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "0 10px 10px" }}>
            {actions.map((s) => {
              const off = disabled || !s.onSelect;
              const icon = suggestionIcon(s.kind, 16);
              return (
                <button
                  key={s.label}
                  type="button"
                  data-ph-card-action=""
                  onClick={s.onSelect}
                  disabled={off}
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    minHeight: 44,
                    margin: 0,
                    padding: icon ? "6px 14px 6px 8px" : "6px 14px",
                    border: 0,
                    borderRadius: 16,
                    background: "var(--ph-surface)",
                    font: "inherit",
                    fontSize: 14,
                    fontWeight: 500,
                    lineHeight: "18px",
                    textAlign: "left",
                    color: "var(--ph-on-surface)",
                    cursor: off ? "not-allowed" : "pointer",
                    transition: "background 150ms",
                  }}
                >
                  {icon && (
                    <span
                      aria-hidden="true"
                      style={{
                        display: "grid",
                        width: 32,
                        height: 32,
                        flexShrink: 0,
                        placeItems: "center",
                        borderRadius: 999,
                        background: "var(--ph-surface-high)",
                        color: "var(--ph-on-surface-variant)",
                      }}
                    >
                      {icon}
                    </span>
                  )}
                  <span style={{ minWidth: 0, overflowWrap: "anywhere" }}>{clampLabel(s.label)}</span>
                  {s.overlay}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/** a brand-tinted gradient standing in for a photo; pass `seed` to vary the angle per card */
export function MediaPlaceholder({ seed = 0, style }: { seed?: number; style?: CSSProperties }) {
  const angle = 135 + ((seed * 70) % 180);
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: `linear-gradient(${angle}deg, var(--ph-brand) 0%, color-mix(in srgb, var(--ph-brand) 55%, var(--ph-bg)) 55%, var(--ph-surface-high) 100%)`,
        ...style,
      }}
    />
  );
}

/**
 * A carousel of 2 to 10 vertical cards in one horizontal row that scrolls with the scrollbar
 * hidden: natively on touch and pen, by click-and-drag with the mouse, and snapping to a card
 * once the gesture ends. Google fixes card widths at small 180 or medium 296 dp; pass
 * `cardWidth` (any CSS width, e.g. "72%") to size cards to the row instead. `bleed` works as
 * on `SuggestionChips`: the row runs to the parent's edge and pads by the same amount, so the
 * next card peeks in at the edge.
 */
export function RichCardCarousel({
  cards,
  size = "small",
  cardWidth,
  bleed = 0,
  gap = 8,
  disabled,
  label = "Cards",
}: {
  cards: Omit<RichCardProps, "width">[];
  size?: "small" | "medium";
  /** overrides `size` */
  cardWidth?: number | string;
  /** CSS px the row bleeds past its parent on both sides; pass the parent's horizontal padding */
  bleed?: number;
  gap?: number;
  disabled?: boolean;
  label?: string;
}) {
  const { dragging, handlers } = useDragScroll<HTMLDivElement>();
  const w = cardWidth ?? (size === "medium" ? 296 : 180);
  const padX = bleed > 0 ? bleed : 16;
  return (
    <div
      role="group"
      aria-label={label}
      data-ph-scroller=""
      {...handlers}
      style={{
        display: "flex",
        gap,
        alignSelf: "stretch",
        flexShrink: 0,
        margin: bleed > 0 ? `0 ${-bleed}px` : 0,
        padding: `0 ${padX}px`,
        overflowX: "auto",
        overflowY: "hidden",
        scrollbarWidth: "none",
        // snapping is off while the mouse drags, so the row follows the pointer instead of jumping
        scrollSnapType: dragging ? "none" : "x mandatory",
        scrollPaddingLeft: padX,
        touchAction: "pan-x",
        overscrollBehaviorX: "contain",
        cursor: dragging ? "grabbing" : undefined,
        userSelect: dragging ? "none" : undefined,
        WebkitUserSelect: dragging ? "none" : undefined,
      }}
    >
      <style href="ph-carousel" precedence="default">
        {"[data-ph-scroller]::-webkit-scrollbar{display:none}"}
      </style>
      {cards.slice(0, 10).map((c, k) => (
        <RichCard
          key={c.title}
          {...c}
          media={c.media ?? <MediaPlaceholder seed={k} />}
          width={w}
          disabled={disabled}
          style={{ flexShrink: 0, scrollSnapAlign: "start", pointerEvents: dragging ? "none" : undefined, ...c.style }}
        />
      ))}
    </div>
  );
}
