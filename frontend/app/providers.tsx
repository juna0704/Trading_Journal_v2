"use client";

import { AuthProvider } from "@/contexts/auth-context";
import { ThemeProvider } from "@/contexts/theme.context";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            classNames: {
              toast: "glass-strong",
              title: "text-charcoal dark:text-cream",
              description: "text-charcoal/70 dark:text-cream/70",
              actionButton:
                "bg-charcoal dark:bg-cream text-cream dark:text-charcoal",
              cancelButton:
                "bg-tan dark:bg-beige/20 text-charcoal dark:text-cream",
              closeButton:
                "bg-tan/50 dark:bg-beige/10 text-charcoal dark:text-cream",
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}
