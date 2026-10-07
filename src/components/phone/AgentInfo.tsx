"use client";

import type { ReactNode } from "react";
import { Globe, Mail, Phone } from "lucide-react";
import { MediaPlaceholder } from "./RichCard";
import { VerifiedBadge } from "./VerifiedBadge";
import { PANEL_INSET, PANEL_RADIUS } from "./ConversationPanel";

/**
 * The agent info screen a user reaches from the conversation header: hero banner (45:14),
 * the logo overlapping it as a rounded square, display name with the filled verified badge,
 * the 100-char description, then website, phone, and email rows, with the privacy and terms
 * links. Rendered on the same lighter inset panel as the conversation.
 */
export type AgentInfoProps = {
  logo: ReactNode;
  name: string;
  description?: string;
  verified?: boolean;
  /** 1440 x 448 banner; a brand gradient stands in when omitted */
  banner?: ReactNode;
  website?: string;
  phone?: string;
  email?: string;
  /** show the privacy policy and terms links */
  legal?: boolean;
};

export function AgentInfo({ logo, name, description, verified = false, banner, website, phone, email, legal = true }: AgentInfoProps) {
  type Row = { icon: ReactNode; text: string; label: string };
  const rows: Row[] = [];
  if (website) rows.push({ icon: <Globe size={20} aria-hidden="true" />, text: website, label: "Website" });
  if (phone) rows.push({ icon: <Phone size={20} aria-hidden="true" />, text: phone, label: "Phone" });
  if (email) rows.push({ icon: <Mail size={20} aria-hidden="true" />, text: email, label: "Email" });

  return (
    <div
      style={{
        display: "flex",
        minHeight: 0,
        flex: 1,
        flexDirection: "column",
        margin: `0 ${PANEL_INSET}px ${PANEL_INSET}px`,
        overflow: "hidden",
        borderRadius: PANEL_RADIUS,
        background: "var(--ph-surface)",
      }}
    >
      <div aria-hidden="true" style={{ aspectRatio: "45 / 14", flexShrink: 0, overflow: "hidden" }}>{banner ?? <MediaPlaceholder />}</div>
      <div style={{ padding: "0 20px" }}>
        <span
          aria-hidden="true"
          style={{
            display: "grid",
            width: 72,
            height: 72,
            marginTop: -36,
            overflow: "hidden",
            placeItems: "center",
            borderRadius: 16,
            background: "#ffffff",
            boxShadow: "0 0 0 3px var(--ph-surface)",
          }}
        >
          {logo}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, fontSize: 22, fontWeight: 500, lineHeight: 1.2 }}>
          <span style={{ minWidth: 0, overflowWrap: "anywhere" }}>{name}</span>
          {verified && <VerifiedBadge size={24} />}
        </div>
        {description && (
          <p style={{ margin: "10px 0 0", fontSize: 14, lineHeight: "19px", color: "var(--ph-on-surface-variant)", overflowWrap: "anywhere" }}>
            {description}
          </p>
        )}
      </div>
      {rows.length > 0 && (
        <ul style={{ listStyle: "none", margin: "14px 0 0", padding: "6px 0", borderTop: "1px solid var(--ph-outline-variant)" }}>
          {rows.map((r) => (
            <li key={r.label} style={{ display: "flex", alignItems: "center", gap: 18, height: 48, padding: "0 20px", fontSize: 15 }}>
              <span style={{ display: "grid", placeItems: "center", color: "var(--ph-brand-text)" }}>{r.icon}</span>
              <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>{r.label}: </span>
                {r.text}
              </span>
            </li>
          ))}
        </ul>
      )}
      {legal && (
        <div style={{ display: "flex", gap: 14, padding: "8px 20px", fontSize: 13, fontWeight: 500, color: "var(--ph-brand-text)" }}>
          <span>Privacy policy</span>
          <span>Terms of service</span>
        </div>
      )}
    </div>
  );
}
