/**
 * Section 10 — Connection / process. A recap of a pipeline as a vertical
 * line that draws itself (via stroke-dashoffset) while each stage label
 * lights up in turn. `stages` is a plain array of labels so this same
 * component/animation pair can be reused for the Process section with its
 * own six labels — see components/site/Process.jsx.
 */
const DEFAULT_STAGES = ["Idea", "Design", "Code", "Build", "Test", "Launch"];

export default function ConnectionVisual({ stages = DEFAULT_STAGES }) {
  return (
    <div className="story-connection pointer-events-none absolute inset-0 flex items-center justify-center opacity-0">
      <div className="relative flex flex-col items-center gap-7">
        <svg
          className="absolute left-1/2 h-full w-1.5 -translate-x-1/2"
          preserveAspectRatio="none"
          viewBox="0 0 2 100"
        >
          <line
            x1="1"
            y1="0"
            x2="1"
            y2="100"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="2"
          />
          <line
            className="story-connection-line"
            x1="1"
            y1="0"
            x2="1"
            y2="100"
            stroke="var(--color-accent)"
            strokeWidth="2"
            strokeDasharray="100"
            strokeDashoffset="100"
          />
        </svg>
        {stages.map((stage) => (
          <div
            key={stage}
            className="story-connection-node relative flex flex-col items-center gap-2 opacity-30"
          >
            <span className="story-connection-dot h-2.5 w-2.5 rounded-full bg-accent/60" />
            <span className="text-xs text-white/50">{stage}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
