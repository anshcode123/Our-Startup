/**
 * Section 10 — Connection / process. A recap timeline whose vertical line
 * draws itself via stroke-dashoffset while each stage node lights up.
 *
 * Reused as-is by components/site/Process.jsx with its own standalone
 * (non-pinned) ScrollTrigger and its own six labels — pass
 * `{ fadeOutAtEnd: false }` there so the finished diagram stays visible
 * instead of clearing the stage for the next cinematic beat.
 */
export function setConnectionInitialState(gsap, root) {
  gsap.set(root.querySelector(".story-connection"), { opacity: 0 });
  gsap.set(root.querySelector(".story-connection-line"), { strokeDashoffset: 100 });
  gsap.set(root.querySelectorAll(".story-connection-node"), { opacity: 0.3 });
  gsap.set(root.querySelectorAll(".story-connection-dot"), { scale: 1 });
}

export function addConnectionStage(tl, gsap, root, { fadeOutAtEnd = true } = {}) {
  const nodes = root.querySelectorAll(".story-connection-node");
  const dots = root.querySelectorAll(".story-connection-dot");

  tl.addLabel("connection").to(
    root.querySelector(".story-connection"),
    { opacity: 1, duration: 0.3 },
    "connection"
  );

  tl.to(
    root.querySelector(".story-connection-line"),
    { strokeDashoffset: 0, duration: 1, ease: "none" },
    "connection+=0.1"
  );

  nodes.forEach((node, i) => {
    const at = `connection+=${0.15 + (i / Math.max(nodes.length - 1, 1)) * 0.9}`;
    tl.to(node, { opacity: 1, duration: 0.2 }, at);
    if (dots[i]) {
      tl.to(dots[i], { scale: 1.6, duration: 0.15, yoyo: true, repeat: 1 }, at);
    }
  });

  tl.to({}, { duration: 0.3 });

  if (fadeOutAtEnd) {
    tl.to(
      root.querySelector(".story-connection"),
      { opacity: 0, duration: 0.35, ease: "power1.in" }
    );
  }
}
