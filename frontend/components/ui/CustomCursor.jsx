"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/animations";

/**
 * A small dot that trails the real cursor on precision-pointer devices —
 * the native OS cursor is never hidden, this is purely an extra accent.
 * Off entirely on touch devices and under prefers-reduced-motion, and
 * mounted once near the root (see app/layout.js). Position updates go
 * straight through GSAP/the DOM, not React state, so it never triggers a
 * re-render on mousemove.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);

  useEffect(() => {
    const el = dotRef.current;
    if (!el) return undefined;

    const pointerQuery = window.matchMedia("(pointer: fine)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    let setX = null;
    let setY = null;
    let handlePointerMove = null;

    function enable() {
      if (setX || prefersReducedMotion() || !pointerQuery.matches) return;

      setX = gsap.quickTo(el, "x", { duration: 0.15, ease: "power3.out" });
      setY = gsap.quickTo(el, "y", { duration: 0.15, ease: "power3.out" });

      handlePointerMove = (event) => {
        el.style.opacity = "1";
        setX(event.clientX);
        setY(event.clientY);
      };
      window.addEventListener("pointermove", handlePointerMove);
    }

    function disable() {
      if (handlePointerMove) window.removeEventListener("pointermove", handlePointerMove);
      handlePointerMove = null;
      setX = null;
      setY = null;
      el.style.opacity = "0";
    }

    enable();
    const reEvaluate = () => (prefersReducedMotion() || !pointerQuery.matches ? disable() : enable());
    pointerQuery.addEventListener("change", reEvaluate);
    motionQuery.addEventListener("change", reEvaluate);

    return () => {
      disable();
      pointerQuery.removeEventListener("change", reEvaluate);
      motionQuery.removeEventListener("change", reEvaluate);
    };
  }, []);

  return <span ref={dotRef} className="cursor-dot" style={{ opacity: 0 }} aria-hidden="true" />;
}
