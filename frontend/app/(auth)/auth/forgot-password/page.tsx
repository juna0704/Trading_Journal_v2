"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  return (
    <Card className="w-full max-w-sm space-y-6">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold">Forgot password</h1>
        <p className="text-sm text-gray-500">We’ll send you a reset link</p>
      </div>

      <form className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" />
        </div>

        <Button type="submit" className="w-full" disabled>
          Send reset link
        </Button>
      </form>

      <div className="text-sm text-center">
        <Link href="/auth/login" className="text-blue-600">
          Back to sign in
        </Link>
      </div>
    </Card>
  );
}
