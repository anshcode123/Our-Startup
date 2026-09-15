"use client";

import { useEffect, useState } from "react";
import CinematicStage from "./CinematicStage";
import SimpleStory from "./SimpleStory";

/**
 * Decides once (and keeps watching) whether the visitor has asked for
 * reduced motion, and renders the matching variant of the story. This
 * component only renders the story itself — the page's <h1> now lives in
 * <Hero> (see components/site/Hero.jsx), and the final CTA is composed
 * separately in app/page.js alongside the rest of the site sections.
 */
export default function CinematicStory() {
  // Start with the safe, static assumption; upgrade to the animated stage
  // once we can confirm the visitor hasn't asked for reduced motion. This
  // avoids ever building the pinned experience for someone who opted out.
  const [reducedMotion, setReducedMotion] = useState(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);

    const handleChange = (event) => setReducedMotion(event.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  return (
    <>
      {/* The animated stage is decorative scroll choreography; this states
          the same story in plain text for screen readers and no-JS. */}
      <p className="sr-only">
        AKIVRO.dev turns an idea into a finished digital product: idea, design,
        interface, code, development, mobile app, website, software, testing,
        and launch.
      </p>

      {reducedMotion === false ? <CinematicStage /> : <SimpleStory />}
    </>
  );
}
