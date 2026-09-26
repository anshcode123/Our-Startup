"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [authState, setAuthState] = useState({
    loading: true,
    user: null,
  });

  useEffect(() => {
    let active = true;

    async function verifySession() {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          if (active) {
            router.replace("/admin/login");
          }
          return;
        }

        const data = await res.json();
        if (active && data?.user) {
          setAuthState({
            loading: false,
            user: data.user,
          });
        } else if (active) {
          router.replace("/admin/login");
        }
      } catch {
        if (active) {
          router.replace("/admin/login");
        }
      }
    }

    verifySession();

    return () => {
      active = false;
    };
  }, [router]);

  if (authState.loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-center">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/20 border-t-accent" />
        <p className="mt-4 text-xs uppercase tracking-[0.2em] text-white/50">
          Verifying admin session...
        </p>
      </div>
    );
  }

  if (!authState.user) {
    return null;
  }

  return typeof children === "function"
    ? children(authState.user)
    : children;
}
