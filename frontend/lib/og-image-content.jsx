/**
 * Shared visual for the generated social-preview image (see
 * app/opengraph-image.jsx and app/twitter-image.jsx). Rendered by Next's
 * built-in `next/og` ImageResponse — plain flexbox/inline-style JSX only
 * (that renderer doesn't support arbitrary CSS), and deliberately just the
 * real brand name and tagline. No client logos, numbers, or claims.
 */
export function OgImageContent() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0a0a0a",
        color: "#f5f5f3",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 72,
          height: 72,
          borderRadius: 9999,
          border: "1.5px solid rgba(245,245,243,0.35)",
          marginBottom: 36,
        }}
      >
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: 9999,
            backgroundColor: "#e3b168",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          fontSize: 72,
          fontWeight: 600,
          letterSpacing: -2,
        }}
      >
        AKIVRO.dev
      </div>

      <div
        style={{
          display: "flex",
          marginTop: 20,
          fontSize: 30,
          color: "rgba(245,245,243,0.55)",
          letterSpacing: 2,
          textTransform: "uppercase",
        }}
      >
        Software Development Studio
      </div>
    </div>
  );
}
