"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Database,
  BarChart2,
  LayoutGrid,
  Calendar as CalendarIcon,
  TrendingUp,
  TrendingDown,
  Clock,
  Zap,
} from "lucide-react";

export default function TradeDetailedPage() {
  const [selectedYear, setSelectedYear] = useState(2021);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6 animate-fade-in pb-10 text-white">
          {/* NAVIGATION HEADER (Synced with App UI) */}
          <div className="flex items-center gap-8 bg-[#151718] p-6 rounded-[2rem] border border-white/5">
            {[
              { id: "db", label: "Database", icon: Database },
              { id: "ov", label: "Overview", icon: BarChart2 },
              { id: "dt", label: "Detailed", icon: LayoutGrid, active: true },
              { id: "ca", label: "Calendar", icon: CalendarIcon },
            ].map((item) => (
              <div
                key={item.id}
                className="flex flex-col items-center gap-1 cursor-pointer group"
              >
                <div
                  className={`h-12 w-12 rounded-full border-2 flex items-center justify-center transition-all ${
                    item.active
                      ? "border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                      : "border-white/10 opacity-40 group-hover:opacity-100"
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 ${
                      item.active ? "text-blue-400" : "text-white"
                    }`}
                  />
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-tighter ${
                    item.active ? "text-white" : "text-[#9BA3AF]"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* LEFT COLUMN: WIN/LOSS & P&L CHART */}
            <div className="xl:col-span-4 space-y-6">
              {/* Win x Losses Card */}
              <div className="bg-[#151718] rounded-[2.5rem] p-8 border border-white/5">
                <h3 className="text-[10px] font-bold uppercase text-[#9BA3AF] mb-6">
                  Wins x Losses
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <StatBox
                    label="Wins"
                    value="133"
                    icon={<TrendingUp className="text-blue-400 h-4 w-4" />}
                  />
                  <StatBox label="Avg Win" value="$20" />
                  <StatBox
                    label="Losses"
                    value="164"
                    icon={<TrendingDown className="text-white h-4 w-4" />}
                  />
                  <StatBox label="Avg Loss" value="-$9" />
                  <StatBox label="Largest Win" value="$91" />
                  <StatBox
                    label="Holding Time"
                    value="0.0 days"
                    icon={<Clock className="text-blue-400 h-4 w-4" />}
                  />
                </div>
              </div>

              {/* P&L Last 50 Trades Mini Chart */}
              <div className="bg-[#151718] rounded-[2.5rem] p-8 border border-white/5 h-64">
                <h3 className="text-[10px] font-bold uppercase text-[#9BA3AF] mb-4">
                  P&L Last 50 Trades
                </h3>
                <div className="flex items-end gap-1 h-32">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-t-sm ${
                        i % 3 === 0 ? "bg-white h-8" : "bg-blue-500 h-16"
                      }`}
                      style={{ height: `${Math.random() * 100}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* CENTER COLUMN: STREAKS & SUMMARY */}
            <div className="xl:col-span-3 space-y-6">
              <div className="bg-[#151718] rounded-[2.5rem] p-8 border border-white/5 text-center">
                <p className="text-[10px] uppercase text-[#9BA3AF] mb-2">
                  Total Gross
                </p>
                <p className="text-4xl font-bold">$1,141</p>
                <div className="my-6 border-t border-white/5 pt-6">
                  <p className="text-[10px] uppercase text-[#9BA3AF] mb-2">
                    Total Net
                  </p>
                  <p className="text-4xl font-bold text-white">-$103</p>
                </div>
              </div>

              <div className="bg-[#151718] rounded-[2.5rem] p-8 border border-white/5">
                <h3 className="text-[10px] font-bold uppercase text-[#9BA3AF] mb-6 text-center">
                  Streak
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-400 text-xs font-bold uppercase">
                      Winning Streak
                    </span>
                    <div className="text-right text-[10px]">
                      <p>
                        Max:{" "}
                        <span className="text-blue-400 font-bold">5 days</span>
                      </p>
                      <p>
                        Current:{" "}
                        <span className="text-blue-400 font-bold">1 days</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-t border-white/5 pt-4">
                    <span className="text-white text-xs font-bold uppercase">
                      Losing Streak
                    </span>
                    <div className="text-right text-[10px]">
                      <p>
                        Max:{" "}
                        <span className="text-white font-bold">16 days</span>
                      </p>
                      <p>
                        Current:{" "}
                        <span className="text-white font-bold">0 days</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: DISTRIBUTION CHARTS */}
            <div className="xl:col-span-5 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* P&L by Day of Week */}
                <div className="bg-[#151718] rounded-[2.5rem] p-6 border border-white/5">
                  <h3 className="text-[10px] font-bold uppercase text-[#9BA3AF] mb-4">
                    P&L by Day
                  </h3>
                  <div className="space-y-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
                      <div key={day} className="flex items-center gap-2">
                        <span className="text-[8px] w-8">{day}</span>
                        <div className="flex-1 bg-white/5 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-500 h-full"
                            style={{ width: `${Math.random() * 80}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Trades List */}
                <div className="bg-[#151718] rounded-[2.5rem] p-6 border border-white/5">
                  <h3 className="text-[10px] font-bold uppercase text-[#9BA3AF] mb-4">
                    P&L Top Trades
                  </h3>
                  <div className="space-y-3">
                    {["RIOT", "AMC", "MRNA"].map((ticker) => (
                      <div
                        key={ticker}
                        className="flex justify-between items-center"
                      >
                        <span className="text-[10px] font-bold">{ticker}</span>
                        <div className="w-24 bg-white/5 h-2 rounded-full overflow-hidden">
                          <div className="bg-blue-400 h-full w-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Strategy Selector & Period Filter */}
              <div className="bg-[#151718] rounded-[2.5rem] p-8 border border-white/5">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-[#9BA3AF] mb-4">
                      Year Selection
                    </p>
                    <div className="flex gap-2">
                      {[2019, 2020, 2021].map((y) => (
                        <button
                          key={y}
                          className={`px-4 py-1.5 rounded-xl text-[10px] font-bold border ${
                            y === 2021
                              ? "bg-blue-600 border-blue-500"
                              : "border-white/10 text-[#9BA3AF]"
                          }`}
                        >
                          {y}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-[#9BA3AF] mb-4">
                      Strategy
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["Breakout", "FRD", "Gapper"].map((s) => (
                        <button
                          key={s}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border border-white/10 ${
                            s === "Gapper"
                              ? "bg-blue-500 text-white"
                              : "text-[#9BA3AF]"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function StatBox({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="bg-[#0B0C0D] p-4 rounded-2xl border border-white/5 relative group hover:border-blue-500/30 transition-all">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[8px] font-bold uppercase text-[#9BA3AF]">
          {label}
        </span>
        {icon}
      </div>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}
