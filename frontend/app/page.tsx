"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="p-6 space-y-6 max-w-md">
      <h1 className="text-2xl font-semibold">Trading Journal</h1>

      <Card className="space-y-4">
        <Input placeholder="Email" />
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
      </Card>
    </main>
  );
}
