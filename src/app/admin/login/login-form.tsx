"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Posts to /api/admin/login (plain HTTP). The old server-action variant
 * intermittently stopped dispatching retries after a failed attempt on
 * Next 16 — see the route handler's comment — so every cluster here is a
 * real request the server can see, throttle and fail.
 */
export function LoginForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lockout, setLockout] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          username: data.get("username"),
          password: data.get("password"),
        }),
      });
      const result = (await response.json()) as { ok?: boolean; error?: string };

      if (response.status === 429) setLockout(true);
      if (!response.ok || !result.ok) {
        setError(result.error ?? "Could not sign in. Try again.");
        return;
      }

      // Session cookie is set; the dashboard is a different route segment.
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Could not reach the server. Check your connection and retry.");
    } finally {
      // If the redirect navigated away this state update lands after unmount,
      // which React discards silently — safe.
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-5">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          spellCheck={false}
          placeholder="admin@pjc.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Admin password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
        />
      </div>

      {error && (
        <p role="alert" className="border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}
      {lockout && !error && (
        <p role="alert" className="border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Too many failed attempts. Wait 15 minutes and try again.
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Checking…" : "Enter the dashboard"}
      </Button>
    </form>
  );
}
