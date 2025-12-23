"use client";

import { useTheme } from "@/contexts/theme.context";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="rounded-md border border-tan px-3 py-2 text-sm
                 bg-beige text-charcoal
                 dark:bg-charcoal dark:text-cream dark:border-charcoal/40"
    >
      {theme === "light" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
