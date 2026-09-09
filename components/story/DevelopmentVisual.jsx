/**
 * Section 05 — Development. A brief beat between "interface" and "code"
 * that visually reads as design + code = development, without looking
 * like a textbook architecture diagram.
 */
export default function DevelopmentVisual() {
  return (
    <div className="story-dev pointer-events-none absolute inset-0 flex items-center justify-center opacity-0">
      <div className="story-dev-grid bg-grid absolute h-[60%] w-[70%] rounded-2xl border border-white/10" />
      <div className="relative flex items-center gap-6 text-[11px] tracking-wide text-white/40 sm:gap-10">
        <span className="story-dev-label rounded-full border border-white/10 px-3 py-1">
          Design
        </span>
        <span className="story-dev-line h-px w-8 origin-left scale-x-0 bg-white/25 sm:w-10" />
        <span className="story-dev-label rounded-full border border-white/10 px-3 py-1">
          Code
        </span>
        <span className="story-dev-line h-px w-8 origin-left scale-x-0 bg-white/25 sm:w-10" />
        <span className="story-dev-label story-dev-label-final rounded-full border border-white/20 px-3 py-1 text-white/60">
          Development
        </span>
      </div>
    </div>
  );
}
