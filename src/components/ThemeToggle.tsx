"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, SunMoon } from "lucide-react";

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
      className="ml-1 rounded-full border border-rule p-1.5 text-muted transition-colors hover:border-accent hover:text-ink"
    >
      {theme === "light" ? <Sun size={14} /> : theme === "dark" ? <Moon size={14} /> : <SunMoon size={14} />}
      <span className="sr-only">{label}</span>
    </button>
  );
}
