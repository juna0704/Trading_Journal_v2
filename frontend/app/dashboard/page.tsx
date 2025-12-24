"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/contexts/auth-context";
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    {
      name: "Total Trades",
      value: "0",
      icon: Activity,
      change: "+0%",
      changeType: "positive",
    },
    {
      name: "Win Rate",
      value: "0%",
      icon: TrendingUp,
      change: "+0%",
      changeType: "positive",
    },
    {
      name: "Total P&L",
      value: "$0.00",
      icon: DollarSign,
      change: "+$0.00",
      changeType: "positive",
    },
    {
      name: "Avg. Trade",
      value: "$0.00",
      icon: TrendingDown,
      change: "+0%",
      changeType: "positive",
    },
  ];

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-8 animate-fade-in">
          <div>
            <h1 className="font-display text-4xl font-bold text-charcoal dark:text-cream">
              Welcome back, {user?.firstName || "Trader"}!
            </h1>
            <p className="mt-2 text-charcoal/70 dark:text-cream/70">
              Here's an overview of your trading performance
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.name}
                className="glass rounded-xl p-6 space-y-3 hover:scale-105 transition-transform duration-200"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-charcoal/70 dark:text-cream/70">
                    {stat.name}
                  </p>
                  <div className="h-10 w-10 rounded-lg bg-charcoal/10 dark:bg-cream/10 flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-charcoal dark:text-cream" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-bold text-charcoal dark:text-cream">
                    {stat.value}
                  </p>
                  <p
                    className={`text-sm mt-1 ${
                      stat.changeType === "positive"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {stat.change} from last month
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-strong rounded-xl p-8">
            <h2 className="font-display text-2xl font-bold text-charcoal dark:text-cream mb-4">
              Recent Activity
            </h2>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-16 w-16 rounded-full bg-tan/30 dark:bg-beige/20 flex items-center justify-center mb-4">
                <Activity className="h-8 w-8 text-charcoal/50 dark:text-cream/50" />
              </div>
              <p className="text-lg font-medium text-charcoal dark:text-cream">
                No trades yet
              </p>
              <p className="text-charcoal/60 dark:text-cream/60 mt-1">
                Start tracking your trades to see them here
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="glass rounded-xl p-6">
              <h3 className="font-display text-xl font-bold text-charcoal dark:text-cream mb-4">
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-tan/30 dark:border-beige/20">
                  <span className="text-charcoal/70 dark:text-cream/70">
                    Best Trade
                  </span>
                  <span className="font-semibold text-charcoal dark:text-cream">
                    $0.00
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-tan/30 dark:border-beige/20">
                  <span className="text-charcoal/70 dark:text-cream/70">
                    Worst Trade
                  </span>
                  <span className="font-semibold text-charcoal dark:text-cream">
                    $0.00
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-charcoal/70 dark:text-cream/70">
                    Profit Factor
                  </span>
                  <span className="font-semibold text-charcoal dark:text-cream">
                    0.00
                  </span>
                </div>
              </div>
            </div>

            <div className="glass rounded-xl p-6">
              <h3 className="font-display text-xl font-bold text-charcoal dark:text-cream mb-4">
                Trading Streak
              </h3>
              <div className="flex flex-col items-center justify-center py-8">
                <div className="text-6xl font-bold text-charcoal dark:text-cream mb-2">
                  0
                </div>
                <p className="text-charcoal/70 dark:text-cream/70">days</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
