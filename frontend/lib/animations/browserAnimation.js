/**
 * Section 07 — Website. The browser window fades in small and scales up —
 * only `transform: scale` and `opacity` are animated, so this stays cheap
 * even at a large final size.
 */
export function setBrowserInitialState(gsap, root) {
  gsap.set(root.querySelector(".story-browser"), { opacity: 0, scale: 0.4 });
}

export function addBrowserStage(tl, gsap, root) {
  tl.addLabel("browser").to(
    root.querySelector(".story-browser"),
    { opacity: 1, scale: 1, duration: 0.7, ease: "power2.out" },
    "browser"
  );

  tl.to({}, { duration: 0.25 });
}
