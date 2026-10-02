/**
 * Section 02 — Laptop. Fades the idea visual out and brings the laptop
 * onto the stage: moves up (yPercent, so it scales with the element's own
 * size across breakpoints), scales in, and settles with a subtle rotation.
 */
export function setLaptopInitialState(gsap, root) {
  gsap.set(root.querySelector(".story-laptop"), {
    opacity: 0,
    yPercent: 18,
    scale: 0.88,
    rotateX: 6,
  });
}

export function addLaptopStage(tl, gsap, root) {
  tl.addLabel("laptop")
    .to(
      root.querySelector(".story-idea"),
      { opacity: 0, scale: 1.15, duration: 0.4, ease: "power1.in" },
      "laptop"
    )
    .to(
      root.querySelector(".story-laptop"),
      {
        opacity: 1,
        yPercent: 0,
        scale: 1,
        rotateX: 0,
        duration: 0.9,
        ease: "power2.out",
      },
      "laptop+=0.1"
    );
}
