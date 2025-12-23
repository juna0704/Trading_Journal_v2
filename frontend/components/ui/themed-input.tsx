import * as React from "react";
import { cn } from "@/lib/cn";

export interface ThemedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

const ThemedInput = React.forwardRef<HTMLInputElement, ThemedInputProps>(
  ({ className, type, error, label, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium mb-2 text-charcoal dark:text-cream">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex h-12 w-full rounded-lg border-2 bg-white dark:bg-charcoal px-4 py-2 text-base",
            "border-tan dark:border-beige/30",
            "text-charcoal dark:text-cream placeholder:text-charcoal/50 dark:placeholder:text-cream/50",
            "transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-charcoal dark:focus:ring-cream focus:border-transparent",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 dark:border-red-400 focus:ring-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);
ThemedInput.displayName = "ThemedInput";

export { ThemedInput };
