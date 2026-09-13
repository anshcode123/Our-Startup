import Link from "next/link";

export const metadata = {
  title: "Page not found",
};

/**
 * Next's not-found file convention — renders for any unmatched route.
 * Deliberately minimal and reusing the site's existing look (dark
 * background, same pill-button CTA style as the rest of the site)
 * rather than a new design.
 */
export default function NotFound() {
  return (
    <main className="bg-grid flex min-h-screen flex-col items-center justify-center gap-6 bg-ink px-6 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-white/50">404</p>
      <h1 className="max-w-md text-3xl text-white sm:text-4xl">Page not found.</h1>
      <p className="max-w-sm text-white/50">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-transform hover:-translate-y-0.5"
      >
        Back to home
        <span aria-hidden="true">→</span>
      </Link>
    </main>
  );
}
