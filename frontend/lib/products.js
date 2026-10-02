import { getBackendBaseUrl } from "@/lib/serverAuth";

export async function getPublishedProducts({
  featuredOnly = false,
  limit,
} = {}) {
  try {
    const params = new URLSearchParams();
    if (featuredOnly) {
      params.set("featured", "true");
    }
    if (typeof limit === "number" && limit > 0) {
      params.set("limit", String(limit));
    }

    const queryString = params.toString();
    const url = `${getBackendBaseUrl()}/api/products${
      queryString ? `?${queryString}` : ""
    }`;

    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    const products = Array.isArray(data?.products) ? data.products : [];
    return products.filter((p) => p && p.status === "PUBLISHED");
  } catch {
    return [];
  }
}

export async function getPublishedProductBySlug(slug) {
  if (!slug) return null;

  const normalizedSlug = String(slug).trim().toLowerCase();
  if (!normalizedSlug) return null;

  try {
    const url = `${getBackendBaseUrl()}/api/products/${encodeURIComponent(
      normalizedSlug
    )}`;
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    const product = data?.product || null;

    if (!product || product.status !== "PUBLISHED") {
      return null;
    }

    return product;
  } catch {
    return null;
  }
}