/**
 * Section 04 — Code. A small, clean code panel (not a full-screen fake
 * terminal) that reveals its lines top to bottom as the user scrolls, with
 * a subtly blinking caret on the last line. Line content is fictional
 * example markup only — no real credentials or project code.
 */
const CODE_LINES = [
  {
    text: (
      <>
        <span className="text-white/25">&lt;</span>
        <span className="text-accent">section</span>
        <span className="text-white/25">&gt;</span>
      </>
    ),
  },
  {
    indent: 1,
    text: (
      <>
        <span className="text-white/25">&lt;</span>
        <span className="text-accent">h1</span>
        <span className="text-white/25">&gt;</span>
        <span className="text-white/70">Build Something</span>
        <span className="text-white/25">&lt;/</span>
        <span className="text-accent">h1</span>
        <span className="text-white/25">&gt;</span>
      </>
    ),
  },
  {
    indent: 1,
    text: (
      <>
        <span className="text-white/25">&lt;</span>
        <span className="text-accent">button</span>
        <span className="text-white/25">&gt;</span>
        <span className="text-white/70">Start</span>
        <span className="text-white/25">&lt;/</span>
        <span className="text-accent">button</span>
        <span className="text-white/25">&gt;</span>
      </>
    ),
  },
  {
    text: (
      <>
        <span className="text-white/25">&lt;/</span>
        <span className="text-accent">section</span>
        <span className="text-white/25">&gt;</span>
      </>
    ),
  },
];

export default function CodeVisual() {
  return (
    <div className="story-code pointer-events-none absolute inset-0 flex items-center justify-center px-4 opacity-0">
      <div className="w-full max-w-[300px] overflow-hidden rounded-lg border border-white/10 bg-black/70 backdrop-blur-sm sm:max-w-sm">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
          <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
        </div>
        <div className="flex p-3 font-mono text-[10px] leading-relaxed sm:text-xs">
          <div aria-hidden="true" className="mr-3 flex flex-col items-end text-white/20 select-none">
            {CODE_LINES.map((_, i) => (
              <span key={i}>{i + 1}</span>
            ))}
          </div>
          <div>
            {CODE_LINES.map((line, i) => (
              <div
                key={i}
                className="story-code-line opacity-0"
                style={{ paddingLeft: line.indent ? `${line.indent * 1}em` : 0 }}
              >
                {line.text}
                {i === CODE_LINES.length - 1 && (
                  <span className="story-code-caret ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 bg-accent align-middle" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
