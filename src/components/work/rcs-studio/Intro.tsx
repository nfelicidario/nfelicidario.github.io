"use client";

import type { ReactNode } from "react";
import { ToggleTool } from "@/components/ToggleTool";
import { MetaList, type Meta } from "@/components/case/CaseLayout";
import { projects } from "@/content/projects";

/**
 * The intro under the RCS Studio hero: the same summary, bullets, and outcome as the Work card on
 * the home page, then the role, team, timeline, and stack. Three layouts, switchable with the
 * review Toggle Tool (`?review`); the first is the default visitors see.
 */
const p = projects.find((x) => x.slug === "rcs-studio")!;

export function RcsIntro({ meta }: { meta: Meta[] }) {
  return (
    <ToggleTool
      id="rcs-intro"
      label="Intro"
      variants={[
        { name: "Split", render: <Split meta={meta} /> },
        { name: "Band", render: <Band meta={meta} /> },
        { name: "Ledger", render: <Ledger meta={meta} /> },
      ]}
    />
  );
}

function Summary({ size = "md" }: { size?: "md" | "lg" }) {
  return (
    <p className={`max-w-[46ch] font-display font-semibold tracking-[-0.015em] text-ink ${size === "lg" ? "text-[clamp(22px,2.4vw,28px)] leading-[1.25]" : "text-[clamp(20px,2vw,24px)] leading-[1.3]"}`}>
      {p.summary}
    </p>
  );
}

function Bullets({ className = "" }: { className?: string }) {
  return (
    <ul className={`grid gap-1.5 pl-4 text-[15px] text-body marker:text-rule ${className}`} style={{ listStyle: "disc" }}>
      {p.bullets.map((b) => (
        <li key={b}>{b}</li>
      ))}
    </ul>
  );
}

function Outcomes({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <div className="label mb-1.5">Outcome</div>
      <ul className="grid gap-1.5 pl-4 text-[15px] text-body marker:text-accent" style={{ listStyle: "disc" }}>
        {p.outcomes.map((o) => (
          <li key={o}>{o}</li>
        ))}
      </ul>
    </div>
  );
}

/* A. Split: story left, facts in a quiet panel on the right */
function Split({ meta }: { meta: Meta[] }) {
  return (
    <div className="mt-14 grid gap-8 md:mt-16 md:grid-cols-[1.25fr_1fr] md:items-start">
      <div className="grid gap-5">
        <Summary />
        <Bullets />
        <Outcomes />
      </div>
      <div className="bubble border border-rule bg-surface p-5">
        <MetaList meta={meta} columns={1} className="gap-y-5" />
      </div>
    </div>
  );
}

/* B. Band: the summary leads full width, bullets and outcome side by side, then one strip of facts */
function Band({ meta }: { meta: Meta[] }) {
  return (
    <div className="mt-14 md:mt-16">
      <Summary size="lg" />
      <div className="mt-6 grid gap-6 md:grid-cols-2 md:gap-10">
        <Bullets />
        <Outcomes />
      </div>
      <dl className="mt-10 grid grid-cols-2 gap-y-6 border-y border-rule py-5 md:grid-cols-4 md:gap-y-0 md:[&>div+div]:border-l md:[&>div+div]:border-rule md:[&>div+div]:pl-6">
        {meta.map((m) => (
          <Cell key={m.label} label={m.label}>
            {m.value}
          </Cell>
        ))}
      </dl>
    </div>
  );
}

function Cell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="pr-4">
      <dt className="label mb-1.5">{label}</dt>
      <dd className="text-[13.5px] font-medium text-ink">{children}</dd>
    </div>
  );
}

/* C. Ledger: the summary beside one ruled list of everything, outcome rows in accent */
function Ledger({ meta }: { meta: Meta[] }) {
  const rows: { k: string; v: ReactNode; accent?: boolean }[] = [
    { k: "What", v: p.bullets[0] },
    { k: "Owned", v: p.bullets[1].replace(/^Owned /, "") },
    ...p.outcomes.map((o) => ({ k: "Outcome", v: o, accent: true })),
    ...meta.map((m) => ({ k: m.label, v: m.value })),
  ];
  return (
    <div className="mt-14 grid gap-8 md:mt-16 md:grid-cols-[1fr_1.3fr] md:items-start">
      <Summary size="lg" />
      <dl className="grid border-t border-rule">
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-[88px_1fr] gap-x-4 border-b border-rule py-3 text-[14px] md:grid-cols-[104px_1fr]">
            <dt className={`label pt-[2px] ${r.accent ? "text-accent" : ""}`}>{r.k}</dt>
            <dd className={`${r.accent ? "font-semibold text-ink" : "text-body"} [&_ul]:grid-cols-2`}>{r.v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
