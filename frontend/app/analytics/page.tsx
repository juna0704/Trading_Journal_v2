"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Maximize2,
  Search,
  Filter,
  Info,
  ShieldAlert,
  Globe,
  Twitter,
  Send,
} from "lucide-react";

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="flex flex-col lg:flex-row gap-6 animate-fade-in text-white pb-10">
          {/* LEFT SIDEBAR: TOKEN STATS & SAFETY (Exact replica of Image 3 Left) */}
          <aside className="w-full lg:w-80 space-y-6">
            <div className="bg-[#151718] rounded-3xl p-6 border border-white/5">
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#9BA3AF]">Total supply</span>
                  <span className="font-mono">595,265,721</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9BA3AF]">Circulating supply</span>
                  <span className="font-mono">595,265,721</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-4">
                  <span className="text-[#9BA3AF]">LP Holder</span>
                  <span className="font-mono">3</span>
                </div>

                {[
                  { label: "Honeypot", val: "False", color: "text-red-400" },
                  {
                    label: "Anti Whale Check",
                    val: "True",
                    color: "text-[#2ED3B7]",
                  },
                  { label: "Opensource", val: "True", color: "text-[#2ED3B7]" },
                  {
                    label: "Ownership renounced",
                    val: "False",
                    color: "text-red-400",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between items-center"
                  >
                    <span className="text-[#9BA3AF] flex items-center gap-1">
                      {item.label} <Info className="h-3 w-3" />
                    </span>
                    <span className={`font-bold ${item.color}`}>
                      {item.val}
                    </span>
                  </div>
                ))}
              </div>

              {/* Safety Overview Section */}
              <div className="mt-8 pt-6 border-t border-white/5">
                <h4 className="text-xs font-bold text-[#9BA3AF] uppercase mb-4">
                  Safety Overview
                </h4>
                <div className="relative flex justify-center mb-4">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="44"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="transparent"
                      className="text-white/5"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="44"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray="276"
                      strokeDashoffset="160"
                      className="text-[#F3723B]"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold">42</span>
                    <span className="text-[10px] text-[#9BA3AF]">/100</span>
                  </div>
                </div>
                <p className="text-center text-[10px] font-bold text-[#F3723B] mb-6 tracking-widest">
                  HEAVILY COMPROMISED
                </p>

                <div className="space-y-4">
                  {["Supply", "Transferability", "Liquidity"].map((label) => (
                    <div key={label} className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold uppercase">
                        <span className="text-[#9BA3AF]">{label}</span>
                        <span>20%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="bg-[#F3723B] h-full w-[20%]"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Socials */}
              <div className="flex gap-4 mt-8 pt-6 border-t border-white/5 justify-center text-[#9BA3AF]">
                <Globe className="h-4 w-4 hover:text-white cursor-pointer" />
                <Twitter className="h-4 w-4 hover:text-white cursor-pointer" />
                <Send className="h-4 w-4 hover:text-white cursor-pointer" />
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 space-y-6">
            {/* Top Bar Stats */}
            <div className="bg-[#151718] rounded-3xl p-6 border border-white/5 flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-purple-600 rounded-lg flex items-center justify-center font-bold">
                  O
                </div>
                <div>
                  <h2 className="text-lg font-bold">
                    OSMO{" "}
                    <span className="text-[#9BA3AF] font-normal">Osmosis</span>
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold font-mono">$0.324</span>
                    <span className="text-[#2ED3B7] text-xs font-bold">
                      ▲ 3.36%
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 overflow-x-auto">
                {["MARKET CAP", "LIQUIDITY", "VOLUME (24H)", "HOLDERS"].map(
                  (stat) => (
                    <div
                      key={stat}
                      className="text-center px-4 border-l border-white/5"
                    >
                      <p className="text-[8px] text-[#9BA3AF] uppercase mb-1">
                        {stat}
                      </p>
                      <p className="text-sm font-bold">$8.49M</p>
                    </div>
                  )
                )}
                <div className="bg-[#0B0C0D] px-4 py-1 rounded-lg border border-white/5 text-[10px] flex items-center">
                  231d ago
                </div>
              </div>
            </div>

            {/* Candle Chart Section */}
            <div className="bg-[#151718] rounded-3xl p-6 border border-white/5">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs text-[#9BA3AF] font-mono">
                  OSMO/USD V3 Uniswap (Ethereum)
                </span>
                <Maximize2 className="h-4 w-4 text-[#9BA3AF]" />
              </div>
              <div className="h-80 w-full flex items-center justify-center bg-[#0B0C0D]/30 rounded-2xl border border-dashed border-white/5">
                <p className="text-xs text-[#9BA3AF]">
                  Candlestick Chart View Placeholder
                </p>
              </div>
            </div>

            {/* Mid Grid: Volume & Bubbles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#151718] rounded-3xl p-6 border border-white/5">
                <div className="flex justify-between mb-6">
                  <h3 className="text-xs font-bold text-[#9BA3AF]">
                    Transfer volume
                  </h3>
                  <select className="bg-transparent text-[10px] outline-none border-b border-white/10">
                    <option>6M</option>
                  </select>
                </div>
                <div className="h-40 flex items-end gap-1 px-2">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-blue-500/30 rounded-t-sm"
                      style={{ height: `${Math.random() * 100}%` }}
                    ></div>
                  ))}
                </div>
              </div>
              <div className="bg-[#151718] rounded-3xl p-6 border border-white/5">
                <div className="flex justify-between mb-6">
                  <h3 className="text-xs font-bold text-[#9BA3AF]">
                    Top Holding Wallets
                  </h3>
                  <Maximize2 className="h-3 w-3 text-[#9BA3AF]" />
                </div>
                <div className="h-40 relative flex items-center justify-center">
                  {/* Bubble map visual */}
                  <div className="w-12 h-12 rounded-full bg-blue-500/40 border border-blue-400/50 absolute top-10 left-20"></div>
                  <div className="w-20 h-20 rounded-full bg-[#2ED3B7]/20 border border-[#2ED3B7]/30 absolute"></div>
                  <div className="w-8 h-8 rounded-full bg-purple-500/40 border border-purple-400/50 absolute bottom-5 right-20"></div>
                </div>
              </div>
            </div>

            {/* Bottom Tabbed Table (Exact replica of Image 3 Bottom) */}
            <div className="bg-[#151718] rounded-3xl border border-white/5 overflow-hidden">
              <div className="flex gap-6 px-8 py-4 bg-[#1c1f21] border-b border-white/5 text-[10px] font-bold uppercase tracking-wider">
                {[
                  "Token Accumulation",
                  "Transactions",
                  "Liquidity Report",
                  "Holders",
                  "Trades",
                  "Owner",
                ].map((tab) => (
                  <button
                    key={tab}
                    className={
                      tab === "Trades"
                        ? "text-blue-400 border-b-2 border-blue-400 pb-1"
                        : "text-[#9BA3AF]"
                    }
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <table className="w-full text-left text-[11px]">
                <thead className="text-[#9BA3AF] border-b border-white/5 uppercase">
                  <tr>
                    <th className="px-8 py-4 font-medium">Address</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Price</th>
                    <th className="px-6 py-4 font-medium">Exchange</th>
                    <th className="px-8 py-4 font-medium text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-[#9BA3AF]">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="hover:bg-white/[0.02]">
                      <td className="px-8 py-4 font-mono">0xd64...34edc</td>
                      <td className="px-6 py-4 text-white font-bold">
                        865,098.098
                      </td>
                      <td className="px-6 py-4">$2.13</td>
                      <td className="px-6 py-4 flex items-center gap-2">
                        <div className="h-4 w-4 bg-orange-500 rounded-full"></div>{" "}
                        Binance
                      </td>
                      <td className="px-8 py-4 text-right">12 min</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
