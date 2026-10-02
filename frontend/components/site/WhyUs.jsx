"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/animations";

const PRINCIPLES = [
  {
    title: "Strategy First",
    description: "We understand the problem before we start building.",
  },
  {
    title: "Designed for People",
    description:
      "Every product should be simple, useful, and enjoyable to use.",
  },
  {
    title: "Engineered to Perform",
    description: "Clean architecture and reliable technology matter.",
  },
  {
    title: "Built to Grow",
    description: "We create products that can evolve with your business.",
  },
];

export default function WhyUs() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".principle-card");

      if (prefersReducedMotion()) {
        gsap.set(cards, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(cards, { opacity: 0, y: 30 });
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="why-anshul-dev"
      ref={sectionRef}
      className="relative border-t border-white/5 bg-ink px-6 py-32"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-xl">
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">
            Why Anshul.dev
          </p>
          <h2 className="mt-3 text-4xl text-white sm:text-5xl">
            Built with purpose.
          </h2>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PRINCIPLES.map((principle) => (
            <div
              key={principle.title}
              className="principle-card rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
            >
              <h3 className="text-white">{principle.title}</h3>
              <p className="mt-2 text-sm text-white/50">
                {principle.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
