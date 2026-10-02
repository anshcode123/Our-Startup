import { SITE_URL } from "@/lib/siteConfig";
import { getPublishedProducts } from "@/lib/products";

/**
 * Generates /sitemap.xml. Includes the homepage, /products, and dynamic
 * /products/[slug] pages for PUBLISHED products only. Unpublished/draft
 * products and /admin or /demo routes are never exposed to search engines.
 */
export default async function sitemap() {
  const publishedProducts = await getPublishedProducts();

  const productEntries = publishedProducts.map((product) => ({
    url: `${SITE_URL}/products/${product.slug}`,
    lastModified: product.updatedAt || new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...productEntries,
  ];
}
