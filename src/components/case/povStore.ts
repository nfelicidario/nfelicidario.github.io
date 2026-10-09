"use client";

import { useSyncExternalStore } from "react";

/**
 * A tiny shared store so a prototype can change the case page's POV badge as it moves
 * through phases (e.g. "Operations · Before" → "Operations · After"). The badge reads it;
 * prototypes write it with `setPov` and clear it on unmount.
 */
export type PovState = {
  /** the fixed part, e.g. "Customer" or "Operations" */
  label: string;
  /** the changing part, e.g. "Before" or "After"; shown bold with a slow pulse */
  phase?: string;
  /** "muted" renders gray (the before state), "accent" renders portfolio blue */
  tone?: "muted" | "accent";
};

let state: PovState | null = null;
const listeners = new Set<() => void>();

export function setPov(next: PovState | null) {
  state = next;
  listeners.forEach((l) => l());
}

export function usePov(): PovState | null {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
    () => null,
  );
}
