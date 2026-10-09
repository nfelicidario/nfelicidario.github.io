"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { BatteryFull, Signal, Wifi } from "lucide-react";

/**
 * A Pixel-style Android phone frame. The screen is laid out at a fixed logical size
 * (360 x 780 "dp") and zoomed to fit its container, so every child renders at phone
 * proportions whatever the frame's on-page width. `zoom` (not `transform`) keeps layout,
 * hit testing, and motion layout animations honest.
 *
 * Colors are phone-local CSS variables (Material 3 roles: surface, surface containers,
 * on-surface, outline), with light and dark variants. The surfaces are fixed neutrals, and
 * `--ph-accent` is the phone's own system accent (the Material dynamic-color primary that
 * Messages paints chip icons with), fixed to a Google blue, not the brand; `brandColor`
 * reaches exactly three things: the hero band on the agent details screen, the
 * verified badge, and the user's reply bubbles. The screen ground (`--ph-bg`) is the
 * surface-container tier that the status bar, header, and composer share; `ConversationPanel`
 * and `AgentInfo` sit on it as a lighter `--ph-surface` panel. Nothing here reads the site's
 * Tailwind tokens, so the mockup looks the same on any page.
 */

export const PHONE = {
  screenW: 360,
  screenH: 780,
  bezel: 10,
  frameW: 380,
  frameH: 800,
  frameRadius: 48,
  screenRadius: 38,
} as const;

export const PHONE_FONT = 'Roboto, "Google Sans", system-ui, sans-serif';

export type PhoneTheme = "light" | "dark" | "auto";

export type AndroidPhoneProps = {
  children: ReactNode;
  /** #RRGGBB. Colors the agent details hero band, the verified badge, and the user's reply bubbles; nothing else. */
  brandColor?: string;
  /** "auto" follows the site's data-theme attribute, then prefers-color-scheme. */
  theme?: PhoneTheme;
  /** CSS px width of the frame. Omit to fill the container's width. */
  width?: number;
  /** "contain" also respects the container's height (the parent needs a definite height). */
  fit?: "width" | "contain";
  /** status bar clock */
  time?: string;
  /** accessible name for the screen region */
  label?: string;
  className?: string;
};

/**
 * Phone-local tokens for one theme. The surfaces are fixed neutral grays (no tint toward the
 * brand), so the brand color shows only where a component reads `--ph-brand` directly.
 */
export function phoneTokens(brand: string, theme: "light" | "dark"): CSSProperties {
  const light = {
    "--ph-brand": brand,
    "--ph-on-brand": "#ffffff",
    "--ph-accent": "#0b57d0",
    "--ph-bg": "#eceef2",
    "--ph-surface": "#ffffff",
    "--ph-surface-low": "#f5f6f8",
    "--ph-surface-high": "#e8e9ed",
    "--ph-on-surface": "#1b1c1f",
    "--ph-on-surface-variant": "#45474d",
    "--ph-outline": "#76777d",
    "--ph-outline-variant": "#c7c8cf",
    "--ph-frame": "#1b1d22",
    "--ph-frame-edge": "#3d4049",
    "--ph-cutout": "#07080b",
  };
  const dark = {
    "--ph-brand": brand,
    "--ph-on-brand": "#ffffff",
    "--ph-accent": "#a8c7fa",
    "--ph-bg": "#0e1014",
    "--ph-surface": "#1b1d22",
    "--ph-surface-low": "#24262b",
    "--ph-surface-high": "#2c2e34",
    "--ph-on-surface": "#e3e2e8",
    "--ph-on-surface-variant": "#c5c6cd",
    "--ph-outline": "#8f9097",
    "--ph-outline-variant": "#45474d",
    "--ph-frame": "#1b1d22",
    "--ph-frame-edge": "#3d4049",
    "--ph-cutout": "#07080b",
  };
  return (theme === "dark" ? dark : light) as CSSProperties;
}

/* ------------------------------------------------ site theme (for theme="auto") */

function readSiteTheme(): "light" | "dark" {
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "dark" || attr === "light") return attr;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function subscribeSiteTheme(onChange: () => void) {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", onChange);
  return () => {
    mo.disconnect();
    mq.removeEventListener("change", onChange);
  };
}

function useSiteTheme() {
  return useSyncExternalStore(subscribeSiteTheme, readSiteTheme, () => "light" as const);
}

/* ---------------------------------------------------------------- the frame */

export function AndroidPhone({
  children,
  brandColor = "#1F4FE0",
  theme = "light",
  width,
  fit = "width",
  time = "9:30",
  label = "Phone preview",
  className = "",
}: AndroidPhoneProps) {
  const site = useSiteTheme();
  const resolved = theme === "auto" ? site : theme;
  const boxRef = useRef<HTMLDivElement>(null);
  const [measured, setMeasured] = useState<number | null>(null);

  useEffect(() => {
    if (width !== undefined) return;
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width: w, height: h } = entry.contentRect;
      const byWidth = w / PHONE.frameW;
      const byHeight = h / PHONE.frameH;
      setMeasured(fit === "contain" ? Math.min(byWidth, byHeight) : byWidth);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [width, fit]);

  const scale = width !== undefined ? width / PHONE.frameW : measured;
  const ready = scale !== null && scale > 0;

  const boxStyle: CSSProperties =
    fit === "contain"
      ? { width: "100%", height: "100%", display: "grid", placeItems: "center" }
      : { width: width ?? "100%", aspectRatio: `${PHONE.frameW} / ${PHONE.frameH}` };
  const slotStyle: CSSProperties = ready
    ? { position: "relative", width: PHONE.frameW * (scale as number), height: PHONE.frameH * (scale as number) }
    : { position: "relative", width: "100%", height: "100%" };

  return (
    <div ref={boxRef} className={className} style={boxStyle}>
      <div style={slotStyle}>
        <div
          style={{
            ...phoneTokens(brandColor, resolved),
            position: "absolute",
            top: 0,
            left: 0,
            width: PHONE.frameW,
            height: PHONE.frameH,
            zoom: ready ? (scale as number) : 1,
            visibility: ready ? undefined : "hidden",
            fontFamily: PHONE_FONT,
            WebkitFontSmoothing: "antialiased",
            colorScheme: resolved,
            borderRadius: PHONE.frameRadius,
            padding: PHONE.bezel,
            background: "var(--ph-frame)",
            boxShadow:
              "inset 0 0 0 1.5px var(--ph-frame-edge), 0 2px 4px rgba(0,0,0,0.18), 0 30px 60px -24px rgba(0,0,0,0.45)",
            boxSizing: "border-box",
          }}
        >
          {/* side keys */}
          <span aria-hidden="true" style={{ ...key, right: -2.5, top: 170, height: 34 }} />
          <span aria-hidden="true" style={{ ...key, right: -2.5, top: 230, height: 64 }} />

          <div
            role="region"
            aria-label={label}
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              width: PHONE.screenW,
              height: PHONE.screenH,
              overflow: "hidden",
              borderRadius: PHONE.screenRadius,
              background: "var(--ph-bg)",
              color: "var(--ph-on-surface)",
              fontSize: 15,
              lineHeight: 1.35,
            }}
          >
            <StatusBar time={time} />
            <div style={{ position: "relative", display: "flex", minHeight: 0, flex: 1, flexDirection: "column" }}>{children}</div>
            {/* overlays the bottom of whatever screen is showing, so panels can run to the edge */}
            <GestureBar />
          </div>
        </div>
      </div>
    </div>
  );
}

const key: CSSProperties = {
  position: "absolute",
  width: 3,
  borderRadius: 2,
  background: "var(--ph-frame-edge)",
};

/* ------------------------------------------------------------- system bars */

function StatusBar({ time }: { time: string }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "relative",
        display: "flex",
        height: 38,
        flexShrink: 0,
        alignItems: "center",
        justifyContent: "space-between",
        padding: "6px 24px 0",
        fontSize: 14,
        fontWeight: 500,
        letterSpacing: 0.1,
        color: "var(--ph-on-surface)",
      }}
    >
      <span style={{ fontVariantNumeric: "tabular-nums" }}>{time}</span>
      {/* pill camera cutout */}
      <span
        style={{
          position: "absolute",
          left: "50%",
          top: 10,
          width: 40,
          height: 13,
          transform: "translateX(-50%)",
          borderRadius: 999,
          background: "var(--ph-cutout)",
        }}
      />
      <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <Signal size={14} strokeWidth={2.4} />
        <Wifi size={14} strokeWidth={2.4} />
        <BatteryFull size={16} strokeWidth={2.2} />
      </span>
    </div>
  );
}

/** height of the gesture area; screens that run to the bottom pad by this much */
export const GESTURE_BAR_H = 22;

function GestureBar() {
  return (
    <div
      aria-hidden="true"
      style={{ position: "absolute", left: 0, right: 0, bottom: 0, display: "grid", height: GESTURE_BAR_H, placeItems: "center", pointerEvents: "none" }}
    >
      <span style={{ width: 110, height: 4, borderRadius: 999, background: "var(--ph-on-surface)", opacity: 0.75 }} />
    </div>
  );
}
