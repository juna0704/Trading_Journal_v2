"use client";

import { useState, useRef } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  FileUp,
  Plus,
  Table as TableIcon,
  Trash2,
  Download,
  Filter,
  Search,
} from "lucide-react";
import { toast } from "sonner";

export default function JournalSpreadsheetPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for manual trade entries
  const [trades, setTrades] = useState([
    {
      id: 1,
      entry: "2/20/2019",
      exit: "2/20/2019",
      symbol: "KNDI",
      pnl: -2.2,
      fees: 2.0,
      strategy: "Breakout",
      comment: "Late entry",
      screenshot: "view",
    },
    {
      id: 2,
      entry: "2/20/2019",
      exit: "2/20/2019",
      symbol: "LSSC",
      pnl: -5.3,
      fees: 2.0,
      strategy: "FRD",
      comment: "Stopped out",
      screenshot: "view",
    },
    {
      id: 3,
      entry: "2/21/2019",
      exit: "2/21/2019",
      symbol: "FCEL",
      pnl: 3.03,
      fees: 2.0,
      strategy: "Gapper",
      comment: "Target hit",
      screenshot: "view",
    },
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.success(`Importing ${file.name}...`);
      // Logic for CSV/XLS parsing would go here
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6 animate-fade-in pb-10">
          {/* TOP ACTION BAR (Matches Screenshot Header) */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#151718] p-6 rounded-[2rem] border border-white/5">
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center gap-1 group cursor-pointer">
                <div className="h-12 w-12 rounded-full border-2 border-blue-500 flex items-center justify-center bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                  <TableIcon className="h-5 w-5 text-blue-400" />
                </div>
                <span className="text-[10px] font-bold text-white uppercase tracking-tighter">
                  Database
                </span>
              </div>
              <div className="h-0.5 w-12 bg-white/10 hidden md:block"></div>
              <div className="opacity-40 hover:opacity-100 transition flex flex-col items-center gap-1 cursor-pointer">
                <div className="h-12 w-12 rounded-full border border-white/20 flex items-center justify-center">
                  <TrendingUpIcon className="h-5 w-5 text-white" />
                </div>
                <span className="text-[10px] font-bold text-[#9BA3AF] uppercase">
                  Overview
                </span>
              </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#1c1f21] hover:bg-[#242729] text-white border border-white/5 px-6 py-3 rounded-2xl text-xs font-bold transition"
              >
                <FileUp className="h-4 w-4 text-blue-400" />
                Upload CSV/XLS
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".csv, .xlsx, .xls"
                  className="hidden"
                />
              </button>
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl text-xs font-bold transition shadow-lg shadow-blue-900/20">
                <Plus className="h-4 w-4" />
                Add Trade
              </button>
            </div>
          </div>

          {/* SPREADSHEET TABLE (Exact Column Layout from Screenshot) */}
          <div className="bg-[#151718] rounded-[2.5rem] border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#0B0C0D]/50">
                  <tr className="border-b border-white/5">
                    {[
                      "Entry Date",
                      "Exit Date",
                      "Symbol",
                      "P&L",
                      "Fees",
                      "Strategy",
                      "Comments",
                      "Screenshot",
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-5 text-[11px] font-bold text-blue-400 uppercase tracking-wider"
                      >
                        <div className="flex items-center gap-2">
                          {header}
                          <Filter className="h-3 w-3 opacity-30" />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-[13px] font-mono divide-y divide-white/[0.02]">
                  {trades.map((trade) => (
                    <tr
                      key={trade.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="px-6 py-4 text-white/70">{trade.entry}</td>
                      <td className="px-6 py-4 text-white/70">{trade.exit}</td>
                      <td className="px-6 py-4 font-bold text-white">
                        {trade.symbol}
                      </td>
                      <td
                        className={`px-6 py-4 font-bold ${
                          trade.pnl >= 0 ? "text-[#2ED3B7]" : "text-[#F3723B]"
                        }`}
                      >
                        {trade.pnl >= 0
                          ? `+$${trade.pnl.toFixed(2)}`
                          : `-$${Math.abs(trade.pnl).toFixed(2)}`}
                      </td>
                      <td className="px-6 py-4 text-white/50">
                        ${trade.fees.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-white/70">
                        <span className="bg-white/5 px-2 py-1 rounded text-[10px] border border-white/5">
                          {trade.strategy}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#9BA3AF] italic max-w-xs truncate">
                        {trade.comment}
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-blue-400 hover:underline text-[11px] font-bold">
                          view_ss.jpg
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* TABLE FOOTER / PAGINATION */}
            <div className="p-6 bg-[#0B0C0D]/30 border-t border-white/5 flex justify-between items-center">
              <p className="text-[10px] text-[#9BA3AF] uppercase font-bold tracking-widest">
                Showing 3 of 45 Trades
              </p>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-white/5 rounded-lg text-[#9BA3AF] transition">
                  <Search className="h-4 w-4" />
                </button>
                <button className="p-2 hover:bg-[#F3723B]/10 hover:text-[#F3723B] rounded-lg text-[#9BA3AF] transition">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function TrendingUpIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
