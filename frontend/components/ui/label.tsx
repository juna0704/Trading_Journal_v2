"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "ext-sm font-medium leading-none text-charcoal dark:text-cream",
        className
      )}
      {...props}
    />
  );
}
