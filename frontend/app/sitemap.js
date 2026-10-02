import { SITE_URL } from "@/lib/siteConfig";
import { getPublishedProducts } from "@/lib/products";

export default async function sitemap() {
  const publishedProducts = await getPublishedProducts();

  const productEntries = publishedProducts.map((product) => ({
    url: `${SITE_URL}/products/${product.slug}`,
    lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
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