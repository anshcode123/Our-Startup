/**
 * Section 03 — UI assembly. Each interface piece already sits at its
 * resting position in the DOM (see UIComponentsVisual.jsx); we just offset
 * it with a transform and animate that offset back to zero, so nothing
 * about layout has to change — only transform/opacity.
 */
import { responsiveValue } from "./scrollUtils";

const SCATTER = {
  "story-ui-nav": { x: -60, y: -40, rotation: -8 },
  "story-ui-card": { x: -90, y: 30, rotation: -14 },
  "story-ui-chart": { x: 90, y: -20, rotation: 12 },
  "story-ui-input": { x: -70, y: 60, rotation: 10 },
  "story-ui-toggle": { x: 80, y: 50, rotation: -10 },
  "story-ui-button": { x: 0, y: 90, rotation: 6 },
};

export function setUIAssemblyInitialState(gsap, root) {
  gsap.set(root.querySelector(".story-ui"), { opacity: 1 });

  // The laptop screen itself is much smaller on mobile (see
  // LaptopVisual.jsx's fluid width), so the same pixel offsets tuned for
  // the desktop screen would fling pieces much further outside it
  // relatively. Scale the travel distance down on smaller screens —
  // rotation is left alone since it doesn't depend on available space.
  const distanceScale = responsiveValue({ mobile: 0.5, tablet: 0.75, desktop: 1 });

  Object.entries(SCATTER).forEach(([className, offset]) => {
    const el = root.querySelector(`.${className}`);
    if (el) {
      gsap.set(el, {
        x: offset.x * distanceScale,
        y: offset.y * distanceScale,
        rotation: offset.rotation,
        opacity: 0,
      });
    }
  });
}

export function addUIAssemblyStage(tl, gsap, root) {
  tl.addLabel("ui-assembly");

  Object.keys(SCATTER).forEach((className, i) => {
    const el = root.querySelector(`.${className}`);
    if (!el) return;
    tl.to(
      el,
      { x: 0, y: 0, rotation: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
      `ui-assembly+=${i * 0.08}`
    );
  });

  // hold the assembled interface on screen briefly
  tl.to({}, { duration: 0.35 });
}
