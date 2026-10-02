import Image from "next/image";

/**
 * Renders one project. Pass real project data (see lib/content/projects.js
 * for the shape) once it exists; until then, <Work> renders this in
 * `placeholder` mode so the card system is visible without claiming any
 * project, client, or result that doesn't exist yet.
 *
 * `image` is optional — when a real project has no screenshot yet, the
 * card falls back to the same CSS/gradient placeholder visual rather than
 * a broken or missing image.
 */
export default function ProjectCard({
  title,
  category,
  description,
  image,
  technologies = [],
  link,
  placeholder = false,
}) {
  const hasLink = Boolean(link) && !placeholder;

  const card = (
    <div
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border p-6 transition-all duration-300 ${
        placeholder
          ? "border-dashed border-white/10 bg-white/[0.01]"
          : "border-white/10 bg-white/[0.02] hover:-translate-y-1 hover:border-white/20"
      }`}
    >
      <div
        aria-hidden={!image}
        className="relative mb-6 aspect-video w-full overflow-hidden rounded-lg border border-white/5"
      >
        {image ? (
          <Image
            src={image}
            alt={placeholder ? "" : `${title} — ${category}`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="device-reflection h-full w-full bg-gradient-to-br from-white/[0.06] to-transparent transition-transform duration-500 group-hover:scale-105" />
        )}
      </div>

      <p className="text-xs uppercase tracking-wide text-white/50">
        {placeholder ? "Category" : category}
      </p>
      <h3 className="mt-2 text-lg text-white/90">{placeholder ? "Project name" : title}</h3>
      <p className="mt-2 flex-1 text-sm text-white/50">
        {placeholder ? "Case study coming soon." : description}
      </p>

      {!placeholder && technologies.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {technologies.map((tech) => (
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
        {placeholder ? "Coming soon" : hasLink ? "View project" : "Case study"}
        {hasLink && (
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        )}
      </span>
    </div>
  );

  if (!hasLink) {
    return <div aria-hidden={placeholder}>{card}</div>;
  }

  return (
    <a href={link} target="_blank" rel="noopener noreferrer" className="block h-full">
      {card}
    </a>
  );
}
