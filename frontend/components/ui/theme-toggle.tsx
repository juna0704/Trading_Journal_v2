"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/theme.context";
import { cn } from "@/lib/cn";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative h-12 w-12 rounded-lg flex items-center justify-center",
        "bg-beige/50 dark:bg-beige/10 hover:bg-tan/50 dark:hover:bg-beige/20",
        "transition-all duration-200 border-2 border-transparent",
        "hover:border-tan dark:hover:border-beige/30",
        className
      )}
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0 text-charcoal" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100 text-cream" />
    </button>
  );
}
