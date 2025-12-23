import { ThemeToggle } from "../ui/theme-toggle";
import Link from "next/link";
import { TrendingUp } from "lucide-react";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-beige to-tan dark:from-charcoal dark:via-charcoal dark:to-charcoal/90 flex flex-col">
      <header className="p-4 sm:p-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-10 w-10 rounded-lg bg-charcoal dark:bg-cream flex items-center justify-center group-hover:scale-105 transition-transform">
            <TrendingUp className="h-6 w-6 text-cream dark:text-charcoal" />
          </div>
          <span className="font-display text-xl font-bold text-charcoal dark:text-cream">
            Trading Journal
          </span>
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          <div className="glass-strong rounded-2xl shadow-2xl p-8 sm:p-10 animate-fade-in">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
