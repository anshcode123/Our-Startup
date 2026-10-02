import { SITE_URL } from "@/lib/siteConfig";

/**
 * Generates /sitemap.xml. Only one real public page exists on this
 * marketing site — the homepage, which contains every section (Services,
 * Work, Process, About, Contact, etc. are anchors within it, not separate
 * routes). /demo is intentionally left out — see app/robots.js.
 */
export default function sitemap() {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
