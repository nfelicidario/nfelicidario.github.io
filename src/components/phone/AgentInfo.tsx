"use client";

import type { ReactNode } from "react";
import { ArrowLeft, BadgeCheck, ExternalLink, Globe, Mail, Phone } from "lucide-react";
import { GESTURE_BAR_H } from "./AndroidPhone";
import { PANEL_PADDING } from "./ConversationPanel";
import { MediaPlaceholder } from "./RichCard";
import { VerifiedBadge } from "./VerifiedBadge";

/**
 * The agent details screen a user reaches from the conversation header, as Google Messages
 * draws it: a back arrow row; the 45:14 hero band (the 1440 x 448 banner, a soft brand
 * gradient when none is given) with the logo overlapping its bottom edge, centered, masked to
 * a rounded square on no background; the display name with the filled verified badge; the
 * description centered in muted text (two lines); a row of round tonal actions (Call,
 * Website, Email); then rounded list cards: Verified, the phone number, the website, the
 * email, and the privacy policy and terms links. The screen is the tonal look of the
 * references: the ground is the light `--ph-surface-low` tier and the cards and the round
 * actions are the light system gray of the surface-container tier (`--ph-surface-high`), not
 * white. The whole screen scrolls. The hero band's fallback gradient is the one place on this
 * screen that reads the brand color.
 *
 * Every value is optional; `placeholders` stand in (muted) while a form is still empty.
 * `note` (usually a `DemoBanner` with preview copy) sits under the back arrow row, above the
 * hero band, inset like the thread's banner.
 */
export type AgentInfoProps = {
  logo: ReactNode;
  name: string;
  description?: string;
  verified?: boolean;
  /** 1440 x 448 banner; a brand gradient stands in when omitted */
  banner?: ReactNode;
  /** a small note over the top of the screen, e.g. `DemoBanner` with preview copy */
  note?: ReactNode;
  website?: string;
  phone?: string;
  email?: string;
  /** shown muted while the matching value is empty */
  placeholders?: Partial<AgentInfoPlaceholders>;
  /** show the privacy policy and terms cards */
  legal?: boolean;
  /** CSS px of the logo's square */
  logoSize?: number;
};

export type AgentInfoPlaceholders = { description: string; website: string; phone: string; email: string };

export const AGENT_INFO_PLACEHOLDERS: AgentInfoPlaceholders = {
  description: "A line about your business and what you send.",
  website: "yourbrand.example",
  phone: "+1 555 010 0199",
  email: "hello@yourbrand.example",
};

export const INFO_LOGO_SIZE = 72;
const CARD_RADIUS = 16;

export function AgentInfo({
  logo,
  name,
  description,
  verified = false,
  banner,
  note,
  website,
  phone,
  email,
  placeholders,
  legal = true,
  logoSize = INFO_LOGO_SIZE,
}: AgentInfoProps) {
  const ph = { ...AGENT_INFO_PLACEHOLDERS, ...placeholders };
  const value = (v: string | undefined, fallback: string) => ({ text: v || fallback, muted: !v });

  const actions = [
    { icon: <Phone size={22} aria-hidden="true" />, label: "Call" },
    { icon: <Globe size={22} aria-hidden="true" />, label: "Website" },
    { icon: <Mail size={22} aria-hidden="true" />, label: "Email" },
  ];
  const rows = [
    { key: "phone", icon: <Phone size={20} aria-hidden="true" />, ...value(phone, ph.phone), sub: "Phone" },
    { key: "website", icon: <Globe size={20} aria-hidden="true" />, ...value(website, ph.website), sub: "Website" },
    { key: "email", icon: <Mail size={20} aria-hidden="true" />, ...value(email, ph.email), sub: "Email" },
  ];
  const desc = value(description, ph.description);

  return (
    <div
      data-ph-scroller=""
      style={{
        display: "flex",
        minHeight: 0,
        flex: 1,
        flexDirection: "column",
        overflowX: "hidden",
        overflowY: "auto",
        scrollbarWidth: "none",
        background: "var(--ph-surface-low)",
        color: "var(--ph-on-surface)",
      }}
    >
      <style href="ph-info" precedence="default">
        {"[data-ph-scroller]::-webkit-scrollbar{display:none}"}
      </style>
      {/* back arrow row */}
      <div aria-hidden="true" style={{ display: "flex", height: 56, flexShrink: 0, alignItems: "center", padding: "0 8px" }}>
        <span style={{ display: "grid", width: 40, height: 40, placeItems: "center", borderRadius: 999 }}>
          <ArrowLeft size={22} />
        </span>
      </div>

      {note && (
        <div style={{ display: "flex", flexShrink: 0, justifyContent: "center", padding: `0 ${PANEL_PADDING}px 8px` }}>
          {note}
        </div>
      )}

      {/* hero band with the logo over its bottom edge */}
      <div aria-hidden="true" style={{ position: "relative", flexShrink: 0, marginBottom: logoSize / 2 }}>
        <div style={{ aspectRatio: "45 / 14", overflow: "hidden" }}>{banner ?? <HeroBand />}</div>
        <span
          style={{
            position: "absolute",
            left: "50%",
            bottom: -logoSize / 2,
            display: "grid",
            width: logoSize,
            height: logoSize,
            overflow: "hidden",
            placeItems: "center",
            transform: "translateX(-50%)",
            borderRadius: Math.round(logoSize * 0.22),
            background: "transparent",
          }}
        >
          {logo}
        </span>
      </div>

      {/* name, badge, description */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "10px 24px 0", textAlign: "center" }}>
        <div style={{ display: "flex", maxWidth: "100%", alignItems: "center", gap: 6, fontSize: 22, fontWeight: 500, lineHeight: 1.2 }}>
          <span style={{ minWidth: 0, overflowWrap: "anywhere" }}>{name}</span>
          {verified && <VerifiedBadge size={22} />}
        </div>
        <p
          style={{
            margin: 0,
            maxWidth: "100%",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            fontSize: 14,
            lineHeight: "19px",
            color: "var(--ph-on-surface-variant)",
            opacity: desc.muted ? 0.7 : 1,
            overflowWrap: "anywhere",
          }}
        >
          {desc.text}
        </p>
      </div>

      {/* round tonal actions, neutral */}
      <div aria-hidden="true" style={{ display: "flex", justifyContent: "center", gap: 12, padding: "18px 16px 0" }}>
        {actions.map((a) => (
          <div key={a.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width: 84 }}>
            <span
              style={{
                display: "grid",
                width: 84,
                height: 48,
                placeItems: "center",
                borderRadius: 999,
                background: "var(--ph-surface-high)",
                color: "var(--ph-on-surface)",
              }}
            >
              {a.icon}
            </span>
            <span style={{ fontSize: 12.5, fontWeight: 500 }}>{a.label}</span>
          </div>
        ))}
      </div>

      {/* list cards in the light system gray (surface-container tier) on the lighter ground */}
      <ul
        style={{
          listStyle: "none",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          margin: 0,
          padding: `20px ${12}px ${GESTURE_BAR_H + 10}px`,
        }}
      >
        <li style={card}>
          <span style={rowIcon}>
            <BadgeCheck size={20} aria-hidden="true" />
          </span>
          <span style={{ minWidth: 0 }}>
            <span style={rowTitle}>Verified</span>
            <span style={rowSub}>The identity of this sender has been verified.</span>
          </span>
        </li>
        {rows.map((r) => (
          <li key={r.key} style={card}>
            <span style={rowIcon}>{r.icon}</span>
            <span style={{ minWidth: 0 }}>
              <span style={{ ...rowTitle, opacity: r.muted ? 0.6 : 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.text}</span>
              <span style={rowSub}>{r.sub}</span>
            </span>
          </li>
        ))}
        {legal &&
          ["View Privacy Policy", "View Terms of Service"].map((t) => (
            <li key={t} style={{ ...card, minHeight: 56 }}>
              <span style={rowIcon}>
                <ExternalLink size={20} aria-hidden="true" />
              </span>
              <span style={rowTitle}>{t}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}

/** the hero band when there is no banner: a soft gradient in the brand color */
function HeroBand() {
  return (
    <MediaPlaceholder
      style={{
        background:
          "linear-gradient(120deg, color-mix(in srgb, var(--ph-brand) 70%, var(--ph-surface)) 0%, var(--ph-brand) 50%, color-mix(in srgb, var(--ph-brand) 55%, var(--ph-bg)) 100%)",
      }}
    />
  );
}

const card = {
  display: "flex",
  alignItems: "center",
  gap: 16,
  minHeight: 64,
  padding: "10px 16px",
  borderRadius: CARD_RADIUS,
  background: "var(--ph-surface-high)",
} as const;

const rowIcon = {
  display: "grid",
  flexShrink: 0,
  placeItems: "center",
  color: "var(--ph-on-surface-variant)",
} as const;

const rowTitle = {
  display: "block",
  fontSize: 15,
  lineHeight: "20px",
  color: "var(--ph-on-surface)",
} as const;

const rowSub = {
  display: "block",
  marginTop: 1,
  fontSize: 13,
  lineHeight: "17px",
  color: "var(--ph-on-surface-variant)",
} as const;
