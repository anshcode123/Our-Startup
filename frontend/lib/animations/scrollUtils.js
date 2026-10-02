"use client";

/**
 * Generic, reusable builders for scroll-driven animations. Nothing in here
 * knows about laptops, phones, or any other final AKIVRO.dev visual — these
 * are the primitives future sections (sticky, parallax, timelines, etc.)
 * will be assembled from.
 *
 * Every builder returns the ScrollTrigger instance(s) it created so the
 * caller can kill() them on unmount.
 */

import { gsap, ScrollTrigger, prefersReducedMotion } from "./scroll";

// Markers are a development-only aid and must never ship to production.
const SHOW_MARKERS =
  process.env.NODE_ENV !== "production" &&
  process.env.NEXT_PUBLIC_SCROLL_DEBUG === "true";

/** Picks a value for the current viewport width (mobile-first breakpoints). */
export function responsiveValue({ mobile, tablet, desktop }) {
  if (typeof window === "undefined") return desktop;
  const width = window.innerWidth;
  if (width < 640) return mobile ?? tablet ?? desktop;
  if (width < 1024) return tablet ?? desktop;
  return desktop;
}

/**
 * Pins a trigger element in place for the duration of a scroll range.
 *
 * options:
 *   trigger, pin        elements/selectors (pin defaults to trigger)
 *   start, end          ScrollTrigger positions
 *   scrub               true/number, forwarded to ScrollTrigger
 */
export function createPinnedSection({
  trigger,
  pin = trigger,
  start = "top top",
  end = "+=100%",
  scrub = false,
  markers = SHOW_MARKERS,
  onUpdate,
} = {}) {
  if (!trigger) return null;

  return ScrollTrigger.create({
    trigger,
    pin,
    start,
    // Never trap a reduced-motion visitor in a long pinned section.
    end: prefersReducedMotion() ? "+=10%" : end,
    scrub,
    anticipatePin: 1,
    markers,
    onUpdate,
  });
}

/**
 * Moves a set of elements at different speeds while a container scrolls
 * through the viewport, for background/middle/foreground style depth.
 *
 * layers: [{ element, speed }]  speed 0 = static, 1 = normal, >1 = faster
 */
export function createParallax({
  trigger,
  layers = [],
  start = "top bottom",
  end = "bottom top",
  markers = SHOW_MARKERS,
} = {}) {
  if (!trigger || layers.length === 0) return [];

  if (prefersReducedMotion()) return [];

  return layers.map(({ element, speed = 1 }) => {
    const distance = 100 * speed;
    return gsap.fromTo(
      element,
      { y: distance },
      {
        y: -distance,
        ease: "none",
        scrollTrigger: {
          trigger,
          start,
          end,
          scrub: true,
          markers,
        },
      }
    );
  });
}

/**
 * Scrubs an element's scale between two values across a scroll range.
 */
export function createScaleAnimation({
  trigger,
  target = trigger,
  from = 0.7,
  to = 1.2,
  start = "top bottom",
  end = "bottom top",
  markers = SHOW_MARKERS,
} = {}) {
  if (!target) return null;
  if (prefersReducedMotion()) {
    gsap.set(target, { scale: 1 });
    return null;
  }

  return gsap.fromTo(
    target,
    { scale: from },
    {
      scale: to,
      ease: "none",
      scrollTrigger: { trigger, start, end, scrub: true, markers },
    }
  );
}

/**
 * Scrubs an element's rotation between two angles across a scroll range.
 */
export function createRotationAnimation({
  trigger,
  target = trigger,
  from = -10,
  to = 10,
  start = "top bottom",
  end = "bottom top",
  markers = SHOW_MARKERS,
} = {}) {
  if (!target) return null;
  if (prefersReducedMotion()) {
    gsap.set(target, { rotate: 0 });
    return null;
  }

  return gsap.fromTo(
    target,
    { rotate: from },
    {
      rotate: to,
      ease: "none",
      scrollTrigger: { trigger, start, end, scrub: true, markers },
    }
  );
}

/**
 * Fades an element in and back out as it passes through the viewport
 * (0 -> 1 -> 0 across the given scroll range).
 */
export function createOpacityAnimation({
  trigger,
  target = trigger,
  start = "top bottom",
  end = "bottom top",
  markers = SHOW_MARKERS,
} = {}) {
  if (!target) return null;
  if (prefersReducedMotion()) {
    gsap.set(target, { opacity: 1 });
    return null;
  }

  const tl = gsap.timeline({
    scrollTrigger: { trigger, start, end, scrub: true, markers },
  });

  tl.fromTo(target, { opacity: 0 }, { opacity: 1, ease: "none" }, 0)
    .to(target, { opacity: 0, ease: "none" }, 0.5);

  return tl;
}

/**
 * Builds a single scrubbed GSAP timeline for a trigger, so multiple
 * properties (opacity, position, scale, rotation, ...) can be driven by one
 * scroll range and reverse naturally when the user scrolls back up.
 *
 * `build(tl)` receives the timeline so the caller adds whatever tweens it
 * needs, in order.
 */
export function createScrollTimeline({
  trigger,
  start = "top bottom",
  end = "bottom top",
  scrub = true,
  pin = false,
  markers = SHOW_MARKERS,
  build,
} = {}) {
  if (!trigger || typeof build !== "function") return null;

  const tl = gsap.timeline({
    scrollTrigger: { trigger, start, end, scrub, pin, markers },
  });

  if (prefersReducedMotion()) {
    // Keep the timeline (so layout/pin behavior stays consistent) but drop
    // it straight to its end state instead of animating.
    build(tl);
    tl.progress(1);
    tl.scrollTrigger?.disable();
    return tl;
  }

  build(tl);
  return tl;
}

/**
 * Tracks overall page scroll progress and reports it as a 0..1 value.
 * Returns the ScrollTrigger instance so it can be killed on cleanup.
 */
export function createScrollProgress(onUpdate) {
  if (typeof document === "undefined") return null;

  return ScrollTrigger.create({
    trigger: document.documentElement,
    start: "top top",
    end: "bottom bottom",
    onUpdate: (self) => onUpdate(self.progress),
  });
}
