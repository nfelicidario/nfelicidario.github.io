"use client";

import type { CSSProperties, ReactNode } from "react";
import { clampLabel, emojiGlyph, suggestionIcon, type SuggestionKind } from "./SuggestionChips";
import { useDragScroll } from "./useDragScroll";

/**
 * An RBM rich card, as Google Messages draws it: a tonal card (`--ph-surface-high`, the same
 * tier as the agent's bubbles) with 20 px corners and no outline, the media cropped to the
 * top edge to edge, the title (17 px, medium) and description (16 px, regular, on-surface)
 * inset 16 px, then up to four suggestions as full-width rows inside the card. Each row is a
 * lighter 56 px pill-cornered surface (`--ph-surface`, 16 px radius) with the card's tone
 * showing through as a hairline between rows; an action's icon sits in a 40 px tonal circle
 * at the left, then the label, left-aligned, in the plain on-surface color (no brand color
 * anywhere on the card). A reply row with a leading emoji shows the emoji in the icon's place
 * at the label's size, no circle. Media heights follow Google's spec: short 112, medium 168,
 * tall 264 dp (the references show 2:1 media on full-width cards, which is medium). A
 * standalone vertical card spans the thread width.
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
  /** anything (an illustration, an <img>); a neutral gradient placeholder renders when omitted */
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
export const CARD_RADIUS = 20;
/** an action row's height and corner radius */
export const CARD_ROW_HEIGHT = 56;
export const CARD_ROW_RADIUS = 16;
/** the gap between rows: the card's tone showing through as a hairline */
const ROW_GAP = 3;
/** the card's inner inset, body and rows alike */
const CARD_INSET = 16;
const ROW_ICON_CIRCLE = 40;

/** a leading emoji on a reply label, split off so it can sit in the icon's place */
function splitEmoji(label: string): { emoji: string | null; rest: string } {
  const m = /^(\p{Extended_Pictographic}(?:️|‍\p{Extended_Pictographic})*)\s+(.*)$/u.exec(label);
  return m ? { emoji: m[1], rest: m[2] } : { emoji: null, rest: label };
}

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
      {/* the body grows, so the rows sit at the bottom when a carousel stretches the card */}
      <div style={{ flex: 1, padding: `${CARD_INSET}px ${CARD_INSET}px ${actions.length ? 14 : CARD_INSET}px` }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
          <div style={{ fontSize: 17, fontWeight: 500, lineHeight: "24px", overflowWrap: "anywhere" }}>{title}</div>
          {meta && <div style={{ fontSize: 15, fontWeight: 500, lineHeight: "24px", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{meta}</div>}
        </div>
        {description && <div style={{ margin: "4px 0 0", fontSize: 16, lineHeight: "22px", color: "var(--ph-on-surface)" }}>{description}</div>}
      </div>
      {actions.length > 0 && (
        <>
          <style href="ph-card-action" precedence="default">
            {"[data-ph-card-action]:not(:disabled):hover{background:var(--ph-surface-low)}"}
          </style>
          <div style={{ display: "flex", flexDirection: "column", gap: ROW_GAP, padding: `0 ${CARD_INSET}px ${CARD_INSET}px` }}>
            {actions.map((s) => {
              const off = disabled || !s.onSelect;
              const icon = suggestionIcon(s.kind, 22);
              const { emoji, rest } = icon ? { emoji: null, rest: s.label } : splitEmoji(s.label);
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
                    gap: icon ? 15 : 10,
                    minHeight: CARD_ROW_HEIGHT,
                    margin: 0,
                    padding: `6px ${CARD_INSET}px`,
                    border: 0,
                    borderRadius: CARD_ROW_RADIUS,
                    background: "var(--ph-surface)",
                    font: "inherit",
                    fontSize: 16,
                    fontWeight: 400,
                    lineHeight: "22px",
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
                        width: ROW_ICON_CIRCLE,
                        height: ROW_ICON_CIRCLE,
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
                  {emoji && emojiGlyph(emoji, 20)}
                  <span style={{ minWidth: 0, overflowWrap: "anywhere" }}>{clampLabel(emoji ? rest : s.label)}</span>
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

/** a neutral gray gradient standing in for a photo; pass `seed` to vary the angle per card, or `style` to override it */
export function MediaPlaceholder({ seed = 0, style }: { seed?: number; style?: CSSProperties }) {
  const angle = 135 + ((seed * 70) % 180);
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: `linear-gradient(${angle}deg, var(--ph-outline-variant) 0%, var(--ph-surface-high) 55%, var(--ph-surface-low) 100%)`,
        ...style,
      }}
    />
  );
}

/**
 * A carousel of 2 to 10 vertical cards in one horizontal row that scrolls with the scrollbar
 * hidden: natively on touch and pen, by click-and-drag with the mouse, and snapping to a card
 * once the gesture ends. Google fixes card widths at small 180 or medium 296 dp (Messages
 * draws the medium width with the next card peeking in at the right edge, 8 dp apart); pass
 * `cardWidth` (any CSS width, e.g. "72%") to size cards to the row instead. Every card
 * stretches to the tallest, as Messages does. `bleed` works as on `SuggestionChips`: the row
 * runs to the parent's edge and pads by the same amount, so the next card peeks in at the edge.
 */
export function RichCardCarousel({
  cards,
  size = "medium",
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
        alignItems: "stretch",
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
          style={{ alignSelf: "stretch", flexShrink: 0, scrollSnapAlign: "start", pointerEvents: dragging ? "none" : undefined, ...c.style }}
        />
      ))}
    </div>
  );
}
