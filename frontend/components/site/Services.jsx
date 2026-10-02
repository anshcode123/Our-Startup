"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/animations";

const SERVICES = [
  {
    number: "01",
    title: "Website Development",
    description:
      "High-performance websites that turn ideas into memorable digital experiences.",
    items: ["Business websites", "Landing pages", "Marketing websites", "Web applications"],
  },
  {
    number: "02",
    title: "Mobile App Development",
    description:
      "Mobile experiences designed to feel fast, intuitive, and built for real users.",
    items: ["iOS", "Android", "Cross-platform apps", "Mobile-first experiences"],
  },
  {
    number: "03",
    title: "Custom Software",
    description:
      "Purpose-built software designed around the way your business actually works.",
    items: ["Business applications", "Internal tools", "Dashboards", "Workflow systems"],
  },
  {
    number: "04",
    title: "SaaS & Digital Products",
    description: "Scalable digital products built from concept to launch.",
    items: ["MVP development", "SaaS platforms", "Product development", "Technical implementation"],
  },
];

export default function Services() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".service-card");
      const reduced = prefersReducedMotion();

      if (reduced) {
        // Skip the scroll-driven reveal and drift entirely — cards are
        // simply visible, per prefers-reduced-motion.
        gsap.set(cards, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(cards, { opacity: 0, y: 40 });
      cards.forEach((card) => {
        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });

        // A restrained parallax drift on the big background number — the
        // cinematic story remains the major animation on the page.
        const number = card.querySelector(".service-number");
        if (number) {
          gsap.to(number, {
            y: -16,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="services" ref={sectionRef} className="relative bg-ink px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-xl">
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">Services</p>
          <h2 className="mt-3 text-4xl text-white sm:text-5xl">What we build.</h2>
          <p className="mt-4 text-white/50">
            Digital products designed around your business, your users, and your goals.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {SERVICES.map((service) => (
            <div
              key={service.number}
              className="service-card group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
            >
              <span
                aria-hidden="true"
                className="service-number pointer-events-none absolute right-6 top-4 text-6xl font-light text-accent/[0.08]"
              >
                {service.number}
              </span>
              <h3 className="relative text-xl text-white">{service.title}</h3>
              <p className="relative mt-3 text-sm text-white/50">{service.description}</p>
              <ul className="relative mt-5 flex flex-wrap gap-2">
                {service.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/50"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
