/**
 * Section 01 — Idea. Appended at the very start of the master timeline.
 * Downstream stages are responsible for fading this one out when they take
 * over (see laptopAnimation.js), since GSAP timeline labels can only
 * reference positions that already exist at call time.
 */
export function setIdeaInitialState(gsap, root) {
  gsap.set(root.querySelectorAll(".story-idea-ring"), { scale: 0.6, opacity: 0 });
  gsap.set(root.querySelector(".story-idea-core"), { scale: 0.4 });
  gsap.set(root.querySelector(".story-idea-label"), { opacity: 0, y: 10 });
}

export function addIdeaStage(tl, gsap, root) {
  tl.addLabel("idea", 0)
    .to(
      root.querySelector(".story-idea-core"),
      { scale: 1, duration: 0.4, ease: "power2.out" },
      "idea"
    )
    .to(
      root.querySelectorAll(".story-idea-ring"),
      { scale: 1, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" },
      "idea+=0.05"
    )
    .to(
      root.querySelector(".story-idea-label"),
      { opacity: 1, y: 0, duration: 0.3 },
      "idea+=0.15"
    )
    // hold briefly so the idea reads clearly before it starts transforming
    .to({}, { duration: 0.3 });
}
