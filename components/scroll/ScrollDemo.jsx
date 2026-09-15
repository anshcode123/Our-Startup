"use client";

import { useLayoutEffect, useRef } from "react";
import {
  gsap,
  prefersReducedMotion,
  createPinnedSection,
  createParallax,
  createScaleAnimation,
  createRotationAnimation,
  createOpacityAnimation,
  createScrollTimeline,
} from "@/lib/animations";

/** Small numbered tag used to mark each demo as a step in this checklist. */
function DemoTag({ number, label }) {
  return (
    <div className="mb-6 flex items-center gap-3 text-sm text-white/40">
      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/15 text-xs">
        {number}
      </span>
      <span>{label}</span>
    </div>
  );
}

function SectionShell({ children, className = "" }) {
  return (
    <section className={`relative mx-auto max-w-4xl px-6 py-32 ${className}`}>
      {children}
    </section>
  );
}

/* ---------------------------------------------------------------- Demo A */
/* Sticky / pinned card that holds in place while the section scrolls by. */

function StickyDemo() {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      createPinnedSection({
        trigger: sectionRef.current,
        pin: cardRef.current,
        start: "top top",
        end: "+=100%",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[200vh]">
      <div className="mx-auto max-w-4xl px-6 pt-32">
        <DemoTag number="01" label="Sticky scrolling" />
      </div>
      <div
        ref={cardRef}
        className="flex h-screen items-center justify-center px-6"
      >
        <div className="flex h-64 w-full max-w-lg flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] text-center">
          <p className="text-lg text-white">Sticky card</p>
          <p className="text-sm text-white/40">
            Pinned in place with ScrollTrigger while you scroll
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Demo B */
/* Three layers moving at different speeds to prove depth is possible.    */

function ParallaxDemo() {
  const sectionRef = useRef(null);
  const backRef = useRef(null);
  const midRef = useRef(null);
  const frontRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      createParallax({
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        layers: [
          { element: backRef.current, speed: 0.4 },
          { element: midRef.current, speed: 1 },
          { element: frontRef.current, speed: 1.8 },
        ],
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <SectionShell>
      <DemoTag number="02" label="Parallax depth" />
      <div
        ref={sectionRef}
        className="relative flex h-[60vh] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]"
      >
        <div
          ref={backRef}
          className="absolute h-24 w-24 rounded-full bg-white/10"
          style={{ top: "20%", left: "20%" }}
        />
        <div
          ref={midRef}
          className="absolute h-16 w-16 rounded-full bg-white/25"
          style={{ top: "45%", left: "50%" }}
        />
        <div
          ref={frontRef}
          className="absolute h-10 w-10 rounded-full bg-white/50"
          style={{ top: "65%", left: "70%" }}
        />
        <p className="relative text-sm text-white/30">
          Background · middle · foreground
        </p>
      </div>
    </SectionShell>
  );
}

/* ---------------------------------------------------------------- Demo C */

function ScaleDemo() {
  const sectionRef = useRef(null);
  const boxRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      createScaleAnimation({
        trigger: sectionRef.current,
        target: boxRef.current,
        from: 0.7,
        to: 1.2,
        start: "top bottom",
        end: "bottom top",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <SectionShell>
      <DemoTag number="03" label="Scroll-controlled scale" />
      <div
        ref={sectionRef}
        className="flex h-[50vh] items-center justify-center"
      >
        <div
          ref={boxRef}
          className="flex h-40 w-40 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-sm text-white/50"
        >
          0.7 → 1.2
        </div>
      </div>
    </SectionShell>
  );
}

/* ---------------------------------------------------------------- Demo D */

function RotationDemo() {
  const sectionRef = useRef(null);
  const boxRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      createRotationAnimation({
        trigger: sectionRef.current,
        target: boxRef.current,
        from: -10,
        to: 10,
        start: "top bottom",
        end: "bottom top",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <SectionShell>
      <DemoTag number="04" label="Scroll-controlled rotation" />
      <div
        ref={sectionRef}
        className="flex h-[50vh] items-center justify-center"
      >
        <div
          ref={boxRef}
          className="flex h-40 w-40 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-sm text-white/50"
        >
          −10° → 10°
        </div>
      </div>
    </SectionShell>
  );
}

/* ---------------------------------------------------------------- Demo E */

function OpacityDemo() {
  const sectionRef = useRef(null);
  const boxRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      createOpacityAnimation({
        trigger: sectionRef.current,
        target: boxRef.current,
        start: "top bottom",
        end: "bottom top",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <SectionShell>
      <DemoTag number="05" label="Scroll-controlled opacity" />
      <div
        ref={sectionRef}
        className="flex h-[50vh] items-center justify-center"
      >
        <div
          ref={boxRef}
          className="flex h-40 w-40 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-sm text-white/50"
        >
          Fades in, then out
        </div>
      </div>
    </SectionShell>
  );
}

/* ---------------------------------------------------------------- Demo F */
/* One timeline drives opacity + position + scale + rotation together and  */
/* reverses cleanly when the visitor scrolls back up.                      */

function CombinedTimelineDemo() {
  const sectionRef = useRef(null);
  const boxRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      createScrollTimeline({
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        build: (tl) => {
          tl.fromTo(
            boxRef.current,
            { opacity: 0, y: 80, scale: 0.85, rotate: -6 },
            { opacity: 1, y: 0, scale: 1, rotate: 0, ease: "none" },
          );
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <SectionShell>
      <DemoTag number="06" label="Combined scroll timeline" />
      <div
        ref={sectionRef}
        className="flex h-[60vh] items-center justify-center"
      >
        <div
          ref={boxRef}
          className="flex h-48 w-full max-w-md items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-center text-sm text-white/50"
        >
          Opacity, position, scale and rotation — one timeline
        </div>
      </div>
    </SectionShell>
  );
}

/* ---------------------------------------------------------------- Demo G */
/* Two placeholder sections crossfading into one another.                  */

function SectionTransitionDemo() {
  const wrapRef = useRef(null);
  const firstRef = useRef(null);
  const secondRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top top",
          end: "+=100%",
          scrub: true,
          pin: true,
        },
      });

      tl.to(firstRef.current, {
        opacity: 0,
        scale: 0.92,
        y: -40,
        ease: "none",
      }).fromTo(
        secondRef.current,
        { opacity: 0, scale: 1.05, y: 40 },
        { opacity: 1, scale: 1, y: 0, ease: "none" },
        "<",
      );
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={wrapRef} className="relative h-screen overflow-hidden">
      <DemoTag number="07" label="Section transition" />
      <div
        ref={firstRef}
        className="absolute inset-0 flex items-center justify-center bg-ink"
      >
        <p className="max-w-sm text-center text-2xl text-white/70">
          Section one
        </p>
      </div>
      <div
        ref={secondRef}
        className="absolute inset-0 flex items-center justify-center bg-ink opacity-0"
      >
        <p className="max-w-sm text-center text-2xl text-white/70">
          Section two
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Page */

export default function ScrollDemo() {
  return (
    <main className="bg-ink text-paper">
      <header className="bg-grid relative flex h-screen flex-col items-center justify-center gap-6 px-6 text-center">
        <p className="text-sm text-white/40">
          AKIVRO.dev — scroll engine foundation
        </p>
        <h1 className="max-w-2xl text-4xl leading-tight sm:text-5xl">
          Scroll to test the animation system
        </h1>
        <p className="max-w-md text-white/50">
          A placeholder page proving out sticky, parallax, scale, rotation,
          opacity, timeline and transition scroll behaviors.
        </p>
      </header>

      <StickyDemo />
      <ParallaxDemo />
      <ScaleDemo />
      <RotationDemo />
      <OpacityDemo />
      <CombinedTimelineDemo />
      <SectionTransitionDemo />

      <footer className="flex flex-col items-center gap-2 px-6 py-32 text-center">
        <p className="text-white/40">End of Phase 1 demo</p>
        <p className="max-w-sm text-sm text-white/25">
          The real AKIVRO.dev story — idea to launch — is built on this
          foundation in a later phase.
        </p>
      </footer>
    </main>
  );
}
