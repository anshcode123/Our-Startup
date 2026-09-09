/**
 * Section 06 — Mobile app. The phone slides in from the right and settles,
 * then its three app screens crossfade in sequence.
 */
export function setPhoneInitialState(gsap, root) {
  gsap.set(root.querySelector(".story-phone"), {
    opacity: 0,
    xPercent: 35,
    rotate: 8,
  });
  gsap.set(root.querySelectorAll(".story-phone-screen"), { opacity: 0 });
  gsap.set(root.querySelector(".story-phone-screen-1"), { opacity: 1 });
}

export function addPhoneStage(tl, gsap, root) {
  const screen1 = root.querySelector(".story-phone-screen-1");
  const screen2 = root.querySelector(".story-phone-screen-2");
  const screen3 = root.querySelector(".story-phone-screen-3");

  tl.addLabel("phone")
    .to(
      root.querySelector(".story-phone"),
      { opacity: 1, xPercent: 0, rotate: 0, duration: 0.6, ease: "power2.out" },
      "phone"
    )
    .to({}, { duration: 0.15 })
    .to(screen1, { opacity: 0, duration: 0.25 })
    .to(screen2, { opacity: 1, duration: 0.25 }, "<")
    .to({}, { duration: 0.2 })
    .to(screen2, { opacity: 0, duration: 0.25 })
    .to(screen3, { opacity: 1, duration: 0.25 }, "<")
    .to({}, { duration: 0.25 })
    // clear the phone before the browser/website stage
    .to(root.querySelector(".story-phone"), {
      opacity: 0,
      xPercent: -20,
      duration: 0.35,
      ease: "power1.in",
    });
}
