/**
 * Section 04 — Code. A small, clean code panel (not a full-screen fake
 * terminal) that reveals its lines top to bottom as the user scrolls, with
 * a subtly blinking caret on the last line.
 */
const CODE_LINES = [
  "<section>",
  "  <h1>Build Something</h1>",
  "  <button>Start</button>",
  "</section>",
];

export default function CodeVisual() {
  return (
    <div className="story-code pointer-events-none absolute inset-0 flex items-center justify-center px-4 opacity-0">
      <div className="w-full max-w-[280px] rounded-lg border border-white/10 bg-black/70 p-3 font-mono text-[10px] leading-relaxed text-white/70 backdrop-blur-sm sm:max-w-xs sm:text-xs">
        {CODE_LINES.map((line, i) => (
          <div key={line} className="story-code-line opacity-0">
            {line}
            {i === CODE_LINES.length - 1 && (
              <span className="story-code-caret ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 bg-white/70 align-middle" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
