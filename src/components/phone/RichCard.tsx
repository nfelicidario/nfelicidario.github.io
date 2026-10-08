"use client";

import type { CSSProperties, ReactNode } from "react";
import { suggestionIcon, type SuggestionKind } from "./SuggestionChips";

/**
 * An RBM rich card: media on top, title, description, then up to four suggestions as
 * full-width text buttons. Media heights follow Google's spec: short 112, medium 168,
 * tall 264 dp. A standalone vertical card spans the screen width minus the 16 dp margins.
 */
export type CardSuggestion = { label: string; kind?: SuggestionKind; onSelect?: () => void };

export type RichCardProps = {
  title: string;
  description?: string;
  /** anything; a brand gradient placeholder renders when omitted */
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
  return (
    <div
      style={{
        alignSelf: "flex-start",
        display: "flex",
        flexDirection: "column",
        width,
        maxWidth: "100%",
        overflow: "hidden",
        borderRadius: 24,
        background: "var(--ph-surface-high)",
        color: "var(--ph-on-surface)",
        ...style,
      }}
    >
      <div aria-hidden="true" style={{ height: MEDIA_HEIGHT[mediaHeight], overflow: "hidden", flexShrink: 0 }}>
        {media ?? <MediaPlaceholder />}
      </div>
      <div style={{ padding: "12px 16px 14px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
          <div style={{ fontSize: 16, fontWeight: 500, lineHeight: "22px" }}>{title}</div>
          {meta && <div style={{ fontSize: 14, fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>{meta}</div>}
        </div>
        {description && (
          <p style={{ margin: "4px 0 0", fontSize: 14, lineHeight: "19px", color: "var(--ph-on-surface-variant)" }}>{description}</p>
        )}
      </div>
      {suggestions.length > 0 && (
        <style href="ph-card-action" precedence="default">
          {"[data-ph-card-action]:not(:disabled):hover{background:color-mix(in srgb,var(--ph-brand) 8%,transparent)}"}
        </style>
      )}
      {suggestions.slice(0, 4).map((s) => {
        const off = disabled || !s.onSelect;
        return (
          <button
            key={s.label}
            type="button"
            data-ph-card-action=""
            onClick={s.onSelect}
            disabled={off}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              height: 44,
              margin: 0,
              padding: "0 16px",
              border: 0,
              borderTop: "1px solid var(--ph-outline-variant)",
              background: "transparent",
              font: "inherit",
              fontSize: 14,
              fontWeight: 500,
              color: "var(--ph-brand-text)",
              cursor: off ? "not-allowed" : "pointer",
              transition: "background 150ms",
            }}
          >
            {suggestionIcon(s.kind, 16)}
            {s.label.slice(0, 25)}
          </button>
        );
      })}
    </div>
  );
}

/** a brand-tinted gradient standing in for a photo */
export function MediaPlaceholder({ style }: { style?: CSSProperties }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background:
          "linear-gradient(135deg, var(--ph-brand) 0%, color-mix(in srgb, var(--ph-brand) 55%, var(--ph-bg)) 55%, var(--ph-surface-high) 100%)",
        ...style,
      }}
    />
  );
}

/**
 * A carousel of 2 to 10 vertical cards. Google fixes card widths: small 180 dp, medium 296 dp.
 * The row scrolls horizontally; cards share the tallest card's height.
 */
export function RichCardCarousel({
  cards,
  size = "small",
  disabled,
}: {
  cards: Omit<RichCardProps, "width">[];
  size?: "small" | "medium";
  disabled?: boolean;
}) {
  const w = size === "medium" ? 296 : 180;
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        alignSelf: "stretch",
        overflowX: "auto",
        margin: "0 -16px",
        padding: "0 16px",
        scrollbarWidth: "none",
        scrollSnapType: "x mandatory",
      }}
    >
      {cards.slice(0, 10).map((c) => (
        <RichCard key={c.title} {...c} width={w} disabled={disabled} style={{ flexShrink: 0, scrollSnapAlign: "start", ...c.style }} />
      ))}
    </div>
  );
}
