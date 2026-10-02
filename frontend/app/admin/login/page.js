"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/site/Logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function checkExistingSession() {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });
        if (res.ok && active) {
          router.replace("/admin/dashboard");
        }
      } catch {
        // Not logged in
      }
    }
    checkExistingSession();
    return () => {
      active = false;
    };
  }, [router]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (loading) return;

    setError("");

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setError("Please enter your admin email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: trimmedEmail,
          password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Invalid email or password.");
        setLoading(false);
        return;
      }

      router.replace("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please verify your connection and try again.");
      setLoading(false);
    }
  }

  return (
    <main className="bg-grid relative flex min-h-screen flex-col items-center justify-center bg-ink px-6 py-16">
      <div className="bg-accent-glow pointer-events-none absolute inset-0" />

      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-sm">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <Logo className="text-sm" />
          </Link>
          <p className="mt-3 text-xs uppercase tracking-[0.2em] text-accent">
            Admin Portal
          </p>
          <h1 className="mt-2 text-2xl font-medium text-white">
            Sign in to Product CMS
          </h1>
          <p className="mt-2 text-xs text-white/50">
            Authorized administrator access only.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-200"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
          <div>
            <label
              htmlFor="admin-email"
              className="block text-xs font-medium uppercase tracking-wider text-white/70"
            >
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              required
              disabled={loading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@anshul.dev"
              className="mt-2 w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-accent focus:outline-none disabled:opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-medium uppercase tracking-wider text-white/70"
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              disabled={loading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="mt-2 w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-accent focus:outline-none disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 border-t border-white/10 pt-4 text-center">
          <Link
            href="/"
            className="text-xs text-white/50 transition-colors hover:text-white"
          >
            ← Back to public website
          </Link>
        </div>
      </div>
    </main>
  );
}