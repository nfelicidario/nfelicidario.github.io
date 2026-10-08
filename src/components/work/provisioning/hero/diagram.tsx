"use client";

import { useId, type ComponentType } from "react";
import {
  Clock,
  LayoutDashboard,
  Mail,
  MessageSquare,
  Monitor,
  RadioTower,
  ShieldCheck,
  Split,
  Store,
  Table2,
  Users,
  type LucideProps,
} from "lucide-react";
import { DIAGRAM_TITLES, OLD_STEPS, STUBS, VISION } from "./script";

/**
 * Small SVG diagram pieces for the Vibes Admin hero, plus the two diagrams built from them:
 * the old process (BeforeDiagram) and the vision (VisionDiagram). Everything is drawn in
 * viewBox units (DIAGRAM.w by DIAGRAM.h) and scales with the stage.
 *
 *  - Node: a rounded rect with a tinted icon, a label, and a second line; variants pick the
 *    icon and tint. A node with `tip` is focusable and reports hover and focus through
 *    `onTip` so the hero can draw an HTML tooltip over the SVG.
 *  - Edge: a connector between two points, straight when aligned, an S-curve otherwise;
 *    dashed for email; an arrowhead from the shared marker.
 *  - Group: a dashed lane around a branch with a label and an optional tag.
 *
 * Colors are the site tokens through Tailwind's fill-*, stroke-*, and text-* utilities.
 */

/* --------------------------------------------------------------- types */

export type Pt = { x: number; y: number };
export type Box = { x: number; y: number; w: number; h: number };

export type NodeVariant =
  | "team"
  | "customer"
  | "email"
  | "portal"
  | "wait"
  | "spreadsheet"
  | "vendor"
  | "carrier"
  | "decision"
  | "admin"
  | "sender";

/** what the hero gets when a node is hovered or focused: the text and the element, or null */
export type TipHandler = (text: string | null, el: Element | null) => void;

/** the drawing space of both diagrams */
export const DIAGRAM = { w: 1020, h: 560 } as const;

/** the default node size */
export const NODE = { w: 146, h: 44 } as const;

const VARIANTS: Record<NodeVariant, { icon: ComponentType<LucideProps>; tint: string; ink: string }> = {
  team: { icon: Users, tint: "fill-accent-soft", ink: "text-accent" },
  customer: { icon: Store, tint: "fill-ok-soft", ink: "text-ok" },
  email: { icon: Mail, tint: "fill-warn-soft", ink: "text-warn" },
  portal: { icon: Monitor, tint: "fill-raised", ink: "text-ink" },
  wait: { icon: Clock, tint: "fill-raised", ink: "text-muted" },
  spreadsheet: { icon: Table2, tint: "fill-raised", ink: "text-ink" },
  vendor: { icon: ShieldCheck, tint: "fill-raised", ink: "text-ink" },
  carrier: { icon: RadioTower, tint: "fill-raised", ink: "text-ink" },
  decision: { icon: Split, tint: "fill-warn-soft", ink: "text-warn" },
  admin: { icon: LayoutDashboard, tint: "fill-accent", ink: "text-white" },
  sender: { icon: MessageSquare, tint: "fill-accent-soft", ink: "text-accent" },
};

/* ------------------------------------------------------------- anchors */

export const anchor = {
  left: (b: Box): Pt => ({ x: b.x, y: b.y + b.h / 2 }),
  right: (b: Box): Pt => ({ x: b.x + b.w, y: b.y + b.h / 2 }),
  top: (b: Box): Pt => ({ x: b.x + b.w / 2, y: b.y }),
  bottom: (b: Box): Pt => ({ x: b.x + b.w / 2, y: b.y + b.h }),
  center: (b: Box): Pt => ({ x: b.x + b.w / 2, y: b.y + b.h / 2 }),
};

/* ---------------------------------------------------------------- defs */

/** the arrowhead marker; pass its id to every Edge as `arrow` */
export function Defs({ id }: { id: string }) {
  return (
    <defs>
      <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" className="fill-muted" />
      </marker>
    </defs>
  );
}

/* ---------------------------------------------------------------- node */

export type NodeProps = Box & {
  variant: NodeVariant;
  label: string;
  sub?: string;
  /** a step number in the top-right corner */
  n?: number;
  /** the full text; makes the node focusable and reports it through onTip */
  tip?: string;
  onTip?: TipHandler;
  /** a muted, inert node (the collapsed branches) */
  dim?: boolean;
  /** draws a bar instead of text (a generic step in a collapsed branch) */
  skeleton?: boolean;
  /** an accent border (the node the story is about) */
  emphasis?: boolean;
};

export function Node({ x, y, w, h, variant, label, sub, n, tip, onTip, dim, skeleton, emphasis }: NodeProps) {
  const v = VARIANTS[variant];
  const Icon = v.icon;
  const big = h >= 60;
  const iconSize = big ? 26 : 18;
  const iconR = big ? 20 : 14;
  const pad = big ? 16 : 8;
  const cx = pad + iconR;
  const cy = h / 2;
  const textX = cx + iconR + (big ? 12 : 8);
  const focusable = !!tip && !!onTip;

  function report(e: { currentTarget: Element }) {
    onTip?.(tip ?? null, e.currentTarget);
  }
  function clear() {
    onTip?.(null, null);
  }

  return (
    <g
      transform={`translate(${x} ${y})`}
      className={`${dim ? "opacity-45" : ""} ${focusable ? "group cursor-help outline-none" : ""}`}
      tabIndex={focusable ? 0 : undefined}
      role={focusable ? "img" : undefined}
      aria-label={focusable ? tip : undefined}
      data-control={focusable ? "" : undefined}
      onPointerEnter={focusable ? report : undefined}
      onPointerLeave={focusable ? clear : undefined}
      onFocus={focusable ? report : undefined}
      onBlur={focusable ? clear : undefined}
    >
      <rect
        width={w}
        height={h}
        rx={big ? 14 : 10}
        className={`${variant === "admin" ? "fill-accent stroke-accent" : `fill-surface ${emphasis ? "stroke-accent" : "stroke-rule"}`}`}
        strokeWidth={emphasis ? 1.5 : 1}
      />
      {focusable && <rect width={w} height={h} rx={big ? 14 : 10} className="fill-transparent stroke-accent opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100" strokeWidth={2} />}
      <circle cx={cx} cy={cy} r={iconR} className={variant === "admin" ? "fill-white/15" : v.tint} />
      <Icon x={cx - iconSize / 2} y={cy - iconSize / 2} size={iconSize} strokeWidth={1.75} className={v.ink} aria-hidden="true" />
      {skeleton ? (
        <rect x={textX} y={cy - 3} width={w - textX - pad} height={6} rx={3} className="fill-rule" />
      ) : (
        <>
          <text
            x={textX}
            y={sub ? cy - (big ? 6 : 4) : cy + 4}
            className={`${big ? "text-[15px]" : "text-[11.5px]"} font-semibold ${variant === "admin" ? "fill-white" : "fill-ink"}`}
          >
            {label}
          </text>
          {sub && (
            <text x={textX} y={cy + (big ? 12 : 10)} className={`${big ? "text-[10.5px]" : "text-[9px]"} ${variant === "admin" ? "fill-white/80" : "fill-muted"}`}>
              {sub}
            </text>
          )}
        </>
      )}
      {n !== undefined && (
        <text x={w - 7} y={11} textAnchor="end" className="num text-[8.5px] font-semibold fill-muted">
          {n}
        </text>
      )}
    </g>
  );
}

/* ---------------------------------------------------------------- edge */

export function Edge({ from, to, dashed, arrow, dim, accent }: { from: Pt; to: Pt; dashed?: boolean; arrow?: string; dim?: boolean; accent?: boolean }) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const straight = Math.abs(dx) < 1 || Math.abs(dy) < 1;
  const d = straight
    ? `M ${from.x} ${from.y} L ${to.x} ${to.y}`
    : Math.abs(dx) >= Math.abs(dy)
      ? `M ${from.x} ${from.y} C ${from.x + dx / 2} ${from.y}, ${to.x - dx / 2} ${to.y}, ${to.x} ${to.y}`
      : `M ${from.x} ${from.y} C ${from.x} ${from.y + dy / 2}, ${to.x} ${to.y - dy / 2}, ${to.x} ${to.y}`;
  return (
    <path
      d={d}
      fill="none"
      className={`${accent ? "stroke-accent" : "stroke-muted"} ${dim ? "opacity-35" : "opacity-80"}`}
      strokeWidth={accent ? 1.75 : 1.25}
      strokeDasharray={dashed ? "4 4" : undefined}
      markerEnd={arrow ? `url(#${arrow})` : undefined}
      aria-hidden="true"
    />
  );
}

/* --------------------------------------------------------------- group */

export function Group({ x, y, w, h, label, tag, dim, accent }: Box & { label?: string; tag?: string; dim?: boolean; accent?: boolean }) {
  const tagW = tag ? tag.length * 6 + 16 : 0;
  return (
    <g className={dim ? "opacity-60" : undefined} aria-hidden="true">
      <rect x={x} y={y} width={w} height={h} rx={14} className={`fill-bg/60 ${accent ? "stroke-accent" : "stroke-rule"}`} strokeDasharray={accent ? undefined : "5 4"} strokeWidth={1} />
      {label && (
        <text x={x + 12} y={y + 17} className={`label text-[10px] ${accent ? "fill-accent" : "fill-muted"}`}>
          {label}
        </text>
      )}
      {tag && (
        <g transform={`translate(${x + w - tagW - 10} ${y + 7})`}>
          <rect width={tagW} height={16} rx={8} className="fill-raised" />
          <text x={tagW / 2} y={11.5} textAnchor="middle" className="label text-[8.5px] fill-muted">
            {tag}
          </text>
        </g>
      )}
    </g>
  );
}

/* ----------------------------------------------------- before diagram */

/** the RCS branch's lane, in viewBox units; the hero zooms into it */
export const RCS_BOX: Box = { x: 186, y: 40, w: 816, h: 270 };

const OPS: Box = { x: 20, y: 258, w: 120, h: NODE.h };
/** the five columns of the snake */
const COLS = [200, 360, 520, 680, 840];
/** the three rows of the snake */
const ROWS = [70, 160, 250];

/** where each of the 14 steps sits: row 1 left to right, row 2 right to left, row 3 left to right */
export function oldStepBox(k: number): Box {
  const row = k < 5 ? 0 : k < 10 ? 1 : 2;
  const col = row === 0 ? k : row === 1 ? 9 - k : k - 10;
  return { x: COLS[col], y: ROWS[row], w: NODE.w, h: NODE.h };
}

const STUB_Y = [352, 420, 488];
const STUB_NODE = { w: 100, h: 36 };
const STUB_VARIANTS: NodeVariant[] = ["email", "portal", "email"];

/** which steps travel by email (dashed edges into them) */
const EMAIL_STEPS = new Set([0, 1, 3, 4, 7, 13]);

export function BeforeDiagram({ onTip, zoom }: { onTip?: TipHandler; zoom?: boolean }) {
  const arrow = `va-arrow-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const boxes = OLD_STEPS.map((_, k) => oldStepBox(k));

  return (
    <svg viewBox={`0 0 ${DIAGRAM.w} ${DIAGRAM.h}`} className="h-full w-full overflow-visible" role="group" aria-label={DIAGRAM_TITLES.before}>
      <Defs id={arrow} />

      {/* Ops, the fan-out, and the three collapsed branches; dimmed while zoomed into RCS */}
      <g className="transition-opacity duration-500" style={{ opacity: zoom ? 0.25 : 1 }}>
        <Node {...OPS} variant="team" label="Ops" sub="One shared inbox" emphasis />
        <Edge from={anchor.right(OPS)} to={anchor.left(boxes[0])} arrow={arrow} dashed />
        {STUBS.map((stub, k) => {
          const y = STUB_Y[k];
          const first: Box = { x: 200, y: y + 10, ...STUB_NODE };
          return (
            <g key={stub.name}>
              <Group x={RCS_BOX.x} y={y} w={640} h={56} dim tag={stub.tag} />
              <Edge from={anchor.right(OPS)} to={anchor.left(first)} arrow={arrow} dim />
              {STUB_VARIANTS.map((variant, j) => {
                const b: Box = { x: 200 + j * 116, y: y + 10, ...STUB_NODE };
                return (
                  <g key={variant + j}>
                    <Node {...b} variant={variant} label="" skeleton dim />
                    {j < STUB_VARIANTS.length - 1 && <Edge from={anchor.right(b)} to={{ x: b.x + b.w + 16, y: b.y + b.h / 2 }} arrow={arrow} dim />}
                  </g>
                );
              })}
              <text x={560} y={y + 26} className="text-[12px] font-semibold fill-ink opacity-70">
                {stub.name}
              </text>
              <text x={560} y={y + 40} className="text-[10px] fill-muted">
                {stub.note}
              </text>
            </g>
          );
        })}
      </g>

      {/* the RCS branch: 14 steps in a snake, three rows */}
      <Group {...RCS_BOX} label="RCS · 14 steps" accent={zoom} />
      {boxes.map((b, k) => {
        if (k === 0) return null;
        const prev = boxes[k - 1];
        const sameRow = prev.y === b.y;
        const dashed = EMAIL_STEPS.has(k);
        const from = sameRow ? (b.x > prev.x ? anchor.right(prev) : anchor.left(prev)) : anchor.bottom(prev);
        const to = sameRow ? (b.x > prev.x ? anchor.left(b) : anchor.right(b)) : anchor.top(b);
        return <Edge key={k} from={from} to={to} dashed={dashed} arrow={arrow} />;
      })}
      {OLD_STEPS.map((st, k) => (
        <Node key={st.label} {...boxes[k]} variant={st.variant} label={st.label} sub={st.sub} n={k + 1} tip={`Step ${k + 1} of 14. ${st.text}`} onTip={onTip} />
      ))}
    </svg>
  );
}

/* ----------------------------------------------------- vision diagram */

const V_CUSTOMER: Box = { x: 20, y: 258, w: 130, h: NODE.h };
const V_ADMIN: Box = { x: 250, y: 240, w: 200, h: 80 };
const V_OPS: Box = { x: 290, y: 60, w: 120, h: NODE.h };
const V_SENDER_X = 560;
const V_SENDER_Y = [96, 236, 328, 448];
const V_PARTY: Box = { x: 800, y: 0, w: 160, h: 30 };
const V_PARTY_Y = [[36, 76, 116, 156, 196], [240], [332], [452]];

export function VisionDiagram() {
  const arrow = `va-arrow-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <svg viewBox={`0 0 ${DIAGRAM.w} ${DIAGRAM.h}`} className="h-full w-full overflow-visible" role="group" aria-label={DIAGRAM_TITLES.vision}>
      <Defs id={arrow} />
      <Group x={780} y={14} w={222} h={494} label={VISION.partiesLabel} accent />

      <Edge from={anchor.right(V_CUSTOMER)} to={anchor.left(V_ADMIN)} arrow={arrow} accent />
      <Edge from={anchor.bottom(V_OPS)} to={anchor.top(V_ADMIN)} arrow={arrow} />
      <text x={anchor.bottom(V_OPS).x + 8} y={(V_OPS.y + V_OPS.h + V_ADMIN.y) / 2 + 4} className="text-[10px] fill-muted">
        reviews
      </text>

      {VISION.senders.map((sender, k) => {
        const s: Box = { x: V_SENDER_X, y: V_SENDER_Y[k], w: 130, h: 40 };
        return (
          <g key={sender.label}>
            <Edge from={anchor.right(V_ADMIN)} to={anchor.left(s)} arrow={arrow} accent />
            <Node {...s} variant="sender" label={sender.label} />
            {sender.parties.map((p, j) => {
              const b: Box = { ...V_PARTY, y: V_PARTY_Y[k][j] };
              const variant: NodeVariant = p.startsWith("Verification") ? "vendor" : p.startsWith("Google") ? "portal" : "carrier";
              return (
                <g key={p}>
                  <Edge from={anchor.right(s)} to={anchor.left(b)} arrow={arrow} />
                  <Node {...b} variant={variant} label={p} />
                </g>
              );
            })}
          </g>
        );
      })}

      <Node {...V_CUSTOMER} variant="customer" label={VISION.customer.label} sub={VISION.customer.sub} />
      <Node {...V_OPS} variant="team" label={VISION.ops.label} sub={VISION.ops.sub} emphasis />
      <Node {...V_ADMIN} variant="admin" label={VISION.admin.label} sub={VISION.admin.sub} />
    </svg>
  );
}
