"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function ResetPasswordPage() {
  return (
    <Card className="w-full max-w-sm space-y-6">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold">Reset password</h1>
        <p className="text-sm text-gray-500">Enter your new password</p>
      </div>

      <form className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="password">New password</Label>
          <Input id="password" type="password" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="confirm">Confirm password</Label>
          <Input id="confirm" type="password" />
        </div>

        <Button type="submit" className="w-full" disabled>
          Reset password
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
