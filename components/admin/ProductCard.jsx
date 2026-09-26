"use client";

import Link from "next/link";

function formatShortDate(dateValue) {
  if (!dateValue) return "—";
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateValue));
  } catch {
    return "—";
  }
}

export default function ProductCard({
  product,
  onEdit,
  onTogglePublish,
  onRequestDelete,
  actionLoadingId,
}) {
  if (!product) return null;

  const isPublished = product.status === "PUBLISHED";
  const isBusy = actionLoadingId === product.id;
  const thumbUrl = product.logoUrl || product.coverImage || "";

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
              {thumbUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={thumbUrl}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-sm font-medium uppercase text-white/60">
                  {product.name?.slice(0, 2) || "PR"}
                </span>
              )}
            </div>

            <div>
              <h3 className="text-base font-medium text-white">
                {product.name}
              </h3>
              <p className="text-xs text-white/50">{product.category}</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                isPublished
                  ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                  : "border border-white/15 bg-white/5 text-white/60"
              }`}
            >
              {isPublished ? "Published" : "Draft"}
            </span>
            {product.featured && (
              <span className="inline-flex items-center rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
                Featured
              </span>
            )}
          </div>
        </div>

        <p className="mt-3 line-clamp-2 text-xs text-white/60">
          {product.shortDescription}
        </p>

        {Array.isArray(product.technologies) &&
          product.technologies.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {product.technologies.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-white/50"
                >
                  {tech}
                </span>
              ))}
              {product.technologies.length > 4 && (
                <span className="text-[11px] text-white/40">
                  +{product.technologies.length - 4}
                </span>
              )}
            </div>
          )}
      </div>

      <div className="mt-4 border-t border-white/10 pt-3">
        <div className="flex items-center justify-between text-[11px] text-white/50">
          <span>Updated {formatShortDate(product.updatedAt)}</span>
          {isPublished && (
            <Link
              href={`/products/${product.slug}`}
              className="text-accent hover:underline"
            >
              View public page ↗
            </Link>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={isBusy}
            onClick={() => onEdit?.(product)}
            className="flex-1 rounded-lg border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/10 disabled:opacity-50"
          >
            Edit
          </button>

          <button
            type="button"
            disabled={isBusy}
            onClick={() => onTogglePublish?.(product)}
            className={`flex-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
              isPublished
                ? "border-amber-500/30 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20"
                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20"
            }`}
          >
            {isBusy
              ? "Updating..."
              : isPublished
                ? "Unpublish"
                : "Publish"}
          </button>

          <button
            type="button"
            disabled={isBusy}
            onClick={() => onRequestDelete?.(product)}
            className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-300 transition-colors hover:bg-red-500/20 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
