"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-lg border px-3 py-2 text-sm transition-colors",
        // light mode
        "bg-cream border-tan text-charcoal placeholder:text-charcoal/50",
        // dark mode
        "dark:bg-charcoal dark:border-cream/30 dark:text-cream dark:placeholder:text-cream/50",
        // focus
        "focus:outline-none focus:ring-2 focus:ring-charcoal dark:focus:ring-cream",
        // disabled
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});
