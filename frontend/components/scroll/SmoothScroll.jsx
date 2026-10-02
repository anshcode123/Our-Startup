"use client";

import { useEffect } from "react";
import {
  initScrollEngine,
  destroyScrollEngine,
  ScrollTrigger,
} from "@/lib/animations";

/**
 * Mount this once, near the root of the app (see app/layout.js). It brings
 * up the shared Lenis + GSAP ticker + ScrollTrigger engine and tears it
 * down on unmount. Do not mount more than one of these, and do not create
 * a separate Lenis instance anywhere else in the app.
 */
export default function SmoothScroll({ children }) {
  useEffect(() => {
    initScrollEngine();
    // Recalculate trigger positions once layout has settled (fonts, images).
    const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(refreshId);
      destroyScrollEngine();
    };
  }, []);

  return children;
}
