/**
 * Section 09 — Testing. A checklist overlays the dashboard and ticks off
 * one item at a time: build -> test -> ready.
 */
export function setTestingInitialState(gsap, root) {
  gsap.set(root.querySelector(".story-testing"), { opacity: 0 });
  gsap.set(root.querySelectorAll(".story-testing-item"), { opacity: 0, y: 10 });
  gsap.set(root.querySelectorAll(".story-testing-check"), { color: "transparent", scale: 0.8 });
}

export function addTestingStage(tl, gsap, root) {
  const items = root.querySelectorAll(".story-testing-item");
  const checks = root.querySelectorAll(".story-testing-check");

  tl.addLabel("testing").to(
    root.querySelector(".story-testing"),
    { opacity: 1, duration: 0.3 },
    "testing"
  );

  items.forEach((item, i) => {
    tl.to(item, { opacity: 1, y: 0, duration: 0.25 }, `testing+=${0.1 + i * 0.15}`);
    const check = checks[i];
    if (check) {
      tl.to(
        check,
        { color: "#ffffff", scale: 1, duration: 0.2 },
        `testing+=${0.15 + i * 0.15}`
      );
    }
  });

  tl.to({}, { duration: 0.3 });
  // clear the browser/dashboard/testing group before the process recap
  tl.to(
    [
      root.querySelector(".story-browser"),
      root.querySelector(".story-testing"),
    ],
    { opacity: 0, duration: 0.35, ease: "power1.in" }
  );
}
