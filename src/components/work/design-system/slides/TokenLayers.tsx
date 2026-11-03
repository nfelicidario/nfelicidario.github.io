"use client";

import { useState } from "react";
import { ArrowRight, Braces, Check, Paintbrush, PenTool, ShieldCheck } from "lucide-react";

/*
 * Slide 6: the token layers. Pick a brand colour and watch it flow raw → role → component, with the
 * contrast check running live against WCAG 2.2 AA. Values are illustrative.
 */

const BRANDS: { name: string; hex: string }[] = [
  { name: "Blue", hex: "#1f4fe0" },
  { name: "Violet", hex: "#6b3fd6" },
  { name: "Teal", hex: "#0f766e" },
  { name: "Amber", hex: "#f5b700" },
];

function luminance(hex: string) {
  const c = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a: string, b: string) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

export function TokenLayers() {
  const [brand, setBrand] = useState(BRANDS[0]);
  const onWhite = contrast(brand.hex, "#ffffff");
  const onBlack = contrast(brand.hex, "#0b1b33");
  const fg = onWhite >= onBlack ? "#ffffff" : "#0b1b33";
  const ratio = Math.max(onWhite, onBlack);
  const passes = ratio >= 4.5;

  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <div className="bubble-sm border border-rule bg-bg p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <span className="label">Three layers, one change</span>
          <span role="group" aria-label="Brand colour" className="flex items-center gap-1.5">
            {BRANDS.map((b) => (
              <button
                key={b.hex}
                type="button"
                title={b.name}
                aria-pressed={brand.hex === b.hex}
                onClick={() => setBrand(b)}
                className={`h-6 w-6 rounded-full border-2 transition-transform ${brand.hex === b.hex ? "scale-110 border-ink" : "border-transparent"}`}
                style={{ background: b.hex }}
              >
                <span className="sr-only">{b.name}</span>
              </button>
            ))}
          </span>
        </div>
        <div className="grid items-center gap-2 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
          <Layer title="Raw" sub="values">
            <Row k="brand.500" v={brand.hex} swatch={brand.hex} />
            <Row k="neutral.900" v="#0b1b33" swatch="#0b1b33" />
            <Row k="neutral.100" v="#eef2f8" swatch="#eef2f8" />
          </Layer>
          <ArrowRight size={14} className="mx-auto text-muted" aria-hidden="true" />
          <Layer title="Role" sub="what it's for">
            <Row k="action.bg" v="brand.500" swatch={brand.hex} />
            <Row k="text.default" v="neutral.900" swatch="#0b1b33" />
            <Row k="surface.page" v="neutral.100" swatch="#eef2f8" />
          </Layer>
          <ArrowRight size={14} className="mx-auto text-muted" aria-hidden="true" />
          <Layer title="Component" sub="where it lands">
            <Row k="button.bg" v="action.bg" swatch={brand.hex} />
            <Row k="button.text" v="action.fg" swatch={fg} />
            <Row k="link.text" v="action.bg" swatch={brand.hex} />
          </Layer>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-[10px] border border-rule bg-surface p-3">
          <span className="label text-muted">Preview</span>
          <span className="rounded-[8px] px-3 py-1.5 text-[12.5px] font-semibold transition-colors duration-500" style={{ background: brand.hex, color: fg }}>
            Save changes
          </span>
          <span className="text-[12.5px] font-medium underline-offset-2 transition-colors duration-500" style={{ color: brand.hex }}>
            View report
          </span>
          <span className="rounded-full px-2 py-0.5 text-[11.5px] font-semibold transition-colors duration-500" style={{ background: `${brand.hex}22`, color: brand.hex }}>
            Active
          </span>
          <span className={`label ml-auto inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${passes ? "bg-ok-soft text-ok" : "bg-warn-soft text-warn"}`}>
            <ShieldCheck size={11} aria-hidden="true" />
            <span className="num">{ratio.toFixed(1)}:1</span> {passes ? "AA" : "below AA"}
          </span>
        </div>
        <p className="mt-2 text-[12px] leading-snug text-muted">Changing a brand colour is a one-line change in the raw layer. Everything downstream follows, and the contrast check runs on every build.</p>
      </div>

      <div className="grid content-start gap-3">
        <div className="bubble-sm border border-rule bg-bg p-4">
          <div className="label mb-2">What the foundations cover</div>
          <ul className="grid gap-1 text-[12.5px] text-body">
            <li><span className="font-semibold text-ink">Colour:</span> a neutral scale, brand, and status, assigned to roles. Structured so dark mode can come later</li>
            <li><span className="font-semibold text-ink">Type:</span> a scale with set weights and line heights</li>
            <li><span className="font-semibold text-ink">Spacing and shape:</span> 4px scale, radius, shadows, motion, focus rings, breakpoints</li>
          </ul>
        </div>
        <div className="bubble-sm border border-rule bg-bg p-4">
          <div className="label mb-2">One source, published to</div>
          <ul className="grid gap-1.5 text-[12.5px] text-body">
            <li className="flex items-center gap-2"><Braces size={13} className="text-accent" aria-hidden="true" /> CSS variables and a Tailwind preset</li>
            <li className="flex items-center gap-2"><PenTool size={13} className="text-accent" aria-hidden="true" /> Figma variables</li>
            <li className="flex items-center gap-2"><Paintbrush size={13} className="text-accent" aria-hidden="true" /> Docs</li>
          </ul>
        </div>
        <div className="bubble-sm border border-dashed border-rule p-4">
          <div className="label mb-1">Deliverable</div>
          <p className="flex items-center gap-2 text-[12.5px] text-body"><Check size={12} className="text-accent" aria-hidden="true" /> A token package, a Figma library, and docs</p>
        </div>
      </div>
    </div>
  );
}

function Layer({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[10px] border border-rule bg-surface p-2.5">
      <div className="mb-1.5 flex items-baseline gap-1.5">
        <span className="text-[13px] font-semibold text-ink">{title}</span>
        <span className="text-[11px] text-muted">{sub}</span>
      </div>
      <ul className="grid gap-1">{children}</ul>
    </div>
  );
}

function Row({ k, v, swatch }: { k: string; v: string; swatch: string }) {
  return (
    <li className="flex items-center gap-1.5 font-mono text-[10.5px] text-body">
      <span className="h-3 w-3 shrink-0 rounded-[3px] border border-rule transition-colors duration-500" style={{ background: swatch }} />
      <span className="truncate text-ink">{k}</span>
      <span className="ml-auto truncate text-muted">{v}</span>
    </li>
  );
}
