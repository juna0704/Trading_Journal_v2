"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ProtectedRoute } from "@/components/protected-route";
import { useAdminUsers } from "@/features/admin/hooks/useAdminUser";
import { AdminUsersTable } from "@/features/admin/components/AdminUserTable";
import {
  Search,
  Calendar,
  Filter,
  MoreHorizontal,
  TrendingUp,
} from "lucide-react";

export default function AdminPage() {
  const { users, stats, loading, activate, deactivate, actionLoading } =
    useAdminUsers();

  if (loading) return null;

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-full mx-auto space-y-8 animate-fade-in text-white pb-10">
          {/* TOP HEADER & SEARCH (Inspired by Image 6) */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-3xl font-bold">Sales Overview</h1>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9BA3AF]" />
                <input
                  type="text"
                  placeholder="Search product..."
                  className="w-full bg-[#151718] border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#F3723B]/50"
                />
              </div>
              <button className="flex items-center gap-2 bg-[#151718] border border-white/5 px-4 py-3 rounded-2xl text-xs font-bold text-[#9BA3AF]">
                <Calendar className="h-4 w-4" />
                April 10, 2026 - May 11, 2026
              </button>
            </div>
          </div>

          {/* ADMIN STATS CARDS (Updated to match Image 6 styles) */}
          <AdminStats stats={stats} />

          {/* CHARTS SECTION (Logic intact, Visuals from Image 6) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Revenue Analytics Bar Chart */}
            <div className="lg:col-span-2 bg-[#151718] rounded-[2.5rem] p-8 border border-white/5">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-bold">Revenue analytics</h3>
                <select className="bg-[#0B0C0D] border border-white/5 text-xs rounded-lg px-3 py-1.5 outline-none">
                  <option>This Week</option>
                </select>
              </div>
              <div className="h-64 flex items-end gap-4 px-2">
                {[40, 60, 30, 90, 50, 70, 45].map((val, i) => (
                  <div
                    key={i}
                    className="group relative flex-1 flex flex-col items-center gap-2"
                  >
                    {i === 3 && (
                      <div className="absolute -top-10 bg-[#F3723B] text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg">
                        $22,430
                      </div>
                    )}
                    <div
                      className={`w-full rounded-2xl transition-all duration-500 ${
                        i === 3
                          ? "bg-[#F3723B]"
                          : "bg-[#F3723B]/20 group-hover:bg-[#F3723B]/40"
                      }`}
                      style={{ height: `${val}%` }}
                    ></div>
                    <span className="text-[10px] text-[#9BA3AF] uppercase">
                      {["Fri", "Sat", "Sun", "Mon", "Thu", "Wen", "Thus"][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Income Doughnut/Stacked Chart Area */}
            <div className="bg-[#151718] rounded-[2.5rem] p-8 border border-white/5">
              <h3 className="text-lg font-bold mb-1">Total Income</h3>
              <p className="text-xs text-[#9BA3AF] mb-8">
                View your income in a certain period of time
              </p>

              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-[#F3723B]"></div>{" "}
                      <span className="text-[10px] text-[#9BA3AF]">Profit</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-white"></div>{" "}
                      <span className="text-[10px] text-[#9BA3AF]">Loss</span>
                    </div>
                  </div>
                </div>
                {/* Visual Representation of Stacked Profit/Loss */}
                <div className="h-48 flex items-end gap-3 justify-center">
                  {[30, 50, 80, 40, 60, 20].map((h, i) => (
                    <div key={i} className="w-4 flex flex-col gap-1">
                      <div
                        className="bg-white/10 rounded-t-sm"
                        style={{ height: `${h / 2}%` }}
                      ></div>
                      <div
                        className="bg-[#F3723B] rounded-b-sm"
                        style={{ height: `${h}%` }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* USERS TABLE SECTION (Your exact logic applied to Image 6 "Recent Orders" style) */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-xl font-bold">Recent User Activity</h3>
              <div className="flex gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#9BA3AF]" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="bg-[#151718] border border-white/5 rounded-xl pl-9 pr-4 py-2 text-xs"
                  />
                </div>
                <button className="flex items-center gap-2 bg-[#151718] border border-white/5 px-3 py-2 rounded-xl text-xs text-[#9BA3AF]">
                  <Filter className="h-3.5 w-3.5" /> Sort by
                </button>
              </div>
            </div>

            <AdminUsersTable
              users={users}
              activate={activate}
              deactivate={deactivate}
              actionLoading={actionLoading}
            />
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

export function AdminStats({ stats }: { stats: any }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      <Stat
        label="Total Users"
        value={stats.total}
        trend="+4.9%"
        subText="Last month: 2345"
      />
      <Stat
        label="Active Users"
        value={stats.active}
        trend="+7.5%"
        subText="Last month: 89"
      />
      <Stat
        label="Inactive"
        value={stats.inactive}
        trend="-6.0%"
        subText="Last month: 60"
        isDown
      />
      <Stat
        label="Total Verified"
        value={stats.verified}
        prefix="$"
        trend="+$620.00"
        subText="Last month"
      />
    </div>
  );
}

function Stat({ label, value, trend, subText, isDown, prefix }: any) {
  return (
    <div className="bg-[#151718] rounded-[2.5rem] p-8 border border-white/5 flex flex-col justify-between h-48">
      <div className="flex justify-between items-start">
        <p className="text-sm font-medium text-[#9BA3AF]">{label}</p>
        <div className="p-2 bg-[#0B0C0D] rounded-xl border border-white/5">
          <TrendingUp
            className={`h-4 w-4 ${
              isDown ? "text-red-400 rotate-180" : "text-[#2ED3B7]"
            }`}
          />
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2">
          <p className="text-4xl font-bold tracking-tighter">
            {prefix}
            {value.toLocaleString()}
          </p>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isDown
                ? "bg-red-400/10 text-red-400"
                : "bg-[#2ED3B7]/10 text-[#2ED3B7]"
            }`}
          >
            {trend}
          </span>
        </div>
        <p className="text-[10px] text-[#9BA3AF] mt-2">{subText}</p>
      </div>
    </div>
  );
}
