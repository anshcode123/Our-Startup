"use client";

/**
 * Centralized scroll engine.
 *
 * Wiring:
 *   Lenis (smooth scroll physics)
 *     -> GSAP ticker (single shared animation frame loop)
 *       -> ScrollTrigger (kept in sync with Lenis' scroll position)
 *         -> scroll-driven animations built with lib/animations/scrollUtils.js
 *
 * This module owns exactly one Lenis instance for the whole app. Never
 * instantiate Lenis anywhere else — call initScrollEngine() once (from
 * <SmoothScroll>) and read the shared instance with getLenis().
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

let lenis = null;
let tickerFn = null;
let refCount = 0;

/** True when the visitor's OS/browser asks for reduced motion. */
export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Returns the shared Lenis instance, or null before initialization. */
export function getLenis() {
  return lenis;
}

/**
 * Creates the shared Lenis instance and connects it to the GSAP ticker and
 * ScrollTrigger. Safe to call from multiple mounted components — the engine
 * is only ever created once (ref-counted) and torn down when the last
 * consumer unmounts.
 */
export function initScrollEngine(options = {}) {
  if (typeof window === "undefined") return null;

  refCount += 1;

  if (lenis) return lenis;

  const reduced = prefersReducedMotion();

  lenis = new Lenis({
    duration: reduced ? 0.4 : 1.15,
    smoothWheel: !reduced,
    // Leave touch scrolling native — Lenis should never fight the browser's
    // own touch/momentum scrolling on phones and tablets.
    syncTouch: false,
    touchMultiplier: 1,
    ...options,
  });

  // Every time Lenis moves the page, tell ScrollTrigger to recompute.
  lenis.on("scroll", ScrollTrigger.update);

  // Drive Lenis from GSAP's ticker instead of its own requestAnimationFrame
  // loop, so there is exactly one animation-frame loop for the whole app.
  tickerFn = (time) => {
    lenis.raf(time * 1000);
  };
  gsap.ticker.add(tickerFn);
  // GSAP's ticker normally smooths out lag spikes by dropping frames, which
  // fights Lenis' own timing. Disable that for a consistent feel.
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

/**
 * Releases one consumer's hold on the scroll engine. Once every consumer
 * has released it, Lenis is destroyed and the ticker callback removed so
 * nothing keeps animating in the background.
 */
export function destroyScrollEngine() {
  if (typeof window === "undefined") return;

  refCount = Math.max(0, refCount - 1);
  if (refCount > 0) return;

  if (tickerFn) {
    gsap.ticker.remove(tickerFn);
    tickerFn = null;
  }
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }
}

export { gsap, ScrollTrigger };
