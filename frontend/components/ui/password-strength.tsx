"use client";

import { useMemo } from "react";
import { cn } from "@/lib/cn";

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const strength = useMemo(() => {
    if (!password) return 0;

    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    return Math.min(score, 4);
  }, [password]);

  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = [
    "",
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
  ];

  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all duration-300",
              level <= strength
                ? strengthColors[strength]
                : "bg-tan/30 dark:bg-beige/20"
            )}
          />
        ))}
      </div>
      {strength > 0 && (
        <p className="text-sm text-charcoal/70 dark:text-cream/70">
          Password strength:{" "}
          <span className="font-medium">{strengthLabels[strength]}</span>
        </p>
      )}
    </div>
  );
}
