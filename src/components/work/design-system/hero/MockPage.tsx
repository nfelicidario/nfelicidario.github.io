"use client";

import type { CSSProperties, ReactNode } from "react";
import {
  BarChart3,
  Bell,
  CalendarDays,
  ChevronDown,
  Filter,
  LayoutDashboard,
  MessageSquare,
  Plus,
  Search,
  Settings,
  SlidersHorizontal,
  Users,
} from "lucide-react";

/**
 * One mock app page (a campaigns list) drawn under two sets of tokens. "today" is the older
 * Platform look: several saturated colours at once, heavy borders, square corners, large type.
 * "next" is the RCS Studio direction: a neutral scale, one accent, softer corners, smaller type.
 * Every colour, radius, and size is a CSS variable on the root, so switching `tone` transitions.
 */
export type Tone = "today" | "next";

const TOKENS: Record<Tone, CSSProperties> = {
  today: {
    "--m-bg": "#f4f1fa",
    "--m-surface": "#ffffff",
    "--m-side": "#2a1a5e",
    "--m-side-ink": "#d9ccff",
    "--m-head": "#6b3fd6",
    "--m-head-ink": "#ffffff",
    "--m-ink": "#1f1f2e",
    "--m-muted": "#6c6a7c",
    "--m-rule": "#c9c3dc",
    "--m-accent": "#f26b1d",
    "--m-accent-ink": "#ffffff",
    "--m-link": "#0a7bd6",
    "--m-ok": "#1fb04a",
    "--m-ok-ink": "#ffffff",
    "--m-warn": "#f5b700",
    "--m-warn-ink": "#3a2b00",
    "--m-bad": "#e23b3b",
    "--m-bad-ink": "#ffffff",
    "--m-zebra": "#ece6f7",
    "--m-r": "2px",
    "--m-r-lg": "3px",
    "--m-fs": "13px",
    "--m-fs-sm": "11.5px",
    "--m-fs-h": "17px",
    "--m-bw": "2px",
    "--m-gap": "10px",
  } as CSSProperties,
  next: {
    "--m-bg": "#eef2f8",
    "--m-surface": "#f8fafd",
    "--m-side": "#f8fafd",
    "--m-side-ink": "#4a5a73",
    "--m-head": "#f8fafd",
    "--m-head-ink": "#0b1b33",
    "--m-ink": "#0b1b33",
    "--m-muted": "#64748b",
    "--m-rule": "#d6dfeb",
    "--m-accent": "#1f4fe0",
    "--m-accent-ink": "#ffffff",
    "--m-link": "#1f4fe0",
    "--m-ok": "#dcf1e6",
    "--m-ok-ink": "#1c7a4f",
    "--m-warn": "#fbebd3",
    "--m-warn-ink": "#8a4f00",
    "--m-bad": "#fbe0e0",
    "--m-bad-ink": "#a52626",
    "--m-zebra": "#f8fafd",
    "--m-r": "8px",
    "--m-r-lg": "12px",
    "--m-fs": "11.5px",
    "--m-fs-sm": "10.5px",
    "--m-fs-h": "14px",
    "--m-bw": "1px",
    "--m-gap": "8px",
  } as CSSProperties,
};

const T = "transition-[background-color,color,border-color,border-radius,border-width,font-size,padding] duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]";

const rows: { name: string; channel: string; status: "Sent" | "Scheduled" | "Failed" | "Draft"; sent: string; when: string }[] = [
  { name: "Spring launch", channel: "SMS", status: "Sent", sent: "48,210", when: "Mar 2" },
  { name: "Loyalty reminder", channel: "RCS", status: "Scheduled", sent: "—", when: "Mar 9" },
  { name: "Cart recovery", channel: "MMS", status: "Failed", sent: "1,040", when: "Feb 27" },
  { name: "Welcome series", channel: "SMS", status: "Sent", sent: "12,980", when: "Feb 21" },
  { name: "Store opening", channel: "RCS", status: "Draft", sent: "—", when: "—" },
];

function Icon({ children, tone }: { children: ReactNode; tone: Tone }) {
  return (
    <span className="grid place-items-center [&>svg]:h-[1em] [&>svg]:w-[1em]" style={{ fontSize: tone === "today" ? 15 : 13 }} aria-hidden="true">
      {children}
    </span>
  );
}

/** `compact` drops the secondary toolbar buttons and the channel column, for a mock drawn at a third of the stage. */
export function MockPage({ tone, app = "Platform", compact = false, className = "" }: { tone: Tone; app?: string; compact?: boolean; className?: string }) {
  const cols = compact ? "1.6fr 1fr 0.8fr 0.7fr" : "1.6fr 0.7fr 1fr 0.8fr 0.7fr";
  const strokeProps = tone === "today" ? { strokeWidth: 2.75, strokeLinecap: "square" as const, strokeLinejoin: "miter" as const } : { strokeWidth: 2 };
  const badge = (status: (typeof rows)[number]["status"]) => {
    const map = {
      Sent: ["var(--m-ok)", "var(--m-ok-ink)"],
      Scheduled: ["var(--m-warn)", "var(--m-warn-ink)"],
      Failed: ["var(--m-bad)", "var(--m-bad-ink)"],
      Draft: ["var(--m-zebra)", "var(--m-muted)"],
    } as const;
    const [bg, ink] = map[status];
    return (
      <span
        className={`inline-block px-2 py-[2px] font-semibold leading-none ${T}`}
        style={{ background: bg, color: ink, borderRadius: tone === "today" ? "var(--m-r)" : "999px", fontSize: "var(--m-fs-sm)", textTransform: tone === "today" ? "uppercase" : "none", letterSpacing: tone === "today" ? "0.04em" : 0 }}
      >
        {status}
      </span>
    );
  };

  return (
    <div
      className={`grid h-full w-full grid-cols-[22%_1fr] overflow-hidden font-sans ${T} ${className}`}
      style={{ ...TOKENS[tone], background: "var(--m-bg)", color: "var(--m-ink)", fontSize: "var(--m-fs)", borderRadius: "var(--m-r-lg)" }}
    >
      {/* sidebar */}
      <aside className={`flex flex-col gap-1 p-2.5 ${T}`} style={{ background: "var(--m-side)", color: "var(--m-side-ink)", borderRight: `1px solid ${tone === "today" ? "transparent" : "var(--m-rule)"}` }}>
        <div className="mb-2 flex items-center gap-2 px-1.5 py-1">
          <span className={`grid h-5 w-5 place-items-center font-bold ${T}`} style={{ background: "var(--m-accent)", color: "var(--m-accent-ink)", borderRadius: tone === "today" ? "var(--m-r)" : "6px", fontSize: 10 }}>
            V
          </span>
          <span className="truncate font-semibold" style={{ color: tone === "today" ? "#fff" : "var(--m-ink)" }}>
            {app}
          </span>
        </div>
        {[
          { I: LayoutDashboard, l: "Dashboard" },
          { I: MessageSquare, l: "Campaigns", on: true },
          { I: Users, l: "Audiences" },
          { I: BarChart3, l: "Reports" },
          { I: Settings, l: "Settings" },
        ].map(({ I, l, on }) => (
          <div
            key={l}
            className={`flex items-center gap-2 px-1.5 py-1 ${T}`}
            style={{
              borderRadius: "var(--m-r)",
              background: on ? (tone === "today" ? "rgba(255,255,255,0.14)" : "#e3eaf7") : "transparent",
              color: on ? (tone === "today" ? "#fff" : "var(--m-accent)") : "var(--m-side-ink)",
              fontWeight: on ? 600 : 500,
            }}
          >
            <Icon tone={tone}>
              <I {...strokeProps} />
            </Icon>
            <span className="truncate">{l}</span>
          </div>
        ))}
      </aside>

      {/* main */}
      <div className="flex min-w-0 flex-col">
        <header className={`flex items-center justify-between gap-3 px-3.5 py-2 ${T}`} style={{ background: "var(--m-head)", color: "var(--m-head-ink)", borderBottom: `1px solid ${tone === "today" ? "transparent" : "var(--m-rule)"}` }}>
          <span className="truncate font-bold" style={{ fontSize: "var(--m-fs-h)" }}>
            Campaigns
          </span>
          <span className="flex items-center gap-2.5">
            <Icon tone={tone}>
              <Bell {...strokeProps} />
            </Icon>
            <span className={`h-5 w-5 rounded-full ${T}`} style={{ background: tone === "today" ? "#ffd166" : "var(--m-rule)" }} />
          </span>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-[var(--m-gap)] p-3.5">
          {/* toolbar */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`flex min-w-0 flex-1 items-center gap-1.5 px-2 py-1 ${T}`} style={{ background: "var(--m-surface)", border: "var(--m-bw) solid var(--m-rule)", borderRadius: "var(--m-r)", color: "var(--m-muted)" }}>
              <Icon tone={tone}>
                <Search {...strokeProps} />
              </Icon>
              <span className="truncate">Search campaigns</span>
            </span>
            {[
              { I: Filter, l: "Filters" },
              { I: SlidersHorizontal, l: "Group by" },
              { I: CalendarDays, l: "Last 30 days" },
            ].map(({ I, l }) => (
              <span key={l} className={`${compact ? "hidden" : "hidden sm:flex"} items-center gap-1 px-2 py-1 ${T}`} style={{ background: "var(--m-surface)", border: "var(--m-bw) solid var(--m-rule)", borderRadius: "var(--m-r)", color: "var(--m-ink)" }}>
                <Icon tone={tone}>
                  <I {...strokeProps} />
                </Icon>
                <span>{l}</span>
                <Icon tone={tone}>
                  <ChevronDown {...strokeProps} />
                </Icon>
              </span>
            ))}
            <span
              className={`flex items-center gap-1 px-2.5 py-1 font-bold ${T}`}
              style={{ background: "var(--m-accent)", color: "var(--m-accent-ink)", borderRadius: "var(--m-r)", textTransform: tone === "today" ? "uppercase" : "none", letterSpacing: tone === "today" ? "0.05em" : 0, fontWeight: tone === "today" ? 800 : 600 }}
            >
              <Icon tone={tone}>
                <Plus {...strokeProps} />
              </Icon>
              <span>New</span>
            </span>
          </div>

          {/* table */}
          <div className={`min-h-0 flex-1 overflow-hidden ${T}`} style={{ background: "var(--m-surface)", border: "var(--m-bw) solid var(--m-rule)", borderRadius: "var(--m-r)" }}>
            <div className={`grid px-2.5 py-1.5 font-semibold ${T}`} style={{ gridTemplateColumns: cols, color: "var(--m-muted)", fontSize: "var(--m-fs-sm)", borderBottom: "var(--m-bw) solid var(--m-rule)", textTransform: tone === "today" ? "uppercase" : "none", letterSpacing: tone === "today" ? "0.05em" : 0, background: tone === "today" ? "var(--m-zebra)" : "transparent" }}>
              <span>Name</span>
              {!compact && <span>Channel</span>}
              <span>Status</span>
              <span className="text-right">Sent</span>
              <span className="text-right">Date</span>
            </div>
            {rows.map((r, i) => (
              <div
                key={r.name}
                className={`grid items-center px-2.5 py-1.5 ${T}`}
                style={{ gridTemplateColumns: cols, background: i % 2 === 1 ? "var(--m-zebra)" : "transparent", borderBottom: i === rows.length - 1 ? "none" : `1px solid var(--m-rule)` }}
              >
                <span className="truncate font-semibold" style={{ color: tone === "today" ? "var(--m-link)" : "var(--m-ink)", textDecoration: tone === "today" ? "underline" : "none" }}>
                  {r.name}
                </span>
                {!compact && <span style={{ color: "var(--m-muted)" }}>{r.channel}</span>}
                <span>{badge(r.status)}</span>
                <span className="num text-right">{r.sent}</span>
                <span className="num text-right" style={{ color: "var(--m-muted)" }}>
                  {r.when}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
