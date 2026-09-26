import prisma from "@/server/lib/prisma";

const PUBLIC_PRODUCT_SELECT = {
  id: true,
  name: true,
  slug: true,
  shortDescription: true,
  description: true,
  category: true,
  logoUrl: true,
  coverImage: true,
  galleryImages: true,
  technologies: true,
  features: true,
  liveUrl: true,
  githubUrl: true,
  status: true,
  featured: true,
  createdAt: true,
  updatedAt: true,
};

export async function getPublishedProducts({
  featuredOnly = false,
  limit,
} = {}) {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  try {
    const where = {
      status: "PUBLISHED",
      ...(featuredOnly ? { featured: true } : {}),
    };

    const products = await prisma.product.findMany({
      where,
      select: PUBLIC_PRODUCT_SELECT,
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      ...(typeof limit === "number" && limit > 0 ? { take: limit } : {}),
    });

    return products;
  } catch {
    return [];
  }
}

export async function getPublishedProductBySlug(slug) {
  if (!slug || !process.env.DATABASE_URL) {
    return null;
  }

  try {
    const normalizedSlug = String(slug).trim().toLowerCase();
    const product = await prisma.product.findUnique({
      where: { slug: normalizedSlug },
      select: PUBLIC_PRODUCT_SELECT,
    });

    if (!product || product.status !== "PUBLISHED") {
      return null;
    }

    return product;
  } catch {
    return null;
  }
}
