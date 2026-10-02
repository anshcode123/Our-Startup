import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Logo from "@/components/site/Logo";
import Footer from "@/components/site/Footer";
import { getPublishedProductBySlug } from "@/lib/products";
import { SITE_URL } from "@/lib/siteConfig";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const product = await getPublishedProductBySlug(params?.slug);

  if (!product) {
    return {
      title: {
        absolute: "Product Not Found — Anshul.dev",
      },
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = product.seoTitle?.trim() || `${product.name} — Anshul.dev`;
  const description =
    product.seoDescription?.trim() ||
    product.shortDescription ||
    (product.description ? product.description.slice(0, 160) : "") ||
    "Anshul.dev product";
  const canonicalUrl = `${SITE_URL}/products/${product.slug}`;
  const ogImage =
    product.ogImage ||
    product.coverImage ||
    product.logoUrl ||
    `${SITE_URL}/opengraph-image`;

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: ogImage,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

function SmartImage({ src, alt, priority = false, sizes = "100vw" }) {
  const isNextOptimizable =
    src.startsWith("/") || src.includes("cloudinary.com");

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      unoptimized={!isNextOptimizable}
      className="object-cover"
    />
  );
}

export default async function ProductDetailPage({ params }) {
  const product = await getPublishedProductBySlug(params?.slug);

  if (!product) {
    notFound();
  }

  const hasDescription =
    typeof product.description === "string" &&
    product.description.trim().length > 0;
  const hasFeatures =
    Array.isArray(product.features) && product.features.length > 0;
  const hasTechnologies =
    Array.isArray(product.technologies) && product.technologies.length > 0;
  const hasGallery =
    Array.isArray(product.galleryImages) && product.galleryImages.length > 0;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    description:
      product.seoDescription?.trim() ||
      product.shortDescription ||
      product.description ||
      "",
    url: `${SITE_URL}/products/${product.slug}`,
    ...(product.ogImage || product.coverImage || product.logoUrl
      ? {
          image: [
            product.ogImage || product.coverImage || product.logoUrl,
          ],
        }
      : {}),
    ...(product.category ? { applicationCategory: product.category } : {}),
    ...(product.liveUrl ? { installUrl: product.liveUrl } : {}),
  };

  return (
    <div className="flex min-h-screen flex-col bg-ink text-paper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/85 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" aria-label="Anshul.dev — home">
            <Logo className="text-sm" />
          </Link>

          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/products"
              className="link-underline text-white/60 transition-colors hover:text-white"
            >
              ← All Products
            </Link>
            <Link
              href="/#contact"
              className="hidden items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 text-sm text-white transition-colors hover:bg-white hover:text-black sm:inline-flex"
            >
              Let&apos;s Talk →
            </Link>
          </div>
        </nav>
      </header>

      <main className="bg-grid relative flex-1 px-6 py-16 sm:py-24">
        <div className="bg-accent-glow pointer-events-none absolute inset-0" />

        <article className="relative mx-auto max-w-5xl">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-5">
              {product.logoUrl && (
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-white/[0.03] sm:h-20 sm:w-20">
                  <SmartImage
                    src={product.logoUrl}
                    alt={`${product.name} logo`}
                    priority
                    sizes="80px"
                  />
                </div>
              )}

              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-xs uppercase tracking-[0.2em] text-accent">
                    {product.category}
                  </span>
                  {product.featured && (
                    <span className="rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent">
                      Featured
                    </span>
                  )}
                </div>

                <h1 className="mt-2 text-3xl text-white sm:text-5xl">
                  {product.name}
                </h1>

                {product.shortDescription && (
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
                    {product.shortDescription}
                  </p>
                )}
              </div>
            </div>

            {(product.liveUrl || product.githubUrl) && (
              <div className="flex flex-wrap items-center gap-3 sm:shrink-0">
                {product.liveUrl && (
                  <a
                    href={product.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-accent"
                  >
                    Live Demo
                    <span aria-hidden="true">↗</span>
                  </a>
                )}

                {product.githubUrl && (
                  <a
                    href={product.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.03] px-5 py-2.5 text-sm text-white transition-colors hover:border-white/40 hover:bg-white/10"
                  >
                    GitHub
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {product.coverImage && (
            <div className="relative mt-12 aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black/50">
              <SmartImage
                src={product.coverImage}
                alt={`${product.name} cover preview`}
                priority
                sizes="(min-width: 1024px) 1024px, 100vw"
              />
            </div>
          )}

          {(hasDescription || hasFeatures || hasTechnologies) && (
            <div className="mt-14 grid gap-10 lg:grid-cols-3">
              {(hasDescription || hasFeatures) && (
                <div className="space-y-10 lg:col-span-2">
                  {hasDescription && (
                    <section>
                      <h2 className="text-xs uppercase tracking-[0.2em] text-white/50">
                        Overview
                      </h2>
                      <div className="mt-4 whitespace-pre-line text-base leading-relaxed text-white/70">
                        {product.description}
                      </div>
                    </section>
                  )}

                  {hasFeatures && (
                    <section>
                      <h2 className="text-xs uppercase tracking-[0.2em] text-white/50">
                        Key Features
                      </h2>
                      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                        {product.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-white/80"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-0.5 text-accent"
                            >
                              ✦
                            </span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </div>
              )}

              {hasTechnologies && (
                <aside className="h-fit rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                  <h2 className="text-xs uppercase tracking-[0.2em] text-white/50">
                    Technologies
                  </h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {product.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-white/15 bg-white/[0.03] px-3 py-1 text-xs text-white/80"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </aside>
              )}
            </div>
          )}

          {hasGallery && (
            <section className="mt-16">
              <h2 className="text-xs uppercase tracking-[0.2em] text-white/50">
                Screenshots
              </h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {product.galleryImages.map((imgUrl, index) => (
                  <div
                    key={`${imgUrl}-${index}`}
                    className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black/50"
                  >
                    <SmartImage
                      src={imgUrl}
                      alt={`${product.name} screenshot ${index + 1}`}
                      sizes="(min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
}

