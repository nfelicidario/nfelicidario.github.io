"use client";

import type { ReactNode } from "react";
import { ArrowLeft, BadgeCheck, EllipsisVertical, Phone } from "lucide-react";

/**
 * Google Messages conversation top bar for an RBM agent: back arrow, the agent logo as a
 * rounded square, display name with the verified check, an optional call icon, and overflow.
 */
export type MessagesHeaderProps = {
  /** anything 1:1; it is clipped to a rounded square */
  logo: ReactNode;
  name: string;
  verified?: boolean;
  /** small line under the name, e.g. "Verified business" or "Preview" */
  subtitle?: ReactNode;
  /** show the call icon (agents with a phone number) */
  call?: boolean;
};

export function MessagesHeader({ logo, name, verified = false, subtitle, call = false }: MessagesHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        height: 64,
        flexShrink: 0,
        alignItems: "center",
        gap: 10,
        padding: "0 8px 0 4px",
        background: "var(--ph-bg)",
      }}
    >
      <span aria-hidden="true" style={iconButton}>
        <ArrowLeft size={22} />
      </span>
      <span
        aria-hidden="true"
        style={{
          display: "grid",
          width: 36,
          height: 36,
          flexShrink: 0,
          overflow: "hidden",
          placeItems: "center",
          borderRadius: 9,
          background: "#ffffff",
        }}
      >
        {logo}
      </span>
      <div style={{ minWidth: 0, flex: 1, lineHeight: 1.2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 16, fontWeight: 500 }}>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</span>
          {verified && (
            <BadgeCheck size={16} aria-label="Verified" style={{ flexShrink: 0, color: "var(--ph-verified)" }} />
          )}
        </div>
        {subtitle && (
          <div style={{ fontSize: 12, color: "var(--ph-on-surface-variant)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {subtitle}
          </div>
        )}
      </div>
      {call && (
        <span aria-hidden="true" style={iconButton}>
          <Phone size={20} />
        </span>
      )}
      <span aria-hidden="true" style={iconButton}>
        <EllipsisVertical size={20} />
      </span>
    </div>
  );
}

const iconButton = {
  display: "grid",
  width: 40,
  height: 40,
  flexShrink: 0,
  placeItems: "center",
  borderRadius: 999,
  color: "var(--ph-on-surface)",
} as const;
