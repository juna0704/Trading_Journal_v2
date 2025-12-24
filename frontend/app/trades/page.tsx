"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { DashboardLayout } from "../../components/layout/dashboard-layout";
import { BookOpen } from "lucide-react";

export default function TradesPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-8 animate-fade-in">
          <div>
            <h1 className="font-display text-4xl font-bold text-charcoal dark:text-cream">
              My Trades
            </h1>
            <p className="mt-2 text-charcoal/70 dark:text-cream/70">
              View and manage all your trades
            </p>
          </div>

          <div className="glass-strong rounded-xl p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="h-20 w-20 rounded-full bg-tan/30 dark:bg-beige/20 flex items-center justify-center mb-6">
                <BookOpen className="h-10 w-10 text-charcoal/50 dark:text-cream/50" />
              </div>
              <h2 className="font-display text-2xl font-bold text-charcoal dark:text-cream mb-2">
                No trades recorded
              </h2>
              <p className="text-charcoal/60 dark:text-cream/60 max-w-md">
                Start recording your trades to track performance and analyze
                your trading strategy
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
