"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";
const KEY = "theme";

function apply(t: Theme) {
  const root = document.documentElement;
  if (t === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", t);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    let saved: Theme | null = null;
    try {
      saved = localStorage.getItem(KEY) as Theme | null;
    } catch {}
    if (saved === "light" || saved === "dark") {
      const t = setTimeout(() => setTheme(saved as Theme), 0);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    apply(theme);
  }, [theme]);

  function choose(t: Theme) {
    setTheme(t);
    try {
      if (t === "system") localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, t);
    } catch {}
  }

  const next: Theme = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
  const label = theme === "light" ? "Light" : theme === "dark" ? "Dark" : "Auto";

  return (
    <button
      type="button"
      onClick={() => choose(next)}
      aria-label={`Theme: ${label}. Switch to ${next}.`}
      title={`Theme: ${label}`}
      className="bubble-sm ml-1 border border-rule px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.06em] text-muted transition-colors hover:border-accent hover:text-ink"
    >
      {label}
    </button>
  );
}
