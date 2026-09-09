/**
 * Section 07 — Website. A CSS browser chrome that scales up from a small
 * window to a large one via `transform: scale`, which is cheap to animate
 * (no width/height layout thrash). Content (dashboard, etc.) is a slot.
 */
export default function BrowserVisual({ children }) {
  return (
    <div className="story-browser pointer-events-none absolute inset-0 flex origin-center items-center justify-center opacity-0">
      <div className="relative h-[62vh] w-[90vw] max-w-4xl overflow-hidden rounded-xl border border-white/15 bg-[#0f0f10] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.85)]">
        <div className="flex h-8 items-center gap-1.5 border-b border-white/10 bg-white/[0.03] px-3">
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="ml-3 h-3.5 w-36 rounded bg-white/5" />
        </div>
        <div className="relative h-[calc(100%-2rem)] w-full overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
