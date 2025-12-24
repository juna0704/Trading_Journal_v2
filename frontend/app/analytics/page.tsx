"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-8 animate-fade-in">
          <div>
            <h1 className="font-display text-4xl font-bold text-charcoal dark:text-cream">
              Analytics
            </h1>
            <p className="mt-2 text-charcoal/70 dark:text-cream/70">
              Analyze your trading performance with detailed insights
            </p>
          </div>

          <div className="glass-strong rounded-xl p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="h-20 w-20 rounded-full bg-tan/30 dark:bg-beige/20 flex items-center justify-center mb-6">
                <BarChart3 className="h-10 w-10 text-charcoal/50 dark:text-cream/50" />
              </div>
              <h2 className="font-display text-2xl font-bold text-charcoal dark:text-cream mb-2">
                No analytics available
              </h2>
              <p className="text-charcoal/60 dark:text-cream/60 max-w-md">
                Analytics will appear here once you start recording trades
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
