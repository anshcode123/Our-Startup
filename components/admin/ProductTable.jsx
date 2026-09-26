"use client";

import Link from "next/link";
import ProductCard from "./ProductCard";

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

export default function ProductTable({
  products = [],
  onEdit,
  onTogglePublish,
  onRequestDelete,
  actionLoadingId,
}) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.01] px-6 py-14 text-center">
        <p className="text-base text-white/80">No products found.</p>
        <p className="mt-1.5 text-xs text-white/50">
          Click &ldquo;+ Add Product&rdquo; above to create your first product.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:hidden">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={onEdit}
            onTogglePublish={onTogglePublish}
            onRequestDelete={onRequestDelete}
            actionLoadingId={actionLoadingId}
          />
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] md:block">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-xs uppercase tracking-wider text-white/50">
                <th className="px-5 py-3.5 font-medium">Product</th>
                <th className="px-4 py-3.5 font-medium">Category</th>
                <th className="px-4 py-3.5 font-medium">Status</th>
                <th className="px-4 py-3.5 font-medium">Featured</th>
                <th className="px-4 py-3.5 font-medium">Updated</th>
                <th className="px-5 py-3.5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {products.map((product) => {
                const isPublished = product.status === "PUBLISHED";
                const isBusy = actionLoadingId === product.id;
                const thumbUrl = product.logoUrl || product.coverImage || "";

                return (
                  <tr
                    key={product.id}
                    className="transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
                          {thumbUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={thumbUrl}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-medium uppercase text-white/60">
                              {product.name?.slice(0, 2) || "PR"}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="truncate font-medium text-white">
                              {product.name}
                            </p>
                            {isPublished && (
                              <Link
                                href={`/products/${product.slug}`}
                                className="text-xs text-white/50 hover:text-accent"
                                title="View public product page"
                              >
                                ↗
                              </Link>
                            )}
                          </div>
                          <p className="truncate text-xs text-white/50">
                            /{product.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-xs text-white/70">
                      {product.category}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          isPublished
                            ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                            : "border border-white/15 bg-white/5 text-white/60"
                        }`}
                      >
                        {isPublished ? "Published" : "Draft"}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      {product.featured ? (
                        <span className="inline-flex items-center rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                          Featured
                        </span>
                      ) : (
                        <span className="text-xs text-white/40">Off</span>
                      )}
                    </td>

                    <td className="px-4 py-4 text-xs tabular-nums text-white/50">
                      {formatShortDate(product.updatedAt)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => onEdit?.(product)}
                          className="rounded-lg border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => onTogglePublish?.(product)}
                          className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                            isPublished
                              ? "border-amber-500/30 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20"
                              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20"
                          }`}
                        >
                          {isBusy
                            ? "..."
                            : isPublished
                              ? "Unpublish"
                              : "Publish"}
                        </button>

                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => onRequestDelete?.(product)}
                          className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-300 transition-colors hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
