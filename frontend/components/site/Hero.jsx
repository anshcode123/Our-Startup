"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/animations";
import { scrollToSection } from "@/lib/scrollToSection";
import MagneticButton from "@/components/ui/MagneticButton";

/**
 * The real homepage hero. Sits directly above <CinematicStage> in normal
 * document flow â€” scrolling out of the hero and into the pinned story
 * happens as one continuous scroll, with no hard cut. To reinforce that,
 * the hero's own text gently fades and drifts up as it scrolls toward the
 * top of the viewport instead of just disappearing abruptly.
 */
export default function Hero() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const ctx = gsap.context(() => {
      gsap.to(".hero-fade", {
        opacity: 0,
        y: -24,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
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
      id="top"
      ref={sectionRef}
      className="bg-grid relative flex h-screen flex-col items-center justify-center gap-6 bg-ink px-6 text-center"
    >
      <div className="bg-accent-glow bg-noise pointer-events-none absolute inset-0" />

      <p className="hero-fade relative text-xs uppercase tracking-[0.2em] text-white/50">
        Anshul.dev â€” software development studio
      </p>

      <h1 className="hero-fade relative max-w-3xl text-5xl leading-[1.05] text-white sm:text-6xl md:text-7xl">
        Build what&apos;s next.
      </h1>

      <p className="hero-fade relative max-w-xl text-base text-white/50 sm:text-lg">
        We design and develop modern websites, mobile apps, and custom software
        for businesses ready to move forward.
      </p>

      <div className="hero-fade relative flex flex-col items-center gap-4 sm:flex-row">
        <MagneticButton
          href="#contact"
          onClick={(e) => handleClick(e, "#contact")}
          className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-shadow duration-300 hover:shadow-[0_0_0_1px_var(--color-accent),0_10px_30px_-8px_var(--color-accent)]"
        >
          Start a Project
          <span
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-0.5"
          >
            â†’
          </span>
        </MagneticButton>
        <a
          href="#work"
          onClick={(e) => handleClick(e, "#work")}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm text-white transition-colors hover:border-white/40"
        >
          Explore Our Work
        </a>
      </div>

      <span className="hero-fade absolute bottom-8 text-xs uppercase tracking-widest text-white/50">
        Scroll
      </span>
    </section>
  );
}
