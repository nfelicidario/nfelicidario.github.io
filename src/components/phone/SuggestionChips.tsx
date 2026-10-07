"use client";

import { useEffect, useRef, useState, type MouseEvent, type PointerEvent, type ReactNode } from "react";
import { CalendarPlus, ExternalLink, LocateFixed, MapPin, Phone } from "lucide-react";

/**
 * Suggested replies and suggested actions, rendered as Material 3 outlined chips in one
 * horizontal row above the composer. The row never wraps: it overflows with the scrollbar
 * hidden, scrolls natively on touch, and can be dragged with the mouse. A soft fade on the
 * right edge hints at more chips while there is something to scroll to.
 * Google allows up to 11 per message, labels up to 25 characters. Actions carry an icon:
 * dial, open URL, view location, share location, create calendar event.
 */
export type SuggestionKind = "reply" | "dial" | "url" | "location" | "share-location" | "calendar";

export type Suggestion = {
  label: string;
  kind?: SuggestionKind;
  selected?: boolean;
};

export type SuggestionChipsProps = {
  suggestions: Suggestion[];
  onSelect?: (index: number) => void;
  disabled?: boolean;
  label?: string;
};

export const MAX_SUGGESTIONS = 11;
export const MAX_LABEL = 25;

/** a mouse drag longer than this (CSS px) scrolls instead of tapping */
const DRAG_THRESHOLD = 4;
const FADE_WIDTH = 32;

export function suggestionIcon(kind: SuggestionKind | undefined, size = 18): ReactNode {
  const p = { size, "aria-hidden": true as const, style: { flexShrink: 0 } };
  switch (kind) {
    case "dial":
      return <Phone {...p} />;
    case "url":
      return <ExternalLink {...p} />;
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

type Drag = { pointerId: number; startX: number; startScroll: number; scale: number; moved: boolean };

export function SuggestionChips({ suggestions, onSelect, disabled = false, label = "Suggestions" }: SuggestionChipsProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const drag = useRef<Drag | null>(null);
  /** set after a drag so the click that follows the pointerup does not tap a chip */
  const swallowClick = useRef(false);
  const [dragging, setDragging] = useState(false);
  const [overflowRight, setOverflowRight] = useState(false);

  const count = Math.min(suggestions.length, MAX_SUGGESTIONS);

  /** the fade shows only while there is more to the right */
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const update = () => setOverflowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
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

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    // touch and pen scroll natively; only the mouse needs drag-to-scroll
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = e.currentTarget;
    if (el.scrollWidth <= el.clientWidth) return;
    // the phone is zoomed, so pointer deltas (screen px) must be scaled to scroll units
    const scale = el.offsetWidth ? el.getBoundingClientRect().width / el.offsetWidth : 1;
    drag.current = { pointerId: e.pointerId, startX: e.clientX, startScroll: el.scrollLeft, scale: scale || 1, moved: false };
    el.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d || e.pointerId !== d.pointerId) return;
    const dx = e.clientX - d.startX;
    if (!d.moved && Math.abs(dx) > DRAG_THRESHOLD) {
      d.moved = true;
      setDragging(true);
    }
    if (d.moved) {
      e.preventDefault();
      e.currentTarget.scrollLeft = d.startScroll - dx / d.scale;
    }
  }

  function endDrag(e: PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d || e.pointerId !== d.pointerId) return;
    drag.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    if (d.moved) {
      setDragging(false);
      swallowClick.current = true;
      // a click follows pointerup synchronously; clear the flag if none arrives
      setTimeout(() => {
        swallowClick.current = false;
      }, 0);
    }
  }

  function onClickCapture(e: MouseEvent<HTMLDivElement>) {
    if (!swallowClick.current) return;
    swallowClick.current = false;
    e.preventDefault();
    e.stopPropagation();
  }

  const fade = `linear-gradient(to right, #000 calc(100% - ${FADE_WIDTH}px), transparent)`;

  return (
    <div
      ref={scroller}
      role="group"
      aria-label={label}
      data-ph-scroller=""
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClickCapture={onClickCapture}
      style={{
        display: "flex",
        flexShrink: 0,
        flexWrap: "nowrap",
        gap: 8,
        padding: "6px 16px 8px",
        overflowX: "auto",
        overflowY: "hidden",
        scrollbarWidth: "none",
        touchAction: "pan-x",
        overscrollBehaviorX: "contain",
        cursor: dragging ? "grabbing" : undefined,
        userSelect: dragging ? "none" : undefined,
        WebkitUserSelect: dragging ? "none" : undefined,
        maskImage: overflowRight ? fade : undefined,
        WebkitMaskImage: overflowRight ? fade : undefined,
      }}
    >
      <style href="ph-chips-scrollbar" precedence="default">{"[data-ph-scroller]::-webkit-scrollbar{display:none}"}</style>
      {suggestions.slice(0, MAX_SUGGESTIONS).map((s, i) => (
        <button
          key={s.label}
          type="button"
          onClick={() => onSelect?.(i)}
          disabled={disabled || !onSelect}
          aria-pressed={s.selected}
          style={{
            display: "inline-flex",
            height: 32,
            flexShrink: 0,
            alignItems: "center",
            gap: 6,
            margin: 0,
            padding: `0 ${s.kind && s.kind !== "reply" ? 14 : 16}px 0 ${s.kind && s.kind !== "reply" ? 10 : 16}px`,
            borderRadius: 999,
            border: `1px solid ${s.selected ? "var(--ph-brand)" : "var(--ph-outline-variant)"}`,
            background: s.selected ? "var(--ph-brand-soft)" : "transparent",
            font: "inherit",
            fontSize: 14,
            fontWeight: 500,
            lineHeight: 1,
            letterSpacing: 0.1,
            whiteSpace: "nowrap",
            color: "var(--ph-brand-text)",
            opacity: disabled && !s.selected ? 0.5 : 1,
            cursor: dragging ? "grabbing" : disabled || !onSelect ? "default" : "pointer",
            pointerEvents: dragging ? "none" : undefined,
            transition: "background 150ms, opacity 150ms",
          }}
        >
          {suggestionIcon(s.kind)}
          {s.label.slice(0, MAX_LABEL)}
        </button>
      ))}
    </div>
  );
}
