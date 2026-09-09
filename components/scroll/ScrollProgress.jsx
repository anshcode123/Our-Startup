"use client";

import { useEffect, useRef, useState } from "react";
import { createScrollProgress } from "@/lib/animations";

/**
 * Minimal fixed scroll-progress readout. Exposes 0..1 page progress via the
 * shared scroll engine — kept deliberately small and low-contrast so it
 * never competes with page content.
 */
export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const triggerRef = useRef(null);

  useEffect(() => {
    triggerRef.current = createScrollProgress(setProgress);
    return () => triggerRef.current?.kill();
  }, []);

  const percent = Math.round(progress * 100);

  return (
    <div
      className="pointer-events-none fixed bottom-5 right-5 z-50 hidden select-none items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 font-sans text-[11px] text-white/50 backdrop-blur-sm sm:flex"
      role="status"
      aria-label={`Page scrolled ${percent} percent`}
    >
      <span className="tracking-wide">SCROLL</span>
      <span className="relative h-1 w-16 overflow-hidden rounded-full bg-white/10">
        <span
          className="absolute inset-y-0 left-0 rounded-full bg-white/60"
          style={{ width: `${percent}%` }}
        />
      </span>
      <span className="tabular-nums text-white/70">{percent}%</span>
    </div>
  );
}
