"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { CalendarPlus, Globe, LocateFixed, MapPin, Phone } from "lucide-react";
import { useDragScroll } from "./useDragScroll";

/**
 * Suggested replies and suggested actions, rendered as Material 3 outlined chips in one
 * horizontal row above the composer: neutral outline, neutral text, 36 px tall (8 px of
 * vertical padding around the label). The row never wraps: it overflows with the scrollbar
 * hidden, scrolls natively on touch, and can be dragged with the mouse (`useDragScroll`). Soft fades on the
 * edges hint at more chips: the right fade while there is more to scroll to, the left fade
 * once the row has been scrolled. `bleed` lets the row clip at its parent's edge instead
 * of at its own padding box.
 * Google allows up to 11 per message, labels up to 25 characters. Actions carry an icon:
 * dial, open URL, view location, share location, create calendar event. A reply can carry
 * an `emoji` as its leading glyph instead.
 */
export type SuggestionKind = "reply" | "dial" | "url" | "location" | "share-location" | "calendar";

export type Suggestion = {
  label: string;
  kind?: SuggestionKind;
  /** a leading emoji, in the icon's place (replies only; an action keeps its icon) */
  emoji?: string;
  selected?: boolean;
};

export type SuggestionChipsProps = {
  suggestions: Suggestion[];
  onSelect?: (index: number) => void;
  disabled?: boolean;
  label?: string;
  /**
   * CSS px the row bleeds past its parent on both sides (a negative margin), with the same
   * amount of horizontal padding put back, so chips clip at the parent's edge rather than
   * mid-row. Pass the parent's horizontal padding. 0 keeps the row inside the parent.
   */
  bleed?: number;
};

export const MAX_SUGGESTIONS = 11;
export const MAX_LABEL = 25;

/** Google's 25-character cap, counted in code points so an emoji is never cut in half */
export function clampLabel(label: string, max = MAX_LABEL): string {
  return Array.from(label).slice(0, max).join("");
}

const FADE_WIDTH = 32;
/** horizontal padding when the row is not bleeding */
const ROW_PAD_X = 16;
/** a chip's vertical padding; with the 18 px label line and the 1 px border it stands `CHIP_HEIGHT` tall */
const CHIP_PAD_Y = 8;
export const CHIP_HEIGHT = 36;

export function suggestionIcon(kind: SuggestionKind | undefined, size = 18): ReactNode {
  const p = { size, "aria-hidden": true as const, style: { flexShrink: 0 } };
  switch (kind) {
    case "dial":
      return <Phone {...p} />;
    case "url":
      return <Globe {...p} />;
    case "location":
      return <MapPin {...p} />;
    case "share-location":
      return <LocateFixed {...p} />;
    case "calendar":
      return <CalendarPlus {...p} />;
    default:
      return null;
  }
}

/** an emoji sized and aligned like the 18px action icons */
export function emojiGlyph(emoji: string, size = 16): ReactNode {
  return (
    <span aria-hidden="true" style={{ flexShrink: 0, fontSize: size, lineHeight: 1 }}>
      {emoji}
    </span>
  );
}

export function SuggestionChips({ suggestions, onSelect, disabled = false, label = "Suggestions", bleed = 0 }: SuggestionChipsProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const { dragging, handlers } = useDragScroll<HTMLDivElement>();
  const [overflowLeft, setOverflowLeft] = useState(false);
  const [overflowRight, setOverflowRight] = useState(false);

  const count = Math.min(suggestions.length, MAX_SUGGESTIONS);

  /** the fades show only while there is more to that side */
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const update = () => {
      setOverflowLeft(el.scrollLeft > 1);
      setOverflowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [count]);

  if (!count) return null;

  const left = overflowLeft ? `transparent, #000 ${FADE_WIDTH}px` : "#000";
  const right = overflowRight ? `#000 calc(100% - ${FADE_WIDTH}px), transparent` : "#000";
  const fade = overflowLeft || overflowRight ? `linear-gradient(to right, ${left}, ${right})` : undefined;
  const padX = bleed > 0 ? bleed : ROW_PAD_X;

  return (
    <div
      ref={scroller}
      role="group"
      aria-label={label}
      data-ph-scroller=""
      {...handlers}
      style={{
        display: "flex",
        flexShrink: 0,
        flexWrap: "nowrap",
        gap: 8,
        margin: bleed > 0 ? `0 ${-bleed}px` : 0,
        padding: `6px ${padX}px 8px`,
        overflowX: "auto",
        overflowY: "hidden",
        scrollbarWidth: "none",
        touchAction: "pan-x",
        overscrollBehaviorX: "contain",
        cursor: dragging ? "grabbing" : undefined,
        userSelect: dragging ? "none" : undefined,
        WebkitUserSelect: dragging ? "none" : undefined,
        maskImage: fade,
        WebkitMaskImage: fade,
      }}
    >
      <style href="ph-chips" precedence="default">
        {"[data-ph-scroller]::-webkit-scrollbar{display:none}" +
          "[data-ph-chip]:not(:disabled):hover{background:color-mix(in srgb,var(--ph-on-surface) 6%,transparent);border-color:var(--ph-outline)}" +
          '[data-ph-chip][aria-pressed="true"]:not(:disabled):hover{background:var(--ph-surface-high);border-color:var(--ph-outline)}'}
      </style>
      {suggestions.slice(0, MAX_SUGGESTIONS).map((s, i) => {
        const off = disabled || !onSelect;
        const glyph = s.kind && s.kind !== "reply" ? suggestionIcon(s.kind) : s.emoji ? emojiGlyph(s.emoji) : null;
        return (
          <button
            key={s.label}
            type="button"
            data-ph-chip=""
            onClick={() => onSelect?.(i)}
            disabled={off}
            aria-pressed={s.selected}
            style={{
              display: "inline-flex",
              minHeight: CHIP_HEIGHT,
              flexShrink: 0,
              alignItems: "center",
              gap: 6,
              margin: 0,
              padding: `${CHIP_PAD_Y}px ${glyph ? 14 : 16}px ${CHIP_PAD_Y}px ${glyph ? 10 : 16}px`,
              borderRadius: 999,
              border: `1px solid ${s.selected ? "var(--ph-outline)" : "var(--ph-outline-variant)"}`,
              background: s.selected ? "var(--ph-surface-high)" : "transparent",
              font: "inherit",
              fontSize: 14,
              fontWeight: 500,
              lineHeight: "18px",
              letterSpacing: 0.1,
              whiteSpace: "nowrap",
              color: "var(--ph-on-surface)",
              opacity: disabled && !s.selected ? 0.5 : 1,
              cursor: dragging ? "grabbing" : off ? "not-allowed" : "pointer",
              pointerEvents: dragging ? "none" : undefined,
              transition: "background 150ms, border-color 150ms, opacity 150ms",
            }}
          >
            {glyph}
            {clampLabel(s.label)}
          </button>
        );
      })}
    </div>
  );
}
