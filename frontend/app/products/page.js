import Image from "next/image";
import Link from "next/link";
import Logo from "@/components/site/Logo";
import Footer from "@/components/site/Footer";
import { getPublishedProducts } from "@/lib/products";
import { SITE_URL } from "@/lib/siteConfig";

export const dynamic = "force-dynamic";

export const metadata = {
  title: {
    absolute: "Products — Anshul.dev",
  },
  description:
    "Explore digital products, web applications, mobile apps, custom software, and SaaS platforms built by Anshul.dev.",
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "Products — Anshul.dev",
    description:
      "Explore digital products, web applications, mobile apps, custom software, and SaaS platforms built by Anshul.dev.",
    url: `${SITE_URL}/products`,
    type: "website",
    siteName: "Anshul.dev",
  },
  twitter: {
    card: "summary_large_image",
    title: "Products — Anshul.dev",
    description:
      "Explore digital products, web applications, mobile apps, custom software, and SaaS platforms built by Anshul.dev.",
  },
};

function ProductImage({ src, alt, className = "" }) {
  if (!src) {
    return (
      <div className="device-reflection h-full w-full bg-gradient-to-br from-white/[0.06] to-transparent transition-transform duration-500 group-hover:scale-105" />
    );
  }

  const isNextOptimizable =
    src.startsWith("/") || src.includes("cloudinary.com");

  if (isNextOptimizable) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className={`object-cover transition-transform duration-500 group-hover:scale-105 ${className}`}
      />
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${className}`}
    />
  );
}

export default async function ProductsPage() {
  const products = await getPublishedProducts();

  return (
    <div className="flex min-h-screen flex-col bg-ink text-paper">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/85 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" aria-label="Anshul.dev Î“Ã‡Ã¶ home">
            <Logo className="text-sm" />
          </Link>

          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/"
              className="link-underline text-white/60 transition-colors hover:text-white"
            >
              Î“Ã¥Ã‰ Back to home
            </Link>
            <Link
              href="/#contact"
              className="hidden items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 text-sm text-white transition-colors hover:bg-white hover:text-black sm:inline-flex"
            >
              Let&apos;s Talk Î“Ã¥Ã†
            </Link>
          </div>
        </nav>
      </header>

      <main className="bg-grid relative flex-1 px-6 py-20 sm:py-28">
        <div className="bg-accent-glow pointer-events-none absolute inset-0" />

        <div className="relative mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">
              Products
            </p>
            <h1 className="mt-3 text-4xl text-white sm:text-5xl">
              Our Products.
            </h1>
            <p className="mt-4 text-base text-white/50">
              Software, web platforms, and digital products designed and built
              in-house.
            </p>
          </div>

          {products.length === 0 ? (
            <div className="mt-16 rounded-2xl border border-dashed border-white/10 bg-white/[0.01] px-6 py-20 text-center">
              <p className="text-base text-white/70">
                No published products yet.
              </p>
              <p className="mt-2 text-sm text-white/50">
                Products will appear here automatically once published.
              </p>
            </div>
          ) : (
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => {
                const previewImage = product.coverImage || product.logoUrl;

                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
                  >
                    <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-lg border border-white/5 bg-black/40">
                      <ProductImage
                        src={previewImage}
                        alt={`${product.name} Î“Ã‡Ã¶ ${product.category}`}
                      />
                      {product.featured && (
                        <span className="absolute right-3 top-3 rounded-full border border-accent/40 bg-black/75 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent backdrop-blur-sm">
                          Featured
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {product.logoUrl && product.coverImage && (
                        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={product.logoUrl}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="text-xs uppercase tracking-wide text-white/50">
                          {product.category}
                        </p>
                        <h2 className="mt-1 text-lg text-white/90">
                          {product.name}
                        </h2>
                      </div>
                    </div>

                    <p className="mt-3 flex-1 text-sm text-white/50">
                      {product.shortDescription}
                    </p>

                    {Array.isArray(product.technologies) &&
                      product.technologies.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {product.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="rounded-full border border-white/10 px-2.5 py-0.5 text-xs text-white/50"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}

                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm text-white/60 group-hover:text-white">
                      View Product
                      <span
                        aria-hidden="true"
                        className="transition-transform group-hover:translate-x-0.5"
                      >
                        Î“Ã¥Ã†
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
