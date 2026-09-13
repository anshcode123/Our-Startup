/**
 * Section 01 — Idea. A minimal glowing point with two expanding rings and a
 * label, standing in for "a starting idea" before it becomes a product.
 * Purely presentational — see lib/animations/ideaAnimation.js for motion.
 */
export default function IdeaVisual() {
  return (
    <div className="story-idea pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-6">
      <div className="relative flex h-24 w-24 items-center justify-center">
        <span className="story-idea-ring story-idea-ring-1 absolute inset-0 rounded-full border border-white/20" />
        <span className="story-idea-ring story-idea-ring-2 absolute inset-0 rounded-full border border-white/10" />
        <span className="story-idea-core relative h-3.5 w-3.5 rounded-full bg-accent shadow-[0_0_40px_10px_color-mix(in_srgb,var(--color-accent)_45%,transparent)]" />
      </div>
      <div className="story-idea-label rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs tracking-wide text-white/50">
        An idea
      </div>
    </div>
  );
}
