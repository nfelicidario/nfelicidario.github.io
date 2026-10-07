"use client";

import type { ReactNode } from "react";
import { CalendarPlus, ExternalLink, LocateFixed, MapPin, Phone } from "lucide-react";

/**
 * Suggested replies and suggested actions, rendered as Material 3 outlined chips in a row
 * above the composer. Google allows up to 11 per message, labels up to 25 characters.
 * Actions carry an icon: dial, open URL, view location, share location, create calendar event.
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
  /** wrap onto several lines instead of scrolling horizontally */
  wrap?: boolean;
  label?: string;
};

export const MAX_SUGGESTIONS = 11;
export const MAX_LABEL = 25;

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

export function SuggestionChips({ suggestions, onSelect, disabled = false, wrap = false, label = "Suggestions" }: SuggestionChipsProps) {
  if (!suggestions.length) return null;
  return (
    <div
      role="group"
      aria-label={label}
      style={{
        display: "flex",
        flexShrink: 0,
        flexWrap: wrap ? "wrap" : "nowrap",
        gap: 8,
        padding: "6px 16px 8px",
        overflowX: wrap ? undefined : "auto",
        scrollbarWidth: "none",
      }}
    >
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
            cursor: disabled || !onSelect ? "default" : "pointer",
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
