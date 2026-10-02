import { SITE_URL } from "@/lib/siteConfig";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/products", "/products/*"],
        disallow: [
          "/admin",
          "/admin/*",
          "/api",
          "/api/*",
          "/demo",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}