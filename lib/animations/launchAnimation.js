/**
 * Section 11 — Launch. Everything else has already cleared the stage by
 * this point (see testingAnimation.js / connectionAnimation.js), so this
 * stage just brings the rocket up and lifts it off before the pin
 * releases into the final CTA section.
 */
export function setLaunchInitialState(gsap, root) {
  gsap.set(root.querySelector(".story-rocket"), { opacity: 0, y: 60, scale: 0.9 });
  gsap.set(root.querySelector(".story-rocket-flame"), { opacity: 0.6, scaleY: 0.6 });
}

export function addLaunchStage(tl, gsap, root) {
  tl.addLabel("launch")
    .to(
      root.querySelector(".story-rocket"),
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power2.out" },
      "launch"
    )
    .to(
      root.querySelector(".story-rocket-flame"),
      { scaleY: 1.3, opacity: 1, duration: 0.3, repeat: 3, yoyo: true },
      "launch+=0.2"
    )
    .to(
      root.querySelector(".story-rocket"),
      { y: -240, duration: 0.7, ease: "power1.in" },
      "launch+=0.7"
    )
    .to(
      root.querySelector(".story-rocket"),
      { opacity: 0, duration: 0.3 },
      "launch+=1.15"
    );
}
