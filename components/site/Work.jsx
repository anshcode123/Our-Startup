import ProjectCard from "./ProjectCard";
import { PROJECTS } from "@/lib/content/projects";

/**
 * Presentation only — the actual project data lives in
 * lib/content/projects.js (currently empty; see that file for the exact
 * shape to add real projects in). This keeps content, presentation, and
 * asset paths separate and easy to update independently.
 */
export default function Work() {
  const hasProjects = PROJECTS.length > 0;

  return (
    <section id="work" className="relative border-t border-white/5 bg-ink px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-xl">
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">Work</p>
          <h2 className="mt-3 text-4xl text-white sm:text-5xl">Selected work.</h2>
          <p className="mt-4 text-white/50">
            A selection of digital experiences we&apos;ve designed and built.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hasProjects
            ? PROJECTS.map((project) => <ProjectCard key={project.id} {...project} />)
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
