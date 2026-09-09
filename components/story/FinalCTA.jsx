"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/animations";
import { scrollToSection } from "@/lib/scrollToSection";
import RocketVisual from "./RocketVisual";

/**
 * The site's large closing CTA. Sits near the end of the page (see
 * app/page.js), well after the pinned cinematic story earlier on — so
 * rather than continuing that exact pinned sequence, it reuses the same
 * <RocketVisual> on its own small, standalone (non-pinned) scroll trigger
 * as a visual callback to the earlier launch.
 */
export default function FinalCTA() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".story-final-item", { opacity: 0, y: 24 });
      gsap.to(".story-final-item", {
        opacity: 1,
        y: 0,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.set(".story-rocket", { opacity: 0, y: 40 });
      gsap.to(".story-rocket", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  function handleClick(event, href) {
    event.preventDefault();
    scrollToSection(href);
  }

  return (
    <section
      ref={sectionRef}
      className="bg-grid relative flex min-h-screen flex-col items-center justify-center gap-6 overflow-hidden border-t border-white/5 bg-ink px-6 py-32 text-center"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-10 flex h-56 justify-center opacity-60">
        <RocketVisual />
      </div>

      <p className="story-final-item relative text-xs uppercase tracking-[0.2em] text-white/40">
        Have an idea?
      </p>
      <h2 className="story-final-item relative max-w-2xl text-4xl leading-tight text-white sm:text-5xl">
        Let&apos;s build it.
      </h2>
      <p className="story-final-item relative max-w-md text-white/50">
        Tell us what you&apos;re building. We&apos;ll help turn the idea into a
        real digital product.
      </p>

      <div className="story-final-item relative flex flex-col items-center gap-4 sm:flex-row">
        <a
          href="#contact"
          onClick={(e) => handleClick(e, "#contact")}
          className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-transform hover:-translate-y-0.5"
        >
          Start a Project
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </a>
        <a
          href="#contact"
          onClick={(e) => handleClick(e, "#contact")}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm text-white transition-colors hover:border-white/40"
        >
          Get in Touch
        </a>
      </div>
    </section>
  );
}
