/**
 * Section 07 — Website. A CSS browser chrome that scales up from a small
 * window to a large one via `transform: scale`, which is cheap to animate
 * (no width/height layout thrash). Content (dashboard, etc.) is a slot.
 */
export default function BrowserVisual({ children }) {
  return (
    <div className="story-browser pointer-events-none absolute inset-0 flex origin-center items-center justify-center opacity-0">
      <div className="relative h-[62vh] w-[90vw] max-w-4xl overflow-hidden rounded-xl border border-white/15 bg-[#0f0f10] shadow-[0_50px_120px_-24px_rgba(0,0,0,0.9)]">
        <div className="relative z-20 flex h-8 items-center gap-3 border-b border-white/10 bg-white/[0.03] px-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="h-2 w-2 rounded-full bg-white/20" />
          </div>
          <span className="flex h-4 max-w-xs flex-1 items-center rounded bg-white/5 px-2 text-[9px] text-white/25">
            anshul.dev
          </span>
        </div>
        <div className="relative h-[calc(100%-2rem)] w-full overflow-hidden">{children}</div>
        <div aria-hidden="true" className="device-reflection pointer-events-none absolute inset-0 z-10" />
      </div>
    </div>
  );
}
