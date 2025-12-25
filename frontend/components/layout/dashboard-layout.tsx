"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  TrendingUp,
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  Shield,
  Search,
  Bell,
  Grid,
  Database,
  LayoutGrid,
  Calendar as CalendarIcon,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/cn";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Trades", href: "/trades", icon: BookOpen },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Admin", href: "/admin", icon: Shield, adminOnly: true },
];

// Sub-navigation tabs for the "My Trades" section
const journalTabs = [
  { id: "database", label: "Database", icon: Database, href: "/trades" },
  {
    id: "detailed",
    label: "Detailed",
    icon: LayoutGrid,
    href: "/trades/detailed",
  },
  {
    id: "calendar",
    label: "Calendar",
    icon: CalendarIcon,
    href: "/trades/calendar",
  },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut, loading } = useAuth();

  if (loading) return null;

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
  const filteredNavigation = navigation.filter(
    (item) => !item.adminOnly || isAdmin
  );

  // Check if we are currently in a trade-related route to show sub-nav
  const isTradeRoute = pathname.startsWith("/trades");

  return (
    <div className="min-h-screen bg-[#0B0C0D] text-white font-sans selection:bg-[#F3723B]/30">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-[260px] lg:flex-col bg-[#0B0C0D] border-r border-white/5 z-50">
          <div className="flex flex-col flex-1 p-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 mb-10 group"
            >
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#F3723B] to-[#2ED3B7] flex items-center justify-center shadow-lg shadow-orange-950/20 group-hover:scale-105 transition-transform">
                <TrendingUp className="h-6 w-6 text-black" />
              </div>
              <span className="text-xl font-bold tracking-tight">TradeHub</span>
            </Link>

            <nav className="flex-1 space-y-2">
              {filteredNavigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href === "/trades" && isTradeRoute);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-white/5 text-white shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]"
                        : "text-[#9BA3AF] hover:text-white hover:bg-white/5"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5 transition-colors",
                        isActive ? "text-[#F3723B]" : "group-hover:text-white"
                      )}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-6 border-t border-white/5">
              <button
                onClick={signOut}
                className="flex items-center gap-3 px-4 py-3 w-full text-[#9BA3AF] hover:text-red-400 transition-colors text-sm font-medium"
              >
                <LogOut className="h-5 w-5" /> Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 lg:pl-[260px]">
          {/* Header */}
          <header className="h-20 flex items-center justify-between px-8 bg-[#0B0C0D]/80 backdrop-blur-xl sticky top-0 z-40 border-b border-white/[0.02]">
            <div>
              <h1 className="text-xl font-semibold capitalize">
                {pathname.split("/").pop() || "Dashboard"}
              </h1>
            </div>

            <div className="flex items-center gap-6">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9BA3AF]" />
                <input
                  type="text"
                  placeholder="Search trades..."
                  className="bg-[#151718] border border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#F3723B]/40 w-64 transition-all"
                />
              </div>
              <button className="p-2 rounded-xl bg-[#151718] border border-white/5 text-[#9BA3AF] hover:text-white transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#151718] border border-white/5 text-sm font-medium hover:bg-white/10 transition group">
                <Grid className="h-4 w-4 text-[#2ED3B7]" />
                <span className="text-[#9BA3AF] group-hover:text-white">
                  Widgets
                </span>
              </button>
            </div>
          </header>

          <main className="p-8 max-w-[1600px] mx-auto">
            {/* SUB-NAVIGATION (Appears only on My Trades and its sub-pages) */}
            {isTradeRoute && (
              <div className="flex items-center gap-8 bg-[#151718] p-6 rounded-[2.5rem] border border-white/5 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                {journalTabs.map((tab) => {
                  const isActive = pathname === tab.href;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => router.push(tab.href)}
                      className="flex flex-col items-center gap-1 group outline-none"
                    >
                      <div
                        className={cn(
                          "h-12 w-12 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                          isActive
                            ? "border-blue-500 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                            : "border-white/10 opacity-40 group-hover:opacity-100 group-hover:border-white/30"
                        )}
                      >
                        <tab.icon
                          className={cn(
                            "h-5 w-5",
                            isActive ? "text-blue-400" : "text-white"
                          )}
                        />
                      </div>
                      <span
                        className={cn(
                          "text-[10px] font-bold uppercase tracking-tighter transition-colors",
                          isActive ? "text-white" : "text-[#9BA3AF]"
                        )}
                      >
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Page Content */}
            <div className="animate-in fade-in duration-700">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
