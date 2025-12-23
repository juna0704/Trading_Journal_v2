"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <Card className="w-full max-w-sm space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold text-charcoal">Welcome back</h1>
        <p className="text-sm text-charcoal/70">
          Sign in to your trading journal
        </p>
      </div>

      <form className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" />
        </div>

        <Button type="submit" className="w-full" disabled>
          Sign in
        </Button>
      </form>

      <div className="text-sm text-center space-y-2">
        <Link href="/auth/forgot-password" className="text-blue-600">
          Forgot password?
        </Link>
        <div>
          Don’t have an account?{" "}
          <Link href="/auth/register" className="text-blue-600">
            Sign up
          </Link>
        </div>
      </div>
    </Card>
  );
}
