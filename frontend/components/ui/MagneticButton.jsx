"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/animations";

/**
 * Wraps a single CTA link with a subtle magnetic-hover effect: the button
 * drifts a few pixels toward the pointer, then eases back on leave.
 * Reserved for the site's one or two most important CTAs — see the
 * instruction to keep this restrained, not applied to every button.
 *
 * Desktop-only (checked via `(pointer: fine)`), off entirely under
 * `prefers-reduced-motion`, and re-checked if either preference changes
 * mid-session. The click handler and href behave exactly as a plain <a>.
 */
export default function MagneticButton({ href, onClick, className = "", children, strength = 16 }) {
  const linkRef = useRef(null);

  useEffect(() => {
    const el = linkRef.current;
    if (!el) return undefined;

    const pointerQuery = window.matchMedia("(pointer: fine)");
    let setX = null;
    let setY = null;
    let handlePointerMove = null;
    let handlePointerLeave = null;

    function attach() {
      if (setX || prefersReducedMotion() || !pointerQuery.matches) return;

      setX = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
      setY = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });

      handlePointerMove = (event) => {
        const bounds = el.getBoundingClientRect();
        const relX = event.clientX - (bounds.left + bounds.width / 2);
        const relY = event.clientY - (bounds.top + bounds.height / 2);
        setX((relX / bounds.width) * strength);
        setY((relY / bounds.height) * strength);
      };
      handlePointerLeave = () => {
        setX(0);
        setY(0);
      };

      el.addEventListener("pointermove", handlePointerMove);
      el.addEventListener("pointerleave", handlePointerLeave);
    }

    function detach() {
      if (handlePointerMove) el.removeEventListener("pointermove", handlePointerMove);
      if (handlePointerLeave) el.removeEventListener("pointerleave", handlePointerLeave);
      gsap.set(el, { x: 0, y: 0 });
      setX = null;
      setY = null;
      handlePointerMove = null;
      handlePointerLeave = null;
    }

    attach();

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reEvaluate = () => (prefersReducedMotion() || !pointerQuery.matches ? detach() : attach());
    pointerQuery.addEventListener("change", reEvaluate);
    motionQuery.addEventListener("change", reEvaluate);

    return () => {
      detach();
      pointerQuery.removeEventListener("change", reEvaluate);
      motionQuery.removeEventListener("change", reEvaluate);
    };
  }, [strength]);

  return (
    <a ref={linkRef} href={href} onClick={onClick} className={className}>
      {children}
    </a>
  );
}
