/**
 * Section 06 — Mobile app. A CSS-built phone frame with three simple app
 * screens that crossfade inside it as the story progresses.
 */
export default function PhoneVisual() {
  return (
    <div className="story-phone pointer-events-none absolute inset-0 flex items-center justify-center opacity-0">
      <div className="relative h-[260px] w-[140px] overflow-hidden rounded-[26px] border border-white/15 bg-[#0f0f10] p-1.5 shadow-[0_40px_90px_-24px_rgba(0,0,0,0.9)] sm:h-[320px] sm:w-[170px]">
        <div className="relative h-full w-full overflow-hidden rounded-[20px] bg-black">
          <div className="story-phone-screen story-phone-screen-1 absolute inset-0 flex flex-col items-center justify-center gap-2">
            <span className="h-8 w-8 rounded-xl bg-accent/30" />
            <span className="text-[10px] text-white/40">Home</span>
          </div>
          <div className="story-phone-screen story-phone-screen-2 absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0">
            <span className="h-16 w-24 rounded-lg bg-white/10" />
            <span className="text-[10px] text-white/40">Explore</span>
          </div>
          <div className="story-phone-screen story-phone-screen-3 absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0">
            <span className="flex h-6 w-20 items-center justify-center rounded-full bg-white text-[9px] font-medium text-black">
              Done
            </span>
            <span className="text-[10px] text-white/40">Complete</span>
          </div>

          {/* Notch and home indicator — purely cosmetic device detail. */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1.5 z-20 h-1.5 w-10 -translate-x-1/2 rounded-full bg-black/80"
          />
          <div
            aria-hidden="true"
            className="absolute bottom-1.5 left-1/2 z-20 h-1 w-10 -translate-x-1/2 rounded-full bg-white/25"
          />

          <div aria-hidden="true" className="device-reflection pointer-events-none absolute inset-0 z-10" />
        </div>
      </div>
    </div>
  );
}
