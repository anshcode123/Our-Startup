"use client";

import { getLenis } from "@/lib/animations";

/**
 * Scrolls to a section by id/selector using the existing Lenis instance
 * (so in-page navigation feels the same as the rest of the scroll
 * experience) with a plain-scroll fallback if Lenis isn't up yet.
 * Shared by Navigation, Hero, FinalCTA, and Footer so there's exactly one
 * implementation of "click a link, scroll to a section".
 */
export function scrollToSection(href) {
  if (typeof document === "undefined") return;
  const target = document.querySelector(href);
  if (!target) return;

  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(target, { offset: -80 });
  } else {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
