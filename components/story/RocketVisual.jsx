/**
 * Section 11 — Launch. A clean, geometric rocket built from SVG paths and
 * gradients — a metaphor for shipping the product, not a cartoon.
 */
export default function RocketVisual() {
  return (
    <div className="story-rocket pointer-events-none absolute inset-0 flex items-center justify-center opacity-0">
      <div className="story-rocket-body relative flex flex-col items-center">
        <svg width="72" height="140" viewBox="0 0 72 140" fill="none">
          <defs>
            <linearGradient id="rocketBody" x1="16" y1="2" x2="56" y2="112" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f5f5f3" />
              <stop offset="1" stopColor="#9a9a97" />
            </linearGradient>
          </defs>
          <path
            d="M36 2C50 22 56 52 56 84C56 96 48 106 36 112C24 106 16 96 16 84C16 52 22 22 36 2Z"
            fill="url(#rocketBody)"
            stroke="rgba(255,255,255,0.25)"
          />
          <path d="M16 84L4 108H18L16 84Z" fill="rgba(255,255,255,0.12)" />
          <path d="M56 84L68 108H54L56 84Z" fill="rgba(255,255,255,0.12)" />
          <circle
            cx="36"
            cy="58"
            r="9"
            fill="rgba(10,10,10,0.55)"
            stroke="rgba(255,255,255,0.3)"
          />
        </svg>
        <div className="story-rocket-flame -mt-1.5 h-10 w-3 rounded-full bg-gradient-to-b from-white/70 to-transparent blur-[2px]" />
      </div>
    </div>
  );
}
