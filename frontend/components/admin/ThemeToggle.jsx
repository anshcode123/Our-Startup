"use client";

import { useTheme } from "@/components/theme/ThemeProvider";

export default function ThemeToggle({ className = "", showLabel = false }) {
  const { theme, setTheme, isDark, isLight } = useTheme();

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {showLabel && (
        <span className="text-xs font-medium uppercase tracking-wider text-muted">
          Global Theme
        </span>
      )}
      <div
        role="radiogroup"
        aria-label="Global Site Theme Switcher"
        className="relative inline-flex items-center rounded-full border border-white/15 bg-white/[0.04] p-1 shadow-inner backdrop-blur-sm transition-colors"
      >
        <button
          type="button"
          role="radio"
          aria-checked={isDark}
          onClick={() => setTheme("dark")}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
            isDark
              ? "bg-white text-black shadow-sm"
              : "text-white/60 hover:text-white"
          }`}
          title="Switch to Dark Theme"
        >
          <span aria-hidden="true" className="text-sm">🌙</span>
          <span>Dark</span>
        </button>

        <button
          type="button"
          role="radio"
          aria-checked={isLight}
          onClick={() => setTheme("light")}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
            isLight
              ? "bg-[#141413] text-white shadow-sm"
              : "text-white/60 hover:text-white"
          }`}
          title="Switch to Light Theme"
        >
          <span aria-hidden="true" className="text-sm">☀️</span>
          <span>Light</span>
        </button>
      </div>
    </div>
  );
}