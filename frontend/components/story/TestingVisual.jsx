/**
 * Section 09 — Testing. A small checklist overlay that ticks off items one
 * at a time — a visual representation of the QA process, not a claim about
 * actual test results.
 */
const CHECKS = ["UI", "Performance", "Responsive", "Security", "Functionality"];

export default function TestingVisual() {
  return (
    <div className="story-testing pointer-events-none absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 backdrop-blur-sm">
      <div className="flex flex-col gap-3">
        {CHECKS.map((item) => (
          <div key={item} className="story-testing-item flex items-center gap-3 opacity-0">
            <span className="story-testing-check flex h-5 w-5 items-center justify-center rounded-full border border-white/25 text-[10px] text-transparent">
              ✓
            </span>
            <span className="text-sm text-white/70">{item}</span>
          </div>
        ))}
        <div className="story-testing-item mt-1 text-xs text-white/40 opacity-0">
          Ready to launch
        </div>
      </div>
    </div>
  );
}
