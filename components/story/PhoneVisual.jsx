/**
 * Section 06 — Mobile app. A CSS-built phone frame with three simple app
 * screens that crossfade inside it as the story progresses.
 */
export default function PhoneVisual() {
  return (
    <div className="story-phone pointer-events-none absolute inset-0 flex items-center justify-center opacity-0">
      <div className="relative h-[260px] w-[140px] overflow-hidden rounded-[26px] border border-white/15 bg-[#0f0f10] p-1.5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85)] sm:h-[320px] sm:w-[170px]">
        <div className="relative h-full w-full overflow-hidden rounded-[20px] bg-black">
          <div className="story-phone-screen story-phone-screen-1 absolute inset-0 flex flex-col items-center justify-center gap-2">
            <span className="h-8 w-8 rounded-xl bg-white/20" />
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
        </div>
      </div>
    </div>
  );
}
