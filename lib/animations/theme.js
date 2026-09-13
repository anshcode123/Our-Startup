/**
 * GSAP's color tweening needs a real color value to interpolate from/to —
 * it can't resolve a `var(--color-accent)` CSS custom property reference.
 * This is the one place that duplicates the value from --color-accent in
 * app/globals.css; keep the two in sync if the brand accent ever changes.
 */
export const ACCENT_HEX = "#e3b168";
