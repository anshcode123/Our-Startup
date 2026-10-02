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

const STEPS = {
  idea: { title: "An idea", body: "Every product starts as a simple idea." },
  laptop: { title: "Design", body: "We shape it into something people can use." },
  code: { title: "Code", body: "The interface becomes working software." },
  dev: { title: "Development", body: "Design and code come together in development." },
  phone: { title: "Mobile app", body: "The product finds its place on a phone." },
  browser: { title: "Website", body: "And on the web, at any size." },
  dashboard: { title: "Software", body: "Custom software keeps a business running." },
  testing: { title: "Testing", body: "Every product is checked before it ships." },
  connection: { title: "The process", body: "Idea, design, code, build, test, launch." },
  rocket: { title: "Launch", body: "Then it goes live." },
};

/**
 * Renders the same story visuals as <CinematicStage>, but stacked in
 * normal document flow, statically visible, with no pin and no scrubbed
 * motion — for visitors who have asked for reduced motion. Each visual is
 * paired with a plain-text heading so nothing depends on the animation to
 * be understood.
 *
 * Note: each STEPS entry is passed as explicit `title`/`body` props (not
 * `{...STEPS.x}`) — the section keys below (`key="idea"`, etc.) are plain
 * JSX keys, not part of a spread object, which is what React's "props
 * object containing a 'key' prop" warning is about.
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
      <StepSection key="idea" title={STEPS.idea.title} body={STEPS.idea.body}>
        <IdeaVisual />
      </StepSection>

      <StepSection key="laptop" title={STEPS.laptop.title} body={STEPS.laptop.body}>
        <LaptopVisual>
          <UIComponentsVisual />
        </LaptopVisual>
      </StepSection>

      <StepSection key="code" title={STEPS.code.title} body={STEPS.code.body}>
        <LaptopVisual>
          <CodeVisual />
        </LaptopVisual>
      </StepSection>

      <StepSection key="dev" title={STEPS.dev.title} body={STEPS.dev.body}>
        <DevelopmentVisual />
      </StepSection>

      <StepSection key="phone" title={STEPS.phone.title} body={STEPS.phone.body}>
        <PhoneVisual />
      </StepSection>

      <StepSection key="browser" title={STEPS.browser.title} body={STEPS.browser.body}>
        <BrowserVisual />
      </StepSection>

      <StepSection key="dashboard" title={STEPS.dashboard.title} body={STEPS.dashboard.body}>
        <BrowserVisual>
          <DashboardVisual />
        </BrowserVisual>
      </StepSection>

      <StepSection key="testing" title={STEPS.testing.title} body={STEPS.testing.body}>
        <BrowserVisual>
          <DashboardVisual />
          <TestingVisual />
        </BrowserVisual>
      </StepSection>

      <StepSection key="connection" title={STEPS.connection.title} body={STEPS.connection.body}>
        <ConnectionVisual />
      </StepSection>

      <StepSection key="rocket" title={STEPS.rocket.title} body={STEPS.rocket.body}>
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
