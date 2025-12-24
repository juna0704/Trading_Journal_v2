"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  TrendingUp,
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { ThemeToggle } from "../ui/theme-toggle";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/cn";
import { useState } from "react";
import { VerificationBanner } from "../varification-banner";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Trades", href: "/trades", icon: BookOpen },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream dark:bg-charcoal">
      <div className="lg:grid lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-[280px] lg:flex-col border-r border-tan/30 dark:border-beige/20 bg-beige/30 dark:bg-charcoal/50">
          <div className="flex flex-col flex-1 p-6 space-y-6">
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className="h-10 w-10 rounded-lg bg-charcoal dark:bg-cream flex items-center justify-center group-hover:scale-105 transition-transform">
                <TrendingUp className="h-6 w-6 text-cream dark:text-charcoal" />
              </div>
              <span className="font-display text-xl font-bold text-charcoal dark:text-cream">
                Trading Journal
              </span>
            </Link>

            <nav className="flex-1 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200",
                      isActive
                        ? "bg-charcoal dark:bg-cream text-cream dark:text-charcoal shadow-md"
                        : "text-charcoal dark:text-cream hover:bg-tan/50 dark:hover:bg-beige/10"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="space-y-3 pt-6 border-t border-tan/30 dark:border-beige/20">
              <div className="px-4">
                <p className="text-sm font-medium text-charcoal dark:text-cream">
                  {user?.firstName || "User"}
                </p>
                <p className="text-sm text-charcoal/60 dark:text-cream/60 truncate">
                  {user?.email}
                </p>
              </div>
              <button
                onClick={signOut}
                className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-base font-medium text-red-600 dark:text-red-400 hover:bg-blush/50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </button>
            </div>
          </div>
        </aside>

        <div className="lg:pl-[280px]">
          <header className="sticky top-0 z-10 bg-cream/80 dark:bg-charcoal/80 backdrop-blur-lg border-b border-tan/30 dark:border-beige/20 px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-tan/50 dark:hover:bg-beige/10"
              >
                <Menu className="h-6 w-6 text-charcoal dark:text-cream" />
              </button>

              <div className="flex items-center gap-3 ml-auto">
                <ThemeToggle />
              </div>
            </div>
          </header>

          <main className="p-4 sm:p-6 lg:p-8">
            <VerificationBanner />
            {children}
          </main>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-[280px] bg-beige dark:bg-charcoal border-r border-tan/30 dark:border-beige/20 p-6 space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <Link
                href="/dashboard"
                className="flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="h-10 w-10 rounded-lg bg-charcoal dark:bg-cream flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-cream dark:text-charcoal" />
                </div>
                <span className="font-display text-xl font-bold text-charcoal dark:text-cream">
                  Trading Journal
                </span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-tan/50 dark:hover:bg-beige/10"
              >
                <X className="h-6 w-6 text-charcoal dark:text-cream" />
              </button>
            </div>

            <nav className="flex-1 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors",
                      isActive
                        ? "bg-charcoal dark:bg-cream text-cream dark:text-charcoal"
                        : "text-charcoal dark:text-cream hover:bg-tan/50 dark:hover:bg-beige/10"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="space-y-3 pt-6 border-t border-tan/30 dark:border-beige/20">
              <div className="px-4">
                <p className="text-sm font-medium text-charcoal dark:text-cream">
                  {user?.firstName || "User"}
                </p>
                <p className="text-sm text-charcoal/60 dark:text-cream/60 truncate">
                  {user?.email}
                </p>
              </div>
              <button
                onClick={signOut}
                className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-base font-medium text-red-600 dark:text-red-400 hover:bg-blush/50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
