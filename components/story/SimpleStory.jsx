"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/animations";
import { showStoryElementsAtRest } from "@/lib/animations/storyAnimations";
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

const STEPS = [
  { key: "idea", title: "An idea", body: "Every product starts as a simple idea." },
  { key: "laptop", title: "Design", body: "We shape it into something people can use." },
  { key: "ui", title: "Interface", body: "Components come together into a real interface." },
  { key: "code", title: "Code", body: "The interface becomes working software." },
  { key: "dev", title: "Development", body: "Design and code come together in development." },
  { key: "phone", title: "Mobile app", body: "The product finds its place on a phone." },
  { key: "browser", title: "Website", body: "And on the web, at any size." },
  { key: "dashboard", title: "Software", body: "Custom software keeps a business running." },
  { key: "testing", title: "Testing", body: "Every product is checked before it ships." },
  { key: "connection", title: "The process", body: "Idea, design, code, build, test, launch." },
  { key: "rocket", title: "Launch", body: "Then it goes live." },
];

/**
 * Renders the same story visuals as <CinematicStage>, but stacked in
 * normal document flow, statically visible, with no pin and no scrubbed
 * motion — for visitors who have asked for reduced motion. Each visual is
 * paired with a plain-text heading so nothing depends on the animation to
 * be understood.
 */
export default function SimpleStory() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      showStoryElementsAtRest(gsap, rootRef.current);
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="bg-ink">
      <StepSection {...STEPS[0]}>
        <IdeaVisual />
      </StepSection>

      <StepSection {...STEPS[1]}>
        <LaptopVisual>
          <UIComponentsVisual />
        </LaptopVisual>
      </StepSection>

      <StepSection {...STEPS[3]}>
        <LaptopVisual>
          <CodeVisual />
        </LaptopVisual>
      </StepSection>

      <StepSection {...STEPS[4]}>
        <DevelopmentVisual />
      </StepSection>

      <StepSection {...STEPS[5]}>
        <PhoneVisual />
      </StepSection>

      <StepSection {...STEPS[6]}>
        <BrowserVisual />
      </StepSection>

      <StepSection {...STEPS[7]}>
        <BrowserVisual>
          <DashboardVisual />
        </BrowserVisual>
      </StepSection>

      <StepSection {...STEPS[8]}>
        <BrowserVisual>
          <DashboardVisual />
          <TestingVisual />
        </BrowserVisual>
      </StepSection>

      <StepSection {...STEPS[9]}>
        <ConnectionVisual />
      </StepSection>

      <StepSection {...STEPS[10]}>
        <RocketVisual />
      </StepSection>
    </div>
  );
}

function StepSection({ title, body, children }) {
  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center gap-8 px-6 py-16 sm:min-h-screen">
      <div className="relative flex h-64 w-full max-w-md items-center justify-center sm:h-80">
        {children}
      </div>
      <div className="max-w-sm text-center">
        <h2 className="text-lg text-white">{title}</h2>
        <p className="mt-1 text-sm text-white/50">{body}</p>
      </div>
    </section>
  );
}
