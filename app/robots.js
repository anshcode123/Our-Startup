import { SITE_URL } from "@/lib/siteConfig";

/**
 * Generates /robots.txt. The site is otherwise fully public — the only
 * exclusion is /demo, the Phase 1 scroll-engine regression page, which
 * exists for development reference rather than as real site content.
 */
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/demo", "/admin", "/api"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
