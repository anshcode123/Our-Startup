/**
 * Section 04 — Code. The assembled interface dims and recedes slightly
 * (it stays visible behind the code panel, per the brief) while the code
 * panel fades in and its lines reveal top to bottom.
 */
export function setCodeInitialState(gsap, root) {
  gsap.set(root.querySelector(".story-code"), { opacity: 0, y: 16 });
  gsap.set(root.querySelectorAll(".story-code-line"), { opacity: 0, x: -8 });
}

export function addCodeStage(tl, gsap, root) {
  const codeLines = root.querySelectorAll(".story-code-line");

  tl.addLabel("code")
    .to(
      root.querySelector(".story-ui"),
      { opacity: 0.35, scale: 0.94, duration: 0.4, ease: "power1.inOut" },
      "code"
    )
    .to(
      root.querySelector(".story-code"),
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
      "code+=0.1"
    )
    .to(
      codeLines,
      { opacity: 1, x: 0, duration: 0.3, stagger: 0.15, ease: "power1.out" },
      "code+=0.25"
    )
    .to({}, { duration: 0.3 });
}
