"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ className, variant = "primary", ...props }, ref) {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal",
          "disabled:pointer-events-none disabled:opacity-50",
          {
            // primary
            "bg-charcoal text-cream hover:bg-charcoal/90 dark:bg-cream dark:text-charcoal":
              variant === "primary",

            // secondary
            "bg-tan text-charcoal hover:bg-tan/80 dark:bg-cream/20 dark:text-cream":
              variant === "secondary",

            // ghost
            "bg-transparent text-charcoal hover:bg-blush dark:text-cream dark:hover:bg-cream/10":
              variant === "ghost",
          },
          className
        )}
        {...props}
      />
    );
  }
);
