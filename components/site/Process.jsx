"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/animations";
import { setConnectionInitialState, addConnectionStage } from "@/lib/animations/connectionAnimation";
import { showStoryElementsAtRest } from "@/lib/animations/storyAnimations";
import { ConnectionVisual } from "@/components/story";

const STEPS = [
  { title: "Discover", description: "Understand the business, users, and problem." },
  { title: "Plan", description: "Define scope, technology, timeline, and priorities." },
  { title: "Design", description: "Turn ideas into clear and usable experiences." },
  { title: "Build", description: "Develop the product using modern technology." },
  { title: "Test", description: "Validate functionality, responsiveness, and experience." },
  { title: "Launch", description: "Deploy the product and prepare it for real users." },
];

/**
 * Reuses the exact same visual (<ConnectionVisual>) and animation builders
 * (setConnectionInitialState / addConnectionStage) that Phase 2 uses inside
 * the pinned cinematic timeline — but here they're driven by their own
 * ordinary (non-pinned) ScrollTrigger, since this section isn't part of
 * the mega-timeline. `fadeOutAtEnd: false` keeps the finished diagram
 * visible instead of clearing the stage the way the cinematic version does.
 */
export default function Process() {
  const sectionRef = useRef(null);
  const visualRef = useRef(null);

  useLayoutEffect(() => {
    const root = visualRef.current;
    if (!root) return undefined;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        // Show the finished diagram at rest — line fully drawn, every
        // stage lit — instead of running the scroll-scrubbed draw-on.
        // Reuses the same rest-state helper the reduced-motion cinematic
        // story fallback (SimpleStory) uses.
        showStoryElementsAtRest(gsap, root);
        return;
      }

      setConnectionInitialState(gsap, root);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom 60%",
          scrub: 1,
        },
      });

      addConnectionStage(tl, gsap, root, { fadeOutAtEnd: false });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="process" ref={sectionRef} className="relative border-t border-white/5 bg-ink px-6 py-32">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-xl">
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">Process</p>
          <h2 className="mt-3 text-4xl text-white sm:text-5xl">From idea to launch.</h2>
        </div>

        <div className="mt-16 grid gap-12 md:grid-cols-2 md:items-center">
          <div ref={visualRef} className="relative flex min-h-[420px] items-center justify-center">
            <ConnectionVisual stages={STEPS.map((step) => step.title)} />
          </div>

          <ol className="flex flex-col gap-8">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="pt-0.5 text-sm text-white/50">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-white">{step.title}</h3>
                  <p className="mt-1 text-sm text-white/50">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
