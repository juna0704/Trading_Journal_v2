"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/contexts/auth-context";
import {
  TrendingUp,
  DollarSign,
  Activity,
  ArrowUpRight,
  Zap,
  BarChart3,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    {
      name: "Ethereum",
      symbol: "ETH",
      price: "$0.02308",
      change: "+2.47%",
      color: "text-[#2ED3B7]",
    },
    {
      name: "Bitcoin",
      symbol: "BTC",
      price: "$0.09514",
      change: "+2.88%",
      color: "text-[#2ED3B7]",
    },
    {
      name: "Tether",
      symbol: "USDT",
      price: "$0.06892",
      change: "+2.47%",
      color: "text-[#2ED3B7]",
    },
  ];

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-10 animate-fade-in">
          {/* Top Coins Header */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-1">
                <h2 className="text-xl font-bold">Top Coin of the Market</h2>
                <p className="text-sm text-[#9BA3AF]">
                  Recommended coins for 24 hours{" "}
                  <span className="ml-2 bg-[#F3723B]/20 text-[#F3723B] px-2 py-0.5 rounded text-[10px] font-bold">
                    3 ASSETS ★
                  </span>
                </p>
              </div>
              <div className="flex gap-2">
                <select className="bg-[#151718] border border-white/5 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-white/20">
                  <option>24H</option>
                </select>
                <select className="bg-[#151718] border border-white/5 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-white/20">
                  <option>Stake</option>
                </select>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {stats.map((coin) => (
                <div
                  key={coin.name}
                  className="glass-card p-6 rounded-[2rem] relative overflow-hidden group hover:bg-[#1c1f21] transition-all"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-medium text-white">
                        {coin.name}{" "}
                        <span className="text-[#9BA3AF] text-xs ml-1">
                          ({coin.symbol})
                        </span>
                      </h3>
                      <p className="text-2xl font-bold mt-2 tracking-tight">
                        {coin.price}
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-[#1c1f21] flex items-center justify-center border border-white/5">
                      <Zap className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#9BA3AF]">gain for USDT</span>
                    <span className={coin.color}>{coin.change}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Chart and Balance Section */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Mock Chart Area */}
            <div className="lg:col-span-2 glass-card rounded-[2rem] p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Chart</h3>
                <div className="flex gap-2 bg-[#0B0C0D] p-1 rounded-lg">
                  <button className="p-1.5 hover:bg-[#1c1f21] rounded-md transition">
                    <Activity className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 hover:bg-[#1c1f21] rounded-md transition">
                    <BarChart3 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="h-64 flex items-end justify-between gap-1">
                {/* Visual Placeholder for Candles */}
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-full rounded-t-sm ${
                      i % 3 === 0
                        ? "bg-red-500/40 h-24"
                        : "bg-[#2ED3B7]/40 h-40"
                    }`}
                    style={{ height: `${Math.random() * 100 + 20}%` }}
                  ></div>
                ))}
              </div>
            </div>

            {/* My Balance Card */}
            <div className="glass-card rounded-[2rem] p-8">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-[#1c1f21] rounded-xl">
                    <DollarSign className="h-5 w-5 text-[#9BA3AF]" />
                  </div>
                  <span className="font-semibold">My Balance</span>
                </div>
                <ArrowUpRight className="h-5 w-5 text-[#9BA3AF]" />
              </div>

              <div className="flex justify-between items-end mb-10">
                <h2 className="text-4xl font-bold tracking-tighter">
                  $4,472.90
                </h2>
                <div className="bg-[#1c1f21] px-3 py-1 rounded-full text-[10px] border border-white/5">
                  BTH ▼
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-6 mb-10 text-center">
                <div>
                  <p className="text-[10px] text-[#9BA3AF] uppercase mb-1">
                    Total Profit
                  </p>
                  <p className="text-xs font-bold">+$2,463.20</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#9BA3AF] uppercase mb-1">
                    Avg Growing
                  </p>
                  <p className="text-xs font-bold">+14.63%</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#9BA3AF] uppercase mb-1">
                    Best Token
                  </p>
                  <p className="text-xs font-bold">Bitcoin</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button className="flex-1 bg-[#2ED3B7] text-black font-bold py-4 rounded-2xl text-sm hover:brightness-110 transition">
                  Withdraw
                </button>
                <button className="flex-1 bg-[#F3723B] text-white font-bold py-4 rounded-2xl text-sm hover:brightness-110 transition">
                  Transfer
                </button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
