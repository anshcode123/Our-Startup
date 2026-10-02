"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { subscribeFirestoreTheme, updateFirestoreTheme } from "@/lib/firebase";

const ThemeContext = createContext({
  theme: "dark",
  setTheme: () => {},
  toggleTheme: () => {},
  isDark: true,
  isLight: false,
  loading: false,
});

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export default function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState("dark");
  const [loading, setLoading] = useState(true);

  const applyThemeToDom = useCallback((newTheme) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.setAttribute("data-theme", newTheme);
    root.classList.remove("light", "dark");
    root.classList.add(newTheme);
    root.style.colorScheme = newTheme;
  }, []);

  const setTheme = useCallback(
    async (newTheme) => {
      const sanitized = newTheme === "light" ? "light" : "dark";
      setThemeState(sanitized);
      applyThemeToDom(sanitized);

      try {
        localStorage.setItem("anshul_theme", sanitized);
      } catch {
        // Ignore localStorage restrictions
      }

      // 1. Update Firestore document settings/site
      try {
        await updateFirestoreTheme(sanitized);
      } catch (err) {
        console.warn("[ThemeProvider] Firestore sync notice:", err?.message);
      }

      // 2. Persist to API route (verifies admin session and notifies server)
      try {
        await fetch("/api/theme", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ theme: sanitized }),
        });
      } catch {
        // Fallback gracefully if API is offline
      }

      window.dispatchEvent(
        new CustomEvent("themechange", { detail: { theme: sanitized } })
      );
    },
    [applyThemeToDom]
  );

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  useEffect(() => {
    // 1. Initial cached theme for instant zero-flash application
    let initialTheme = "dark";
    try {
      const cached = localStorage.getItem("anshul_theme");
      if (cached === "light" || cached === "dark") {
        initialTheme = cached;
      }
    } catch {
      // Ignore
    }
    setThemeState(initialTheme);
    applyThemeToDom(initialTheme);

    // 2. Real-time subscription to Firestore settings/site
    let unsubscribeFirestore = () => {};
    try {
      unsubscribeFirestore = subscribeFirestoreTheme((remoteTheme) => {
        if (remoteTheme === "light" || remoteTheme === "dark") {
          setThemeState(remoteTheme);
          applyThemeToDom(remoteTheme);
          try {
            localStorage.setItem("anshul_theme", remoteTheme);
          } catch {
            // Ignore
          }
        }
      });
    } catch (err) {
      console.warn("[ThemeProvider] Real-time subscription notice:", err?.message);
    }

    // 3. Server API check
    let active = true;
    async function loadServerTheme() {
      try {
        const res = await fetch("/api/theme", { cache: "no-store" });
        if (res.ok && active) {
          const data = await res.json();
          if (data?.theme === "light" || data?.theme === "dark") {
            setThemeState(data.theme);
            applyThemeToDom(data.theme);
            try {
              localStorage.setItem("anshul_theme", data.theme);
            } catch {
              // Ignore
            }
          }
        }
      } catch {
        // Graceful fallback to dark
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadServerTheme();

    // 4. Multi-tab synchronization
    function handleStorage(e) {
      if (e.key === "anshul_theme" && (e.newValue === "light" || e.newValue === "dark")) {
        setThemeState(e.newValue);
        applyThemeToDom(e.newValue);
      }
    }
    window.addEventListener("storage", handleStorage);

    return () => {
      active = false;
      unsubscribeFirestore();
      window.removeEventListener("storage", handleStorage);
    };
  }, [applyThemeToDom]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        isDark: theme === "dark",
        isLight: theme === "light",
        loading,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}