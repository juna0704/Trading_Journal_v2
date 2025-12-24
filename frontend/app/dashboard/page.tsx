"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth/login");
      } else if (!user.isEmailVerified || !user.isActive) {
        router.push("/account-status");
      }
    }
  }, [user, loading, router]);

  const stats = [
    {
      name: "Total Trades",
      value: "0",
      icon: Activity,
      change: "+0%",
      changeType: "positive",
    },
    {
      name: "Win Rate",
      value: "0%",
      icon: TrendingUp,
      change: "+0%",
      changeType: "positive",
    },
    {
      name: "Total P&L",
      value: "$0.00",
      icon: DollarSign,
      change: "+$0.00",
      changeType: "positive",
    },
    {
      name: "Avg. Trade",
      value: "$0.00",
      icon: TrendingDown,
      change: "+0%",
      changeType: "positive",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !user.isEmailVerified || !user.isActive) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user.firstName}!
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Here's an overview of your trading performance
              </p>
            </div>
            <div className="flex items-center gap-4">
              {(user.role === "ADMIN" || user.role === "SUPER_ADMIN") && (
                <button
                  onClick={() => router.push("/admin")}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Admin Panel
                </button>
              )}
              <button
                onClick={() => router.push("/account-status")}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Account
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p
                  className={`text-sm mt-1 ${
                    stat.changeType === "positive"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {stat.change} from last month
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Activity className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-lg font-medium text-gray-900">No trades yet</p>
            <p className="text-gray-500 mt-1">
              Start tracking your trades to see them here
            </p>
            <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Add Your First Trade
            </button>
          </div>
        </div>

        {/* Quick Stats and Trading Streak */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Quick Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600">Best Trade</span>
                <span className="font-semibold text-gray-900">$0.00</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600">Worst Trade</span>
                <span className="font-semibold text-gray-900">$0.00</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600">Profit Factor</span>
                <span className="font-semibold text-gray-900">0.00</span>
              </div>
            </div>
          </div>

          {/* Trading Streak */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Trading Streak
            </h3>
            <div className="flex flex-col items-center justify-center py-8">
              <div className="text-6xl font-bold text-gray-900 mb-2">0</div>
              <p className="text-gray-600">days</p>
              <p className="text-sm text-gray-500 mt-2">
                Keep trading to build your streak!
              </p>
            </div>
          </div>
        </div>

        {/* User Info Card (for debugging) */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Account Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Email:</span>
              <span className="ml-2 font-medium text-gray-900">
                {user.email}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Name:</span>
              <span className="ml-2 font-medium text-gray-900">
                {user.firstName} {user.lastName}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Role:</span>
              <span className="ml-2 font-medium text-gray-900">
                {user.role}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Status:</span>
              <span className="ml-2 font-medium text-green-600">Active</span>
            </div>
            <div>
              <span className="text-gray-600">Last Login:</span>
              <span className="ml-2 font-medium text-gray-900">
                {user.lastLoginAt
                  ? new Date(user.lastLoginAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Member Since:</span>
              <span className="ml-2 font-medium text-gray-900">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
