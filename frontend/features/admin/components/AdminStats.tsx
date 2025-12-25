"use client";

import { TrendingUp, Users, UserCheck, UserX, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/cn";

interface AdminStatsProps {
  stats: {
    total: number;
    active: number;
    inactive: number;
    verified: number;
  };
}

export function AdminStats({ stats }: AdminStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Stat
        label="Total Users"
        value={stats.total}
        trend="+4.9%"
        subText="Last month: 2,345"
        icon={Users}
      />
      <Stat
        label="Active Users"
        value={stats.active}
        trend="+7.5%"
        subText="Last month: 89"
        icon={UserCheck}
      />
      <Stat
        label="Inactive"
        value={stats.inactive}
        trend="-6.0%"
        subText="Last month: 60"
        isDown
        icon={UserX}
      />
      <Stat
        label="Verified"
        value={stats.verified}
        trend="+12%"
        subText="Manual approvals"
        icon={ShieldCheck}
      />
    </div>
  );
}

interface StatProps {
  label: string;
  value: number;
  trend: string;
  subText: string;
  icon: React.ElementType;
  isDown?: boolean;
  prefix?: string;
}

function Stat({
  label,
  value,
  trend,
  subText,
  icon: Icon,
  isDown,
  prefix,
}: StatProps) {
  return (
    <div className="bg-[#151718] rounded-[2.5rem] p-8 border border-white/5 flex flex-col justify-between h-48 transition-all hover:border-white/10 group">
      <div className="flex justify-between items-start">
        <p className="text-sm font-medium text-[#9BA3AF] group-hover:text-white transition-colors">
          {label}
        </p>
        <div className="p-2.5 bg-[#0B0C0D] rounded-xl border border-white/5">
          <Icon className="h-4 w-4 text-[#9BA3AF]" />
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <p className="text-4xl font-bold tracking-tighter text-white">
            {prefix}
            {value.toLocaleString()}
          </p>
          <div
            className={cn(
              "flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full",
              isDown
                ? "bg-red-400/10 text-red-400"
                : "bg-[#2ED3B7]/10 text-[#2ED3B7]"
            )}
          >
            <TrendingUp className={cn("h-3 w-3", isDown && "rotate-180")} />
            {trend}
          </div>
        </div>
        <p className="text-[10px] text-[#9BA3AF] mt-2 font-medium uppercase tracking-wider">
          {subText}
        </p>
      </div>
    </div>
  );
}
