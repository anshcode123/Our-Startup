/**
 * Section 03 — UI assembly. A handful of generic interface pieces (nav,
 * card, chart, button, input, toggle) that start scattered off their slot
 * and animate into a coherent little interface. See
 * lib/animations/uiAssemblyAnimation.js for the choreography.
 */
export default function UIComponentsVisual() {
  return (
    <div className="story-ui pointer-events-none absolute inset-0 opacity-0">
      <div className="story-ui-item story-ui-nav absolute left-3 top-3 h-3 w-16 rounded bg-white/15" />
      <div className="story-ui-item story-ui-card absolute left-4 top-9 h-14 w-20 rounded-lg border border-white/10 bg-white/[0.06]" />
      <div className="story-ui-item story-ui-chart absolute right-4 top-9 h-14 w-16 rounded-lg border border-white/10 bg-white/[0.06]" />
      <div className="story-ui-item story-ui-input absolute bottom-14 left-4 h-5 w-24 rounded border border-white/15 bg-white/[0.03]" />
      <div className="story-ui-item story-ui-toggle absolute bottom-14 right-4 h-3.5 w-7 rounded-full bg-white/15" />
      <div className="story-ui-item story-ui-button absolute bottom-5 left-1/2 h-5 w-16 -translate-x-1/2 rounded-full bg-white text-center text-[9px] font-medium leading-5 text-black">
        Start
      </div>
    </div>
  );
}
