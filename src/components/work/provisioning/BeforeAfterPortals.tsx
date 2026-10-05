"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

type Tile = { id: string; label: string; x: number; y: number };

const W = 600;
const H = 420;
const TILE_W = 104;
const TILE_H = 40;

// Before: ten portals in two columns, plus an inbox in the middle.
const portals: Tile[] = [
  "agent registry",
  "carrier console A",
  "carrier console B",
  "carrier console C",
  "verification",
  "customer email",
  "spreadsheet",
  "report builder",
  "asset editor",
  "ticketing",
].map((label, i) => ({
  id: `p${i}`,
  label,
  x: i < 5 ? 372 : 486,
  y: 34 + (i % 5) * 74,
}));

const inbox = { x: 232, y: 190, w: 100, h: 40 };

// After: one admin surface, three abstract third parties.
const admin = { x: 212, y: 150, w: 132, h: 120 };
const parties: Tile[] = [
  { id: "a0", label: "carrier consoles", x: 440, y: 92 },
  { id: "a1", label: "verification vendor", x: 440, y: 190 },
  { id: "a2", label: "the customer", x: 440, y: 288 },
];

const request = { x: 24, y: 174, w: 128, h: 72 };

function mid(t: { x: number; y: number; w?: number; h?: number }) {
  return { cx: t.x + (t.w ?? TILE_W) / 2, cy: t.y + (t.h ?? TILE_H) / 2 };
}

export function BeforeAfterPortals() {
  const [after, setAfter] = useState(false);
  const reduce = useReducedMotion();
  const t = reduce ? { duration: 0 } : { duration: 0.55, ease: [0.2, 0.7, 0.2, 1] as const };

  const req = mid(request);
  const hub = after ? admin : inbox;
  const hubMid = mid(hub);

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between gap-3">
        <div role="group" aria-label="Diagram state" className="inline-flex rounded-full border border-rule bg-raised p-0.5">
          {(["Before", "After"] as const).map((s) => {
            const active = (s === "After") === after;
            return (
              <button
                key={s}
                type="button"
                aria-pressed={active}
                onClick={() => setAfter(s === "After")}
                className={`rounded-full px-3 py-1 text-[12.5px] font-semibold transition-colors ${
                  active ? "bg-accent text-white" : "text-body hover:text-ink"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
        <span className="num text-[12px] text-muted">
          {after ? "1 request · 1 admin · 3 third parties" : "1 request · 1 inbox · 10 portals"}
        </span>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={
          after
            ? "One customer request flows through a single admin surface to the carrier consoles, a verification vendor, and the customer."
            : "One customer request fans out through an inbox to ten separate portals over email."
        }
      >
        {/* request → hub */}
        <motion.line
          x1={request.x + request.w}
          y1={req.cy}
          animate={{ x2: hub.x, y2: hubMid.cy }}
          transition={t}
          className="stroke-accent"
          strokeWidth={2}
        />

        {/* before: dashed email lines from inbox to each portal */}
        <motion.g animate={{ opacity: after ? 0 : 1 }} transition={t} style={{ pointerEvents: "none" }}>
          {portals.map((p) => {
            const m = mid(p);
            return (
              <path
                key={p.id}
                d={`M ${inbox.x + inbox.w} ${mid(inbox).cy} C ${inbox.x + inbox.w + 30} ${mid(inbox).cy}, ${p.x - 30} ${m.cy}, ${p.x} ${m.cy}`}
                fill="none"
                className="stroke-muted"
                strokeWidth={1.25}
                strokeDasharray="4 4"
              />
            );
          })}
          {portals.map((p, i) => (
            <motion.g
              key={p.id}
              animate={reduce ? {} : { x: after ? -16 : 0 }}
              transition={{ ...t, delay: after ? 0 : 0.03 * i }}
            >
              <rect
                x={p.x}
                y={p.y}
                width={TILE_W}
                height={TILE_H}
                rx={10}
                className="fill-surface stroke-rule"
                strokeWidth={1.25}
              />
              <text
                x={p.x + TILE_W / 2}
                y={p.y + TILE_H / 2 + 4}
                textAnchor="middle"
                fontSize={11}
                className="fill-body"
              >
                {p.label}
              </text>
            </motion.g>
          ))}
        </motion.g>

        {/* after: solid lines from admin to three third parties */}
        <motion.g animate={{ opacity: after ? 1 : 0 }} transition={t} style={{ pointerEvents: "none" }}>
          {parties.map((p) => {
            const m = mid(p);
            return (
              <path
                key={p.id}
                d={`M ${admin.x + admin.w} ${mid(admin).cy} C ${admin.x + admin.w + 40} ${mid(admin).cy}, ${p.x - 40} ${m.cy}, ${p.x} ${m.cy}`}
                fill="none"
                className="stroke-accent"
                strokeWidth={2}
              />
            );
          })}
          {parties.map((p, i) => (
            <motion.g
              key={p.id}
              animate={reduce ? {} : { x: after ? 0 : 16 }}
              transition={{ ...t, delay: after ? 0.08 * i : 0 }}
            >
              <rect
                x={p.x}
                y={p.y}
                width={TILE_W + 32}
                height={TILE_H}
                rx={10}
                className="fill-surface stroke-accent"
                strokeWidth={1.5}
              />
              <text
                x={p.x + (TILE_W + 32) / 2}
                y={p.y + TILE_H / 2 + 4}
                textAnchor="middle"
                fontSize={11.5}
                className="fill-ink"
                fontWeight={600}
              >
                {p.label}
              </text>
            </motion.g>
          ))}
        </motion.g>

        {/* hub: the inbox morphs into the admin surface */}
        <motion.rect
          animate={{ attrX: hub.x, attrY: hub.y, width: hub.w, height: hub.h }}
          transition={t}
          rx={12}
          className={after ? "fill-accent-soft stroke-accent" : "fill-raised stroke-rule"}
          strokeWidth={1.5}
        />
        <motion.text
          animate={{ attrX: hubMid.cx, attrY: after ? hub.y + 26 : hubMid.cy + 4 }}
          transition={t}
          textAnchor="middle"
          fontSize={12}
          fontWeight={700}
          className="fill-ink"
        >
          {after ? "admin" : "inbox"}
        </motion.text>
        <motion.g animate={{ opacity: after ? 1 : 0 }} transition={t}>
          {["accounts", "queue", "submissions"].map((row, i) => (
            <g key={row}>
              <rect
                x={admin.x + 14}
                y={admin.y + 40 + i * 24}
                width={admin.w - 28}
                height={16}
                rx={6}
                className="fill-surface"
              />
              <text
                x={admin.x + 22}
                y={admin.y + 52 + i * 24}
                fontSize={10}
                className="fill-body"
              >
                {row}
              </text>
            </g>
          ))}
        </motion.g>

        {/* request, constant */}
        <rect
          x={request.x}
          y={request.y}
          width={request.w}
          height={request.h}
          rx={14}
          className="fill-surface stroke-ink"
          strokeWidth={1.5}
        />
        <text x={request.x + 14} y={request.y + 24} fontSize={11} fontWeight={600} className="fill-ink">
          customer request
        </text>
        <text x={request.x + 14} y={request.y + 42} fontSize={10.5} className="fill-muted">
          one agent
        </text>
        <text x={request.x + 14} y={request.y + 58} fontSize={10.5} className="fill-muted">
          brand + campaign
        </text>

        {/* legend */}
        <g>
          <line x1={24} y1={398} x2={48} y2={398} strokeDasharray="4 4" className="stroke-muted" strokeWidth={1.25} />
          <text x={56} y={402} fontSize={10.5} className="fill-muted">
            email, copied by hand
          </text>
          <line x1={200} y1={398} x2={224} y2={398} className="stroke-accent" strokeWidth={2} />
          <text x={232} y={402} fontSize={10.5} className="fill-muted">
            structured data
          </text>
        </g>
      </svg>
    </div>
  );
}
