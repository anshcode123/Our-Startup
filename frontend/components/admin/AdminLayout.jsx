"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/site/Logo";

export default function AdminLayout({ user, children }) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-ink text-paper">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="flex items-center gap-2.5">
              <Logo className="text-sm" />
              <span className="rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-accent">
                Admin CMS
              </span>
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-5">
            <Link
              href="/products"
              className="text-xs text-white/60 transition-colors hover:text-white"
            >
              Public Products
            </Link>
            <Link
              href="/"
              className="text-xs text-white/60 transition-colors hover:text-white"
            >
              Main Site
            </Link>

            {user?.email && (
              <span className="hidden rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/60 md:inline-block">
                {user.email}
              </span>
            )}

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-full border border-white/15 bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-white transition-colors hover:border-white/30 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loggingOut ? "Signing out..." : "Logout"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
    </div>
  );
}
