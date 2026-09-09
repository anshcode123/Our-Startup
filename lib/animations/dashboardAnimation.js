/**
 * Section 08 — Software. The browser's content swaps from the plain
 * website to a dashboard: nav items, cards and a bar chart animate in, and
 * two numbers count up from zero.
 */
export function setDashboardInitialState(gsap, root) {
  gsap.set(root.querySelector(".story-dashboard"), { opacity: 0 });
  gsap.set(root.querySelectorAll(".story-dashboard-nav"), { opacity: 0, x: -10 });
  gsap.set(root.querySelectorAll(".story-dashboard-card"), { opacity: 0, y: 16 });
  gsap.set(root.querySelectorAll(".story-dashboard-bar"), { scaleY: 0 });
}

export function addDashboardStage(tl, gsap, root) {
  const numbers = root.querySelectorAll(".story-dashboard-number");

  tl.addLabel("dashboard")
    .to(
      root.querySelector(".story-dashboard"),
      { opacity: 1, duration: 0.3 },
      "dashboard"
    )
    .to(
      root.querySelectorAll(".story-dashboard-nav"),
      { opacity: 1, x: 0, duration: 0.3, stagger: 0.08 },
      "dashboard+=0.1"
    )
    .to(
      root.querySelectorAll(".story-dashboard-card"),
      { opacity: 1, y: 0, duration: 0.35, stagger: 0.1, ease: "power2.out" },
      "dashboard+=0.15"
    )
    .to(
      root.querySelectorAll(".story-dashboard-bar"),
      { scaleY: 1, duration: 0.4, stagger: 0.06, ease: "power2.out" },
      "dashboard+=0.35"
    );

  numbers.forEach((el, i) => {
    const target = Number(el.dataset.countTo || 0);
    const proxy = { value: 0 };
    tl.to(
      proxy,
      {
        value: target,
        duration: 0.5,
        ease: "power1.out",
        onUpdate: () => {
          el.textContent = Math.round(proxy.value).toString();
        },
      },
      `dashboard+=${0.35 + i * 0.1}`
    );
  });

  tl.to({}, { duration: 0.3 });
}
