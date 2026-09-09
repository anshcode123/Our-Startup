"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger, responsiveValue } from "@/lib/animations";
import { buildStoryTimeline } from "@/lib/animations/storyAnimations";
import {
  IdeaVisual,
  LaptopVisual,
  UIComponentsVisual,
  CodeVisual,
  DevelopmentVisual,
  PhoneVisual,
  BrowserVisual,
  DashboardVisual,
  TestingVisual,
  ConnectionVisual,
  RocketVisual,
} from "@/components/story";

/**
 * The full, animated version of the story: one pinned stage, one scrubbed
 * master timeline (see lib/animations/storyAnimations.js). Rendered only
 * when the visitor has not requested reduced motion — see
 * CinematicStory.jsx for that branch.
 */
export default function CinematicStage() {
  const stageRef = useRef(null);

  useLayoutEffect(() => {
    const root = stageRef.current;
    if (!root) return;

    let handlePointerMove = null;

    const ctx = gsap.context(() => {
      const tl = buildStoryTimeline(gsap, root);

      const scrollDistance = responsiveValue({
        mobile: 4200,
        tablet: 6200,
        desktop: 8800,
      });

      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: `+=${scrollDistance}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        animation: tl,
      });

      // Subtle desktop-only tilt on the laptop, independent of the scroll
      // timeline so it never fights the scrubbed animation.
      const canTilt = window.matchMedia("(pointer: fine)").matches;
      const tiltTarget = canTilt ? root.querySelector(".story-laptop-tilt") : null;

      if (tiltTarget) {
        const setRotateX = gsap.quickTo(tiltTarget, "rotateX", {
          duration: 0.6,
          ease: "power2.out",
        });
        const setRotateY = gsap.quickTo(tiltTarget, "rotateY", {
          duration: 0.6,
          ease: "power2.out",
        });

        handlePointerMove = (event) => {
          const bounds = root.getBoundingClientRect();
          const relX = (event.clientX - bounds.left) / bounds.width - 0.5;
          const relY = (event.clientY - bounds.top) / bounds.height - 0.5;
          setRotateY(relX * 8);
          setRotateX(-relY * 8);
        };

        root.addEventListener("pointermove", handlePointerMove);
      }
    }, stageRef);

    return () => {
      if (handlePointerMove) root.removeEventListener("pointermove", handlePointerMove);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={stageRef} className="relative h-screen w-full overflow-hidden bg-ink">
      {/* The animated stage below is purely decorative scroll choreography —
          the page's one <h1> lives in CinematicStory.jsx so the same text
          summary applies to this variant and the reduced-motion one. */}
      <div aria-hidden="true">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-30" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.06),transparent_60%)]" />

        <div className="absolute inset-0 flex items-center justify-center [perspective:1200px]">
          <IdeaVisual />

          <LaptopVisual>
            <UIComponentsVisual />
            <CodeVisual />
          </LaptopVisual>

          <DevelopmentVisual />

          <PhoneVisual />

          <BrowserVisual>
            <DashboardVisual />
            <TestingVisual />
          </BrowserVisual>

          <ConnectionVisual />

          <RocketVisual />
        </div>
      </div>
    </section>
  );
}
