"use client";

import { useSyncExternalStore } from "react";

/** What `Beats` publishes so the page-level `CaseNav` can show slide progress without being nested in it. */
export type BeatsState = { titles: { id: string; title: string }[]; current: number };

let state: BeatsState | null = null;
const listeners = new Set<() => void>();

export function setBeats(next: BeatsState | null) {
  state = next;
  listeners.forEach((l) => l());
}

export function useBeats(): BeatsState | null {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
    () => null,
  );
}
