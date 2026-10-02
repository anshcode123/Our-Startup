/** @type {import('tailwindcss').Config} */

// Lets `accent` support Tailwind's opacity modifiers (`bg-accent/30`,
// `text-accent/10`, etc). A plain `var(--color-accent)` string can't be
// decomposed into R/G/B channels for that, so this reads the
// space-separated channel variable instead and builds `rgb(r g b / a)`.
// See the --color-accent-rgb comment in app/globals.css.
function withOpacity(variableName) {
  return ({ opacityValue }) =>
    opacityValue === undefined
      ? `rgb(var(${variableName}))`
      : `rgb(var(${variableName}) / ${opacityValue})`;
}

module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        // Backed by CSS custom properties (see app/globals.css :root) so
        // the whole palette — including the single accent color — can be
        // retuned from one place without touching component markup.
        ink: "var(--color-bg)",
        paper: "var(--color-text)",
        line: "var(--color-border)",
        muted: "var(--color-muted)",
        accent: withOpacity("--color-accent-rgb"),
      },
      letterSpacing: {
        tightest: "-0.02em",
      },
    },
  },
  plugins: [],
};
