/**
 * Section 05 — Development. A short beat: the laptop's screen content
 * fades back, and a "Design — Code — Development" connector fades in on
 * top of a subtle grid, then clears the way for the mobile app stage.
 */
export function setDevelopmentInitialState(gsap, root) {
  gsap.set(root.querySelector(".story-dev"), { opacity: 0 });
  gsap.set(root.querySelectorAll(".story-dev-label"), { opacity: 0, y: 8 });
  gsap.set(root.querySelectorAll(".story-dev-line"), { scaleX: 0 });
}

export function addDevelopmentStage(tl, gsap, root) {
  tl.addLabel("development")
    .to(
      root.querySelector(".story-laptop"),
      { opacity: 0.25, scale: 0.92, duration: 0.4, ease: "power1.inOut" },
      "development"
    )
    .to(
      root.querySelector(".story-dev"),
      { opacity: 1, duration: 0.3 },
      "development+=0.05"
    )
    .to(
      root.querySelectorAll(".story-dev-label"),
      { opacity: 1, y: 0, duration: 0.3, stagger: 0.15 },
      "development+=0.15"
    )
    .to(
      root.querySelectorAll(".story-dev-line"),
      { scaleX: 1, duration: 0.3, stagger: 0.15 },
      "development+=0.2"
    )
    // clear the whole laptop scene before the phone takes over — timed to
    // start once the labels have finished appearing (development+=0.75 is
    // roughly when the last, third label's reveal completes).
    .to(
      [root.querySelector(".story-laptop"), root.querySelector(".story-dev")],
      { opacity: 0, duration: 0.35, ease: "power1.in" },
      "development+=0.85"
    );
}
