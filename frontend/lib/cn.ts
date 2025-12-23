import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn()
 * - merges conditional classNames
 * - resolves Tailwind conflicts safely
 * - production standard utility
 */
export function cn(...inputs: Parameters<typeof clsx>) {
  return twMerge(clsx(inputs));
}
