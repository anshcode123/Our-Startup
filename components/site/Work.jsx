import Link from "next/link";
import ProjectCard from "./ProjectCard";
import { PROJECTS } from "@/lib/content/projects";
import { getPublishedProducts } from "@/lib/products";

/**
 * Presentation only — the actual project data lives in PostgreSQL (managed via
 * the Phase 8 Product CMS) with fallback to lib/content/projects.js.
 * Only PUBLISHED products are ever shown here, with featured products
 * prioritized first (up to 6 items on the homepage).
 */
export default async function Work() {
  const dbProducts = await getPublishedProducts({ limit: 6 });

  const mappedDbProjects = dbProducts.map((product) => ({
    id: product.id,
    title: product.name,
    slug: product.slug,
    category: product.category,
    description: product.shortDescription,
    image: product.coverImage || product.logoUrl || undefined,
    technologies: Array.isArray(product.technologies)
      ? product.technologies
      : [],
    link: product.liveUrl || undefined,
    featured: Boolean(product.featured),
  }));

  const displayProjects =
    mappedDbProjects.length > 0 ? mappedDbProjects : PROJECTS;
  const hasProjects = displayProjects.length > 0;

  return (
    <section id="work" className="relative border-t border-white/5 bg-ink px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">Work</p>
            <h2 className="mt-3 text-4xl text-white sm:text-5xl">Selected work.</h2>
            <p className="mt-4 text-white/50">
              A selection of digital experiences we&apos;ve designed and built.
            </p>
          </div>

          {hasProjects && (
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-5 py-2.5 text-sm text-white transition-colors hover:border-white/40"
            >
              View all products
              <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hasProjects
            ? displayProjects.map((project) => (
                <ProjectCard key={project.id} {...project} />
              ))
            : Array.from({ length: 3 }).map((_, i) => <ProjectCard key={i} placeholder />)}
        </div>

        {!hasProjects && (
          <p className="mt-8 text-sm text-white/50">
            Selected work coming soon — projects will appear here once they&apos;re ready to share.
          </p>
        )}
      </div>
    </section>
  );
}
