"use client";

import { Camera, Image as ImageIcon, Plus, SendHorizontal } from "lucide-react";

/**
 * The Google Messages composer: attachment "+", a pill text field whose placeholder reads
 * "RCS message" when the thread is RCS capable ("Text message" for SMS), camera and gallery
 * icons, and a neutral send button (dark circle, light arrow) once there is text. It sits
 * inside the conversation panel (pass it as `ConversationPanel`'s `composer`), so the pill and
 * the round button are the off-white `--ph-surface-high` on the panel's white. Decorative;
 * nothing is focusable.
 */
export type ComposerProps = {
  placeholder?: string;
  /** typed text; shows the send button */
  text?: string;
};

export function Composer({ placeholder = "RCS message", text = "" }: ComposerProps) {
  return (
    <div
      aria-hidden="true"
      style={{
        display: "flex",
        flexShrink: 0,
        alignItems: "center",
        gap: 8,
        padding: "8px 10px 10px",
        background: "transparent",
      }}
    >
      <span style={round}>
        <Plus size={22} />
      </span>
      <span
        style={{
          display: "flex",
          minWidth: 0,
          flex: 1,
          height: 44,
          alignItems: "center",
          gap: 10,
          padding: "0 10px 0 18px",
          borderRadius: 999,
          background: "var(--ph-surface-high)",
          color: text ? "var(--ph-on-surface)" : "var(--ph-on-surface-variant)",
          fontSize: 15,
        }}
      >
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{text || placeholder}</span>
        {!text && (
          <>
            <Camera size={20} style={{ flexShrink: 0, color: "var(--ph-on-surface-variant)" }} />
            <ImageIcon size={20} style={{ flexShrink: 0, color: "var(--ph-on-surface-variant)" }} />
          </>
        )}
      </span>
      {text && (
        <span style={{ ...round, background: "var(--ph-on-surface)", color: "var(--ph-surface)" }}>
          <SendHorizontal size={20} />
        </span>
      )}
    </div>
  );
}

const round = {
  display: "grid",
  width: 44,
  height: 44,
  flexShrink: 0,
  placeItems: "center",
  borderRadius: 999,
  background: "var(--ph-surface-high)",
  color: "var(--ph-on-surface)",
} as const;
