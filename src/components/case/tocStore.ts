"use client";

import { useSyncExternalStore } from "react";

/**
 * Which table-of-contents treatment a case page uses. "navbar" is the default; the others exist so
 * the treatments can be compared in place with the review toggle (open a case page with ?review).
 */
export type TocVariant = "navbar" | "bar" | "rail" | "jump" | "strip";
export const TOC_VARIANTS: { id: TocVariant; label: string; blurb: string }[] = [
  { id: "navbar", label: "Navbar", blurb: "Breadcrumb and sections in the sticky site header" },
  { id: "bar", label: "Bar", blurb: "A slim sticky bar that appears at the Summary" },
  { id: "rail", label: "Rail", blurb: "Sections and slides in the left gutter, desktop only" },
  { id: "jump", label: "Jump to", blurb: "A floating button that opens the contents" },
  { id: "strip", label: "Strip", blurb: "A static row under the hero, not sticky" },
];

const KEY = "toc-variant";
let state: TocVariant = "navbar";
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded) return;
  loaded = true;
  try {
    const v = localStorage.getItem(KEY) as TocVariant | null;
    if (v && TOC_VARIANTS.some((t) => t.id === v)) state = v;
  } catch {}
}

export function setTocVariant(next: TocVariant) {
  state = next;
  try {
    localStorage.setItem(KEY, next);
  } catch {}
  listeners.forEach((l) => l());
}

export function useTocVariant(): TocVariant {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => {
      load();
      return state;
    },
    () => "navbar",
  );
}
