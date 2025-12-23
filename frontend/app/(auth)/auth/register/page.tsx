"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  return (
    <Card className="w-full max-w-sm space-y-6">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold">Create account</h1>
        <p className="text-sm text-gray-500">Start tracking your trades</p>
      </div>

      <form className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" />
        </div>

        <Button type="submit" className="w-full" disabled>
          Create account
        </Button>
      </form>

      <div className="text-sm text-center">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-blue-600">
          Sign in
        </Link>
      </div>
    </Card>
  );
}
