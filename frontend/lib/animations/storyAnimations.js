"use client";

/**
 * Builds the single master GSAP timeline for the cinematic story. This is
 * the only timeline driving the pinned stage — every per-object animation
 * file just appends to it, which is what makes the whole sequence feel
 * continuous and lets it reverse cleanly when the visitor scrolls back up.
 *
 * `root` is the DOM node containing every `.story-*` element (the pinned
 * stage). Nothing here creates its own ScrollTrigger — the caller
 * (CinematicStage.jsx) wraps this timeline in exactly one
 * `ScrollTrigger.create({ animation: tl, pin: true, scrub: true, ... })`,
 * reusing the Phase 1 scroll engine.
 */

import { setIdeaInitialState, addIdeaStage } from "./ideaAnimation";
import { setLaptopInitialState, addLaptopStage } from "./laptopAnimation";
import { setUIAssemblyInitialState, addUIAssemblyStage } from "./uiAssemblyAnimation";
import { setCodeInitialState, addCodeStage } from "./codeAnimation";
import { setDevelopmentInitialState, addDevelopmentStage } from "./developmentAnimation";
import { setPhoneInitialState, addPhoneStage } from "./phoneAnimation";
import { setBrowserInitialState, addBrowserStage } from "./browserAnimation";
import { setDashboardInitialState, addDashboardStage } from "./dashboardAnimation";
import { setTestingInitialState, addTestingStage } from "./testingAnimation";
import { setConnectionInitialState, addConnectionStage } from "./connectionAnimation";
import { setLaunchInitialState, addLaunchStage } from "./launchAnimation";
import { ACCENT_HEX } from "./theme";

const STAGE_LAYER_CLASSES = [
  "story-laptop",
  "story-ui",
  "story-code",
  "story-dev",
  "story-phone",
  "story-browser",
  "story-connection",
  "story-rocket",
];

/** Hides every stage layer up front; each stage's own init fn then sets its detailed starting transform. */
function hideAllLayers(gsap, root) {
  STAGE_LAYER_CLASSES.forEach((className) => {
    const el = root.querySelector(`.${className}`);
    if (el) gsap.set(el, { opacity: 0 });
  });
}

/**
 * Builds and returns the master timeline. Does not attach a ScrollTrigger —
 * the caller does that so it stays in charge of pin/scrub configuration.
 */
export function buildStoryTimeline(gsap, root) {
  hideAllLayers(gsap, root);

  setIdeaInitialState(gsap, root);
  setLaptopInitialState(gsap, root);
  setUIAssemblyInitialState(gsap, root);
  setCodeInitialState(gsap, root);
  setDevelopmentInitialState(gsap, root);
  setPhoneInitialState(gsap, root);
  setBrowserInitialState(gsap, root);
  setDashboardInitialState(gsap, root);
  setTestingInitialState(gsap, root);
  setConnectionInitialState(gsap, root);
  setLaunchInitialState(gsap, root);

  const tl = gsap.timeline();

  addIdeaStage(tl, gsap, root);
  addLaptopStage(tl, gsap, root);
  addUIAssemblyStage(tl, gsap, root);
  addCodeStage(tl, gsap, root);
  addDevelopmentStage(tl, gsap, root);
  addPhoneStage(tl, gsap, root);
  addBrowserStage(tl, gsap, root);
  addDashboardStage(tl, gsap, root);
  addTestingStage(tl, gsap, root);
  addConnectionStage(tl, gsap, root);
  addLaunchStage(tl, gsap, root);

  return tl;
}

/**
 * Reduced-motion / non-pinned fallback: sets every layer straight to a
 * calm, fully visible resting state with no scatter, no off-stage offsets,
 * and no scrubbed transforms — used by <SimpleStory>. Content stays
 * reachable and readable without depending on any animation.
 */
export function showStoryElementsAtRest(gsap, root) {
  const everything = root.querySelectorAll(
    ".story-idea, .story-idea-ring, .story-idea-core, .story-idea-label, .story-laptop, .story-ui, .story-ui-item, .story-code, .story-code-line, .story-dev, .story-dev-label, .story-dev-line, .story-phone, .story-phone-screen-1, .story-phone-screen-2, .story-phone-screen-3, .story-browser, .story-dashboard, .story-dashboard-nav, .story-dashboard-card, .story-dashboard-bar, .story-testing, .story-testing-item, .story-testing-check, .story-connection, .story-connection-node, .story-connection-dot, .story-rocket, .story-rocket-flame"
  );

  // Remove any inline transforms/offsets first, then explicitly set the
  // resting opacity — this has to be a separate call because an
  // opacity-0 utility class (used as the pinned-stage starting point)
  // outranks clearProps, which only clears GSAP-authored inline styles.
  gsap.set(everything, { clearProps: "all" });
  gsap.set(everything, { opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 });
  gsap.set(root.querySelectorAll(".story-dashboard-bar"), { scaleY: 1 });
  gsap.set(root.querySelector(".story-dashboard-progress-fill"), { scaleX: 1 });
  gsap.set(root.querySelectorAll(".story-phone-screen-2, .story-phone-screen-3"), {
    opacity: 0,
  });
  gsap.set(root.querySelectorAll(".story-testing-check"), { color: ACCENT_HEX });
  gsap.set(root.querySelector(".story-connection-line"), { strokeDashoffset: 0 });

  root.querySelectorAll(".story-dashboard-number").forEach((el) => {
    el.textContent = el.dataset.countTo || "0";
  });
  const progressLabel = root.querySelector(".story-dashboard-progress-label");
  if (progressLabel) {
    progressLabel.textContent = `${progressLabel.dataset.progressTo || 0}%`;
  }
}
