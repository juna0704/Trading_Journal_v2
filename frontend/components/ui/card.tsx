"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border p-6 shadow-sm transition-colors",
        // light
        "bg-beige border-tan text-charcoal",
        // dark
        "dark:bg-charcoal dark:border-cream/20 dark:text-cream",
        className
      )}
      {...props}
    />
  );
}
