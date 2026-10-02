/**
 * Technology categories the studio actually intends to build with.
 * Grouped rather than a logo wall — add/remove items here as the stack
 * changes.
 */
const CATEGORIES = [
  { label: "Frontend", items: ["React", "Next.js", "JavaScript"] },
  { label: "Backend", items: ["Node.js", "PostgreSQL"] },
  { label: "Mobile", items: ["Flutter"] },
  { label: "Infrastructure", items: ["Git", "Cloud platforms"] },
];

export default function Technology() {
  return (
    <section id="technology" className="relative border-t border-white/5 bg-ink px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-white/50">Technology</p>
        <h2 className="mt-3 text-center text-3xl text-white sm:text-4xl">
          Built with modern technology.
        </h2>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {CATEGORIES.map((category) => (
            <div key={category.label}>
              <p className="text-xs uppercase tracking-wide text-white/50">{category.label}</p>
              <ul className="mt-3 flex flex-col gap-1.5 text-sm text-white/60">
                {category.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
