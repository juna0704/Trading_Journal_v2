"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Calendar as CalendarIcon,
  Database,
  LayoutGrid,
  BarChart2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function TradeDetailsPage() {
  const [selectedYear, setSelectedYear] = useState(2021);
  const [selectedMonth, setSelectedMonth] = useState("Jan");

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6 animate-fade-in pb-10 text-white">
          {/* HEADER NAVIGATION (Synced with Spreadsheet Screenshot) */}
          <div className="flex items-center gap-8 bg-[#151718] p-6 rounded-[2rem] border border-white/5">
            {[
              { id: "db", label: "Database", icon: Database },
              { id: "ov", label: "Overview", icon: BarChart2 },
              { id: "dt", label: "Detailed", icon: LayoutGrid },
              { id: "ca", label: "Calendar", icon: CalendarIcon, active: true },
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
            {/* LEFT COLUMN: INTERACTIVE CALENDAR */}
            <div className="xl:col-span-5 bg-[#151718] rounded-[2.5rem] p-8 border border-white/5">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-blue-500">2021</h2>
                <h2 className="text-2xl font-bold uppercase tracking-widest">
                  January
                </h2>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center">
                {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                  <div key={d} className="text-blue-400 text-xs font-bold pb-4">
                    {d}
                  </div>
                ))}
                {/* Mock Calendar Days with P&L */}
                {Array.from({ length: 31 }).map((_, i) => {
                  const day = i + 1;
                  const pnl =
                    day === 12 ? -28 : day === 14 ? 12 : day === 21 ? 21 : null;
                  return (
                    <div
                      key={i}
                      className={`h-14 border border-white/5 rounded-xl flex flex-col items-center justify-center relative ${
                        pnl ? "bg-white/5" : ""
                      }`}
                    >
                      <span className="text-[10px] text-[#9BA3AF] absolute top-1 left-2">
                        {day}
                      </span>
                      {pnl && (
                        <span
                          className={`text-[10px] font-bold ${
                            pnl > 0 ? "text-blue-400" : "text-white"
                          }`}
                        >
                          {pnl > 0 ? `$${pnl}` : `-$${Math.abs(pnl)}`}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 text-right">
                <p className="text-[10px] text-[#9BA3AF] font-bold italic">
                  37 Trades
                </p>
              </div>
            </div>

            {/* MIDDLE COLUMN: SUMMARIES */}
            <div className="xl:col-span-3 space-y-6">
              <div className="bg-[#151718] rounded-[2.5rem] p-8 border border-white/5 text-center">
                <h3 className="text-[#9BA3AF] text-xs font-bold uppercase mb-6">
                  Day Summary
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] uppercase text-[#9BA3AF]">
                      Total Gross
                    </p>
                    <p className="text-2xl font-bold">$20</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-[#9BA3AF]">
                      Total Net
                    </p>
                    <p className="text-2xl font-bold text-white">-$5</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#151718] rounded-[2.5rem] p-8 border border-white/5 text-center">
                <h3 className="text-[#9BA3AF] text-xs font-bold uppercase mb-6">
                  Month Summary
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] uppercase text-[#9BA3AF]">
                      Total Gross
                    </p>
                    <p className="text-2xl font-bold">$240</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-[#9BA3AF]">
                      Total Net
                    </p>
                    <p className="text-2xl font-bold text-blue-400">$49</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: JOURNAL LOG */}
            <div className="xl:col-span-4 bg-[#151718] rounded-[2.5rem] p-8 border border-white/5 relative">
              <div className="flex justify-between items-center mb-8">
                <span className="bg-white/10 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  Journal
                </span>
                <span className="text-blue-400 text-[10px] font-mono">
                  1/21/2021
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { sym: "PLUG", pnl: -23 },
                  { sym: "BBIG", pnl: -5 },
                  { sym: "BBIG", pnl: 28 },
                  { sym: "GENE", pnl: 15 },
                  { sym: "GENE", pnl: 5 },
                ].map((log, idx) => (
                  <div
                    key={idx}
                    className="bg-[#0B0C0D] p-4 rounded-2xl border border-white/5"
                  >
                    <div className="flex justify-between mb-2">
                      <span className="text-blue-400 text-[10px] font-bold">
                        {log.sym}
                      </span>
                      <span
                        className={`text-[10px] font-bold ${
                          log.pnl > 0 ? "text-white" : "text-white/60"
                        }`}
                      >
                        {log.pnl > 0 ? `$${log.pnl}` : `-$${Math.abs(log.pnl)}`}
                      </span>
                    </div>
                    <p className="text-[8px] text-[#9BA3AF] leading-relaxed">
                      Example text Example text Example text Example text
                      Example text
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BOTTOM FILTERS: YEAR / MONTH / DAY */}
          <div className="bg-[#151718] rounded-[2rem] p-6 border border-white/5 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold uppercase text-[#9BA3AF] w-12">
                Year
              </span>
              <div className="flex gap-2">
                {[2019, 2020, 2021].map((y) => (
                  <button
                    key={y}
                    onClick={() => setSelectedYear(y)}
                    className={`px-4 py-1 rounded-lg text-xs font-bold border transition ${
                      selectedYear === y
                        ? "bg-blue-600 border-blue-500"
                        : "border-white/10 text-[#9BA3AF]"
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold uppercase text-[#9BA3AF] w-12">
                Month
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ].map((m) => (
                  <button
                    key={m}
                    onClick={() => setSelectedMonth(m)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold border transition ${
                      selectedMonth === m
                        ? "bg-blue-600 border-blue-500"
                        : "border-white/10 text-[#9BA3AF]"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold uppercase text-[#9BA3AF] w-12">
                Day
              </span>
              <div className="flex flex-wrap gap-1">
                {Array.from({ length: 31 }).map((_, i) => (
                  <button
                    key={i}
                    className={`h-8 w-8 rounded-lg text-[10px] font-bold border flex items-center justify-center transition ${
                      i === 20
                        ? "bg-blue-600 border-blue-500"
                        : "border-white/10 text-[#9BA3AF]"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
