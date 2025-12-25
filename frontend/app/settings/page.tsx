"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import {
  User,
  Lock,
  CreditCard,
  Users,
  Camera,
  Edit3,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const [activeSection, setActiveSection] = useState("account");

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-6xl mx-auto animate-fade-in pb-10">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* LEFT COLUMN: NAVIGATION & PROGRESS (Inspired by profile_page.webp) */}
            <aside className="w-full lg:w-80 space-y-6">
              {/* Profile Completion Card */}
              <div className="bg-[#F3723B] rounded-[2rem] p-6 text-white relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative h-12 w-12 flex items-center justify-center">
                      <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="4"
                          fill="transparent"
                        />
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          stroke="white"
                          strokeWidth="4"
                          fill="transparent"
                          strokeDasharray="126"
                          strokeDashoffset="45"
                        />
                      </svg>
                      <span className="text-xs font-bold">64%</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm">Complete profile</p>
                      <p className="text-[10px] opacity-80">
                        Unlock all features
                      </p>
                    </div>
                  </div>
                  <button className="w-full bg-white text-[#F3723B] font-bold py-2 rounded-xl text-xs hover:bg-opacity-90 transition">
                    Verify identity
                  </button>
                </div>
                {/* Decorative background circle */}
                <div className="absolute -bottom-4 -right-4 h-24 w-24 bg-white/10 rounded-full blur-2xl"></div>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-2">
                {[
                  {
                    id: "account",
                    label: "Account Information",
                    sub: "Change your account information",
                    icon: User,
                  },
                  {
                    id: "password",
                    label: "Password",
                    sub: "Change your password",
                    icon: Lock,
                  },
                  {
                    id: "payment",
                    label: "Payment Methods",
                    sub: "Add your card / wallet",
                    icon: CreditCard,
                  },
                  {
                    id: "invite",
                    label: "Invite Your Friends",
                    sub: "Get $3 for each invitation",
                    icon: Users,
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all border ${
                      activeSection === item.id
                        ? "bg-[#151718] border-white/10 text-white"
                        : "border-transparent text-[#9BA3AF] hover:bg-white/5"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        activeSection === item.id
                          ? "bg-[#F3723B]/10 text-[#F3723B]"
                          : "bg-[#1c1f21]"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold">{item.label}</p>
                      <p className="text-[10px] opacity-60">{item.sub}</p>
                    </div>
                  </button>
                ))}
              </nav>
            </aside>

            {/* RIGHT COLUMN: CONTENT AREA (Personal Information) */}
            <main className="flex-1 bg-[#151718] rounded-[2.5rem] border border-white/5 p-8 lg:p-12">
              <h2 className="text-2xl font-bold text-white mb-8">
                Personal Informations
              </h2>

              {/* Avatar Section */}
              <div className="flex items-center gap-6 mb-10">
                <div className="relative group">
                  <div className="h-24 w-24 rounded-full border-4 border-[#0B0C0D] bg-gradient-to-tr from-[#F3723B] to-[#2ED3B7] p-1 overflow-hidden">
                    <img
                      src={
                        user?.firstName ||
                        "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                      }
                      alt="Profile"
                      className="h-full w-full rounded-full object-cover bg-[#0B0C0D]"
                    />
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-[#F3723B] rounded-full text-white border-2 border-[#151718] hover:scale-110 transition">
                    <Camera className="h-3 w-3" />
                  </button>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    {user?.firstName || "User"} {user?.lastName || ""}
                    {user?.isEmailVerified && (
                      <CheckCircle2 className="h-4 w-4 text-[#2ED3B7]" />
                    )}
                  </h3>
                  <p className="text-[#9BA3AF] text-sm mb-4">
                    Trading Enthusiast
                  </p>
                  <div className="flex gap-3">
                    <button className="bg-[#F3723B] text-white px-6 py-2 rounded-xl text-xs font-bold hover:brightness-110 transition">
                      Upload New Picture
                    </button>
                    <button className="bg-[#1c1f21] text-[#9BA3AF] px-6 py-2 rounded-xl text-xs font-bold border border-white/5 hover:bg-white/5 transition">
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <div className="relative">
                      <input
                        type="text"
                        defaultValue={user?.firstName ?? ""}
                        className="w-full bg-[#0B0C0D] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-[#F3723B]/50 transition"
                      />
                      <Edit3 className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9BA3AF]" />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <div className="relative">
                      <input
                        type="email"
                        defaultValue={user?.email}
                        disabled
                        className="w-full bg-[#0B0C0D] border border-white/5 rounded-2xl px-5 py-4 text-sm text-[#9BA3AF] opacity-80"
                      />
                      <Edit3 className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9BA3AF]" />
                    </div>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Phone Number"
                    className="w-full bg-[#0B0C0D] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-[#F3723B]/50"
                  />
                  <Edit3 className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9BA3AF]" />
                </div>

                {/* Address Row */}
                <div className="grid grid-cols-2 gap-6">
                  <input
                    type="text"
                    placeholder="Street Number"
                    className="bg-[#0B0C0D] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-[#F3723B]/50"
                  />
                  <input
                    type="text"
                    placeholder="Apt / House Number"
                    className="bg-[#0B0C0D] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-[#F3723B]/50"
                  />
                </div>

                {/* Location Selectors */}
                <div className="grid grid-cols-2 gap-6">
                  <select className="bg-[#0B0C0D] border border-white/5 rounded-2xl px-5 py-4 text-sm text-[#9BA3AF] outline-none appearance-none">
                    <option>City</option>
                  </select>
                  <select className="bg-[#0B0C0D] border border-white/5 rounded-2xl px-5 py-4 text-sm text-[#9BA3AF] outline-none appearance-none">
                    <option>State</option>
                  </select>
                </div>

                {/* Submit Button */}
                <div className="pt-8">
                  <button className="w-full bg-[#F3723B] text-white font-bold py-5 rounded-2xl text-sm shadow-xl shadow-[#F3723B]/10 hover:brightness-110 transition transform active:scale-[0.98]">
                    Update Profile
                  </button>
                </div>
              </div>
            </main>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
