import ProjectCard from "./ProjectCard";

/**
 * Add real projects here as they become available:
 *   { name, category, description, tech: [...], href }
 * Left empty on purpose — see the placeholder state below. Do not add
 * placeholder/fake entries here; that's what `placeholder` mode is for.
 */
const PROJECTS = [];

export default function Work() {
  const hasProjects = PROJECTS.length > 0;

  return (
    <section id="work" className="relative border-t border-white/5 bg-ink px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-xl">
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">Work</p>
          <h2 className="mt-3 text-4xl text-white sm:text-5xl">Selected work.</h2>
          <p className="mt-4 text-white/50">
            A selection of digital experiences we&apos;ve designed and built.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hasProjects
            ? PROJECTS.map((project) => <ProjectCard key={project.name} {...project} />)
            : Array.from({ length: 3 }).map((_, i) => <ProjectCard key={i} placeholder />)}
        </div>

        {!hasProjects && (
          <p className="mt-8 text-sm text-white/30">
            Selected projects are being prepared for this page and will appear here soon.
          </p>
        )}
      </div>
    </section>
  );
}
