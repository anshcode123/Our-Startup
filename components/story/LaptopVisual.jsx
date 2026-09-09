/**
 * Section 02 — Laptop. A CSS-built laptop frame (no image assets). The
 * screen area is a slot so later stages (UI assembly, code) can render
 * their content inside the same device rather than introducing a new one.
 */
export default function LaptopVisual({ children }) {
  return (
    <div className="story-laptop pointer-events-none absolute inset-0 flex origin-center items-center justify-center opacity-0">
      <div className="story-laptop-tilt flex flex-col items-center [transform-style:preserve-3d]">
        <div className="relative h-[210px] w-[340px] overflow-hidden rounded-t-xl border border-white/15 bg-[#0f0f10] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85)] sm:h-[260px] sm:w-[420px]">
          <div className="absolute inset-x-0 top-0 z-10 flex h-6 items-center gap-1.5 border-b border-white/10 bg-white/[0.03] px-3">
            <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
          </div>
          <div className="story-laptop-screen absolute inset-x-0 bottom-0 top-6">
            {children}
          </div>
        </div>
        <div className="h-3 w-[380px] rounded-b-lg border border-t-0 border-white/10 bg-[#141415] sm:w-[460px]" />
      </div>
    </div>
  );
}
