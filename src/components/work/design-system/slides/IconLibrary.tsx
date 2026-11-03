"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Bell,
  CalendarDays,
  Check,
  Copy,
  Download,
  Flag,
  Image as ImageIcon,
  Mail,
  MessageSquare,
  Pencil,
  Phone,
  Plus,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Trash2,
  Upload,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";

/*
 * Slide 4: the rebuilt icon library. A searchable grid that finds icons by Lucide's tags, product words,
 * and the old icon names; the four categories; the style rules; and the build check that rejects an
 * off-spec icon. Names and tags are illustrative.
 */

type Entry = { Icon: LucideIcon; name: string; old: string; tags: string[]; custom?: boolean };

const ICONS: Entry[] = [
  { Icon: Search, name: "search", old: "ico-magnifier", tags: ["find", "lookup", "filter"] },
  { Icon: Plus, name: "plus", old: "ico-add-circle", tags: ["add", "new", "create"] },
  { Icon: Trash2, name: "trash", old: "ico-bin", tags: ["delete", "remove", "discard"] },
  { Icon: Pencil, name: "pencil", old: "ico-edit-pen", tags: ["edit", "rename", "change"] },
  { Icon: Send, name: "send", old: "ico-paper-plane", tags: ["message", "deliver", "campaign"] },
  { Icon: MessageSquare, name: "message-square", old: "ico-chat-bubble", tags: ["sms", "rcs", "conversation"] },
  { Icon: Users, name: "users", old: "ico-people-group", tags: ["audience", "contacts", "subscribers"] },
  { Icon: CalendarDays, name: "calendar-days", old: "ico-cal", tags: ["schedule", "date", "when"] },
  { Icon: Bell, name: "bell", old: "ico-notify", tags: ["alert", "notification", "push"] },
  { Icon: Settings, name: "settings", old: "ico-cog", tags: ["gear", "preferences", "configure"] },
  { Icon: Download, name: "download", old: "ico-dl-arrow", tags: ["export", "save", "report"] },
  { Icon: Upload, name: "upload", old: "ico-ul-arrow", tags: ["import", "file", "list"] },
  { Icon: Copy, name: "copy", old: "ico-duplicate", tags: ["clone", "duplicate", "clipboard"] },
  { Icon: Mail, name: "mail", old: "ico-envelope", tags: ["email", "inbox", "letter"] },
  { Icon: ShieldCheck, name: "shield-check", old: "ico-verified-shield", tags: ["verified", "brand", "trust"] },
  { Icon: Phone, name: "toll-free", old: "ico-tfn-badge", tags: ["tfn", "sender", "number", "custom"], custom: true },
];

const CATEGORIES = ["UI icons", "Flags", "Logos", "Illustrations"] as const;

export function IconLibrary() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("UI icons");
  const hits = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return ICONS;
    return ICONS.filter((e) => e.name.includes(t) || e.old.includes(t) || e.tags.some((x) => x.includes(t)));
  }, [q]);

  return (
    <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
      {/* the library */}
      <div className="bubble-sm overflow-hidden border border-rule bg-bg">
        <div className="flex flex-wrap items-center gap-2 border-b border-rule px-3 py-2.5">
          <span className="font-display text-[14px] font-bold text-ink">@nexus/icons</span>
          <span className="label text-muted">core</span>
          <label className="ml-auto flex min-w-[180px] flex-1 items-center gap-2 rounded-full border border-rule bg-surface px-3 py-1.5 text-[12.5px] text-muted sm:max-w-[260px]">
            <Search size={13} aria-hidden="true" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Try “delete”, “bin”, or “tfn”"
              aria-label="Search icons"
              className="w-full bg-transparent text-ink outline-none placeholder:text-muted"
            />
            {q && (
              <button type="button" aria-label="Clear" onClick={() => setQ("")} className="text-muted hover:text-ink">
                <X size={12} />
              </button>
            )}
          </label>
        </div>
        <div className="flex items-center gap-1 overflow-x-auto border-b border-rule px-3 py-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={cat === c}
              onClick={() => setCat(c)}
              className={`label shrink-0 rounded-full px-2.5 py-1 transition-colors ${cat === c ? "bg-accent-soft text-accent" : "text-muted hover:bg-raised hover:text-ink"}`}
            >
              {c}
            </button>
          ))}
          <span className="ml-auto shrink-0 text-[11.5px] text-muted">Each gets its own set</span>
        </div>
        {cat === "UI icons" ? (
          <ul className="grid grid-cols-3 gap-2 p-3 sm:grid-cols-4">
            {hits.map(({ Icon, name, old, custom }) => (
              <li key={name} className={`bubble-sm border p-2.5 ${custom ? "border-accent bg-accent-soft/40" : "border-rule bg-surface"}`}>
                <div className="flex items-center justify-between">
                  <Icon size={20} className="text-ink" aria-hidden="true" />
                  {custom && <span className="label text-accent">custom</span>}
                </div>
                <div className="mt-2 truncate text-[12px] font-semibold text-ink">{name}</div>
                <div className="truncate text-[11px] text-muted">was {old}</div>
              </li>
            ))}
            {hits.length === 0 && <li className="col-span-full py-6 text-center text-[13px] text-muted">No icon by that word yet. Propose one.</li>}
          </ul>
        ) : (
          <div className="grid place-items-center gap-2 p-8 text-center text-[13px] text-muted">
            {cat === "Flags" && <Flag size={22} aria-hidden="true" />}
            {cat === "Logos" && <ShieldCheck size={22} aria-hidden="true" />}
            {cat === "Illustrations" && <ImageIcon size={22} aria-hidden="true" />}
            <span>
              {cat} are not UI icons. They keep their own colours and shapes in a set of their own, instead of sharing one with the UI icons.
            </span>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-rule px-3 py-2 text-[11.5px] text-muted">
          <span>
            <span className="font-semibold text-ink">Manifest:</span> source lucide · 15, custom · 1
          </span>
          <span>Old names stay available during the migration</span>
        </div>
      </div>

      {/* the rules and the check */}
      <div className="grid content-start gap-3">
        <div className="bubble-sm border border-rule bg-bg p-4">
          <div className="label mb-2">The rules, from Lucide</div>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[12.5px] text-body">
            <li className="flex items-center gap-1.5"><Check size={12} className="text-accent" aria-hidden="true" /> 24 × 24 canvas</li>
            <li className="flex items-center gap-1.5"><Check size={12} className="text-accent" aria-hidden="true" /> 2px stroke</li>
            <li className="flex items-center gap-1.5"><Check size={12} className="text-accent" aria-hidden="true" /> Rounded ends and corners</li>
            <li className="flex items-center gap-1.5"><Check size={12} className="text-accent" aria-hidden="true" /> Colour follows the text</li>
          </ul>
          <p className="mt-2.5 text-[12px] leading-snug text-muted">Custom icons, toll-free for example, are drawn to the same rules. No exceptions.</p>
        </div>
        <div className="bubble-sm overflow-hidden border border-rule bg-bg">
          <div className="label border-b border-rule px-4 py-2">Build check</div>
          <ul className="divide-y divide-rule font-mono text-[11.5px]">
            <li className="flex items-center gap-2 px-4 py-2 text-body">
              <Check size={12} className="shrink-0 text-ok" aria-hidden="true" />
              <span className="truncate">toll-free.svg · 24×24 · stroke 2 · round</span>
            </li>
            <li className="flex items-center gap-2 px-4 py-2 text-body">
              <Check size={12} className="shrink-0 text-ok" aria-hidden="true" />
              <span className="truncate">shield-check.svg · from lucide</span>
            </li>
            <li className="flex items-start gap-2 bg-warn-soft/60 px-4 py-2 text-body">
              <AlertTriangle size={12} className="mt-0.5 shrink-0 text-warn" aria-hidden="true" />
              <span className="min-w-0">
                <span className="block truncate">ico-star-filled.svg · fill, no stroke</span>
                <span className="block text-muted">rejected: off-spec icons can&apos;t ship</span>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
