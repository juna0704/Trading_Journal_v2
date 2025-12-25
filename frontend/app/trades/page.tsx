"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/contexts/auth-context";
import { Clock, Info, ChevronDown } from "lucide-react";

export default function MyTradesPage() {
  const { user } = useAuth();

  // Mock data styled after the "Trade Activity" section in Image 2
  const tradeActivity = [
    {
      type: "Short",
      amount: "$2,943.00",
      time: "19:34:13",
      color: "text-[#F3723B]",
    },
    {
      type: "Long",
      amount: "$8,291.00",
      time: "19:34:13",
      color: "text-[#2ED3B7]",
    },
    {
      type: "Long",
      amount: "$8,508.00",
      time: "19:34:13",
      color: "text-[#2ED3B7]",
    },
    {
      type: "Short",
      amount: "$5,737.00",
      time: "19:34:13",
      color: "text-[#F3723B]",
    },
  ];

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 animate-fade-in">
          {/* LEFT COLUMN: TRADE ACTIVITY (Inspired by Image 2 Left Sidebar) */}
          <div className="xl:col-span-3 bg-[#151718] rounded-[2rem] border border-white/5 overflow-hidden flex flex-col h-[800px]">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="font-bold text-sm text-white">Trade Activity</h3>
              <Clock className="h-4 w-4 text-[#9BA3AF]" />
            </div>
            <div className="overflow-y-auto flex-1">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] text-[#9BA3AF] uppercase border-b border-white/5">
                    <th className="px-6 py-4 font-medium">Type</th>
                    <th className="px-6 py-4 font-medium">Bet</th>
                    <th className="px-6 py-4 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody className="text-[11px] font-mono">
                  {tradeActivity.map((trade, i) => (
                    <tr
                      key={i}
                      className="hover:bg-white/[0.02] border-b border-white/[0.02]"
                    >
                      <td className={`px-6 py-4 font-bold ${trade.color}`}>
                        {trade.type}
                      </td>
                      <td className="px-6 py-4 text-white">{trade.amount}</td>
                      <td className="px-6 py-4 text-[#9BA3AF]">{trade.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-[#0B0C0D]/50">
              <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden flex">
                <div className="bg-[#2ED3B7] h-full w-[54%]"></div>
                <div className="bg-[#F3723B] h-full w-[46%]"></div>
              </div>
              <div className="flex justify-between text-[10px] mt-2 font-bold">
                <span className="text-[#2ED3B7]">54%</span>
                <span className="text-[#F3723B]">46%</span>
              </div>
            </div>
          </div>

          {/* MIDDLE COLUMN: MAIN CHART & POSITIONS (Inspired by Image 2 Center) */}
          <div className="xl:col-span-6 space-y-6">
            <div className="bg-[#151718] rounded-[2rem] p-6 border border-white/5 relative">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-xs">
                    Ξ
                  </div>
                  <span className="font-bold text-white">ETH/USDC</span>
                  <span className="text-[#2ED3B7] font-mono">$41,495.02 ↗</span>
                </div>
                <div className="flex bg-[#0B0C0D] rounded-lg p-1 text-[10px] font-bold text-[#9BA3AF]">
                  <button className="px-3 py-1.5 bg-[#1c1f21] text-white rounded-md">
                    Daily
                  </button>
                  <button className="px-3 py-1.5">Weekly</button>
                  <button className="px-3 py-1.5">Monthly</button>
                </div>
              </div>

              {/* Chart Placeholder with Grid Lines */}
              <div className="h-[400px] w-full border-l border-b border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-20">
                  {[...Array(36)].map((_, i) => (
                    <div key={i} className="border border-white/10"></div>
                  ))}
                </div>
                {/* Visual Candlesticks */}
                <div className="absolute bottom-10 left-0 w-full flex items-end justify-around px-4 h-full">
                  {[...Array(15)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 rounded-sm ${
                        i > 8 ? "bg-[#2ED3B7]" : "bg-[#F3723B]"
                      }`}
                      style={{ height: `${20 + i * 5}%` }}
                    >
                      <div
                        className={`w-0.5 h-full absolute left-1/2 -translate-x-1/2 ${
                          i > 8 ? "bg-[#2ED3B7]" : "bg-[#F3723B]"
                        } opacity-50`}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Positions List (Image 2 Bottom) */}
            <div className="bg-[#151718] rounded-[2rem] p-6 border border-white/5">
              <div className="flex gap-4 mb-4 text-xs font-bold border-b border-white/5 pb-4">
                <button className="text-[#2ED3B7] border-b border-[#2ED3B7] pb-4">
                  Open
                </button>
                <button className="text-[#9BA3AF] pb-4">Closed</button>
                <button className="text-[#9BA3AF] pb-4">History</button>
              </div>
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="bg-[#1c1f21] rounded-2xl p-4 flex items-center justify-between border border-white/5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                        Ξ
                      </div>
                      <div>
                        <p className="text-[10px] text-[#9BA3AF]">Enter at</p>
                        <p className="text-xs font-bold">$130</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#9BA3AF]">Expired</p>
                      <p className="text-xs font-bold">9:15:24</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#9BA3AF]">Leverage</p>
                      <p className="text-xs font-bold">25x</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#9BA3AF]">ROA</p>
                      <p className="text-xs font-bold text-[#2ED3B7]">25.4%</p>
                    </div>
                    <button className="bg-[#242627] text-[10px] font-bold px-4 py-2 rounded-xl border border-white/10 text-[#9BA3AF]">
                      Close Position
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: NEW POSITIONS PANEL (Inspired by Image 2 Right Sidebar) */}
          <div className="xl:col-span-3 space-y-6">
            <div className="bg-[#151718] rounded-[2.5rem] p-6 border border-white/5">
              <h3 className="font-bold text-sm text-white mb-6">
                New Positions
              </h3>

              <div className="bg-[#0B0C0D] rounded-xl p-1 flex mb-6">
                <button className="flex-1 py-2 text-xs font-bold bg-[#1c1f21] rounded-lg text-white">
                  Buy
                </button>
                <button className="flex-1 py-2 text-xs font-bold text-[#9BA3AF]">
                  Sell
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] text-[#9BA3AF] uppercase mb-2 block">
                    Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#9BA3AF]">
                      $
                    </span>
                    <input
                      type="text"
                      defaultValue="103.00"
                      className="w-full bg-[#0B0C0D] border border-white/5 rounded-xl py-3 pl-8 pr-12 text-sm font-bold outline-none focus:border-[#2ED3B7]/50"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-blue-400">
                      Max
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {["5x", "10x", "25x", "50x"].map((lev) => (
                    <button
                      key={lev}
                      className={cn(
                        "py-2 text-[10px] font-bold rounded-lg border",
                        lev === "5x"
                          ? "bg-blue-600 border-blue-500"
                          : "bg-[#1c1f21] border-white/5 text-[#9BA3AF]"
                      )}
                    >
                      {lev}
                    </button>
                  ))}
                </div>

                <div className="pt-6 border-t border-white/5">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs text-white flex items-center gap-2">
                      Details <ChevronDown className="h-3 w-3" />
                    </span>
                    <Info className="h-3 w-3 text-[#9BA3AF]" />
                  </div>
                  <div className="space-y-2 text-[10px]">
                    <div className="flex justify-between">
                      <span className="text-[#9BA3AF]">Liquidation Price</span>
                      <span className="text-white font-bold">$15.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#9BA3AF]">Open Price</span>
                      <span className="text-white font-bold">$105.00</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                  <span className="text-xs text-[#9BA3AF]">Total Price</span>
                  <span className="text-lg font-bold text-white">$ 200.00</span>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-[1.5rem] transition-all shadow-lg shadow-blue-900/20">
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

// Small helper for class names
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
