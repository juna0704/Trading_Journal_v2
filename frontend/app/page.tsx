"use client";

import Link from "next/link";
import { TrendingUp, BarChart3, Shield, Zap, ArrowRight } from "lucide-react";
import { ThemedButton } from "@/components/ui/themed-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-beige to-tan dark:from-charcoal dark:via-charcoal dark:to-charcoal/90">
      <header className="p-4 sm:p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-lg bg-charcoal dark:bg-cream flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-cream dark:text-charcoal" />
          </div>
          <span className="font-display text-xl font-bold text-charcoal dark:text-cream">
            Trading Journal
          </span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/auth/login">
            <ThemedButton variant="ghost" size="sm">
              Sign In
            </ThemedButton>
          </Link>
        </div>
      </header>

      <main>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-32">
          <div className="text-center space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-charcoal dark:text-cream leading-tight">
                Track Your Trades,
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-charcoal to-tan dark:from-cream dark:to-beige">
                  Master Your Strategy
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-charcoal/70 dark:text-cream/70 max-w-3xl mx-auto">
                A modern trading journal designed to help you analyze
                performance, identify patterns, and become a consistently
                profitable trader
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth/register">
                <ThemedButton size="lg" className="group">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </ThemedButton>
              </Link>
              <Link href="/auth/login">
                <ThemedButton size="lg" variant="outline">
                  Sign In
                </ThemedButton>
              </Link>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass rounded-2xl p-8 space-y-4 hover:scale-105 transition-transform duration-300">
              <div className="h-14 w-14 rounded-xl bg-charcoal dark:bg-cream flex items-center justify-center">
                <BarChart3 className="h-7 w-7 text-cream dark:text-charcoal" />
              </div>
              <h3 className="font-display text-2xl font-bold text-charcoal dark:text-cream">
                Detailed Analytics
              </h3>
              <p className="text-charcoal/70 dark:text-cream/70">
                Track every trade with comprehensive statistics and performance
                metrics to understand what works and what doesn't
              </p>
            </div>

            <div className="glass rounded-2xl p-8 space-y-4 hover:scale-105 transition-transform duration-300">
              <div className="h-14 w-14 rounded-xl bg-charcoal dark:bg-cream flex items-center justify-center">
                <Shield className="h-7 w-7 text-cream dark:text-charcoal" />
              </div>
              <h3 className="font-display text-2xl font-bold text-charcoal dark:text-cream">
                Secure & Private
              </h3>
              <p className="text-charcoal/70 dark:text-cream/70">
                Your trading data is encrypted and protected with
                enterprise-grade security measures
              </p>
            </div>

            <div className="glass rounded-2xl p-8 space-y-4 hover:scale-105 transition-transform duration-300">
              <div className="h-14 w-14 rounded-xl bg-charcoal dark:bg-cream flex items-center justify-center">
                <Zap className="h-7 w-7 text-cream dark:text-charcoal" />
              </div>
              <h3 className="font-display text-2xl font-bold text-charcoal dark:text-cream">
                Lightning Fast
              </h3>
              <p className="text-charcoal/70 dark:text-cream/70">
                Built with modern technology for instant loading and seamless
                real-time updates
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="glass-strong rounded-3xl p-12 sm:p-16 text-center space-y-6">
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-charcoal dark:text-cream">
              Ready to improve your trading?
            </h2>
            <p className="text-xl text-charcoal/70 dark:text-cream/70 max-w-2xl mx-auto">
              Join traders who are already using our platform to track and
              improve their performance
            </p>
            <Link href="/auth/register">
              <ThemedButton size="lg" className="group">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </ThemedButton>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-tan/30 dark:border-beige/20 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-charcoal/60 dark:text-cream/60">
          <p>&copy; 2024 Trading Journal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
