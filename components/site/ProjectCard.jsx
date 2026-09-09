/**
 * Renders one project. Pass real project data once it exists; until then,
 * <Work> uses `placeholder` mode so the card system is visible without
 * claiming any project, client, or result that doesn't exist yet.
 */
export default function ProjectCard({
  name,
  category,
  description,
  tech = [],
  href,
  placeholder = false,
}) {
  const card = (
    <div
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border p-6 transition-all duration-300 ${
        placeholder
          ? "border-dashed border-white/10 bg-white/[0.01]"
          : "border-white/10 bg-white/[0.02] hover:-translate-y-1 hover:border-white/20"
      }`}
    >
      <div
        aria-hidden="true"
        className="mb-6 aspect-video w-full rounded-lg border border-white/5 bg-gradient-to-br from-white/[0.06] to-transparent"
      />

      <p className="text-xs uppercase tracking-wide text-white/30">
        {placeholder ? "Category" : category}
      </p>
      <h3 className="mt-2 text-lg text-white/90">{placeholder ? "Project name" : name}</h3>
      <p className="mt-2 flex-1 text-sm text-white/50">
        {placeholder ? "Case study coming soon." : description}
      </p>

      {!placeholder && tech.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {tech.map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/10 px-2.5 py-0.5 text-xs text-white/40"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <span className="mt-5 inline-flex items-center gap-1.5 text-sm text-white/60 group-hover:text-white">
        {placeholder ? "Coming soon" : "View project"}
        {!placeholder && (
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        )}
      </span>
    </div>
  );

  if (placeholder || !href) {
    return <div aria-hidden={placeholder}>{card}</div>;
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full">
      {card}
    </a>
  );
}
