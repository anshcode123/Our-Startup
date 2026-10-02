"use client";

import { useCallback, useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import ProductForm from "@/components/admin/ProductForm";
import ProductTable from "@/components/admin/ProductTable";
import ThemeToggle from "@/components/admin/ThemeToggle";

function DashboardContent({ user }) {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    featured: 0,
  });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [editorMode, setEditorMode] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [feedbackBanner, setFeedbackBanner] = useState("");

  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAdminProducts = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await fetch("/api/products?scope=admin", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setLoadError(data.error || "Failed to load products.");
        return;
      }

      const loadedProducts = Array.isArray(data.products) ? data.products : [];
      setProducts(loadedProducts);
      setStats(
        data.stats || {
          total: loadedProducts.length,
          published: loadedProducts.filter((p) => p.status === "PUBLISHED")
            .length,
          draft: loadedProducts.filter((p) => p.status === "DRAFT").length,
          featured: loadedProducts.filter((p) => p.featured).length,
        }
      );
    } catch {
      setLoadError("Network error while loading products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminProducts();
  }, [fetchAdminProducts]);

  function showFeedback(message) {
    setFeedbackBanner(message);
    setTimeout(() => {
      setFeedbackBanner((prev) => (prev === message ? "" : prev));
    }, 4500);
  }

  function handleOpenCreate() {
    setFormError("");
    setEditorMode("create");
  }

  function handleOpenEdit(product) {
    setFormError("");
    setEditorMode(product);
  }

  function handleCloseEditor() {
    if (saving) return;
    setFormError("");
    setEditorMode(null);
  }

  async function handleSaveProduct(payload) {
    if (saving) return;
    setSaving(true);
    setFormError("");

    const isEditing = editorMode && typeof editorMode === "object" && editorMode.id;
    const url = isEditing
      ? `/api/products/${editorMode.id}`
      : "/api/products";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setFormError(data.error || "Failed to save product.");
        setSaving(false);
        return;
      }

      setEditorMode(null);
      showFeedback(
        isEditing
          ? `Updated "${data.product?.name || payload.name}".`
          : `Created "${data.product?.name || payload.name}".`
      );
      await fetchAdminProducts();
    } catch {
      setFormError("Network error while saving product.");
    } finally {
      setSaving(false);
    }
  }

  async function handleTogglePublish(product) {
    if (!product?.id || actionLoadingId) return;
    setActionLoadingId(product.id);
    setLoadError("");

    const isPublished = product.status === "PUBLISHED";
    const endpoint = isPublished
      ? `/api/products/${product.id}/unpublish`
      : `/api/products/${product.id}/publish`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setLoadError(data.error || "Failed to update product status.");
        return;
      }

      showFeedback(
        isPublished
          ? `"${product.name}" moved to Draft.`
          : `"${product.name}" is now Published.`
      );
      await fetchAdminProducts();
    } catch {
      setLoadError("Network error while updating status.");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleConfirmDelete() {
    if (!productToDelete?.id || deleting) return;
    setDeleting(true);
    setActionLoadingId(productToDelete.id);
    setLoadError("");

    try {
      const res = await fetch(`/api/products/${productToDelete.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setLoadError(data.error || "Failed to delete product.");
        return;
      }

      const deletedName = productToDelete.name;
      setProductToDelete(null);
      if (
        editorMode &&
        typeof editorMode === "object" &&
        editorMode.id === productToDelete.id
      ) {
        setEditorMode(null);
      }
      showFeedback(`Deleted "${deletedName}".`);
      await fetchAdminProducts();
    } catch {
      setLoadError("Network error while deleting product.");
    } finally {
      setDeleting(false);
      setActionLoadingId(null);
    }
  }

  const filteredProducts = products.filter((product) => {
    if (statusFilter === "PUBLISHED") return product.status === "PUBLISHED";
    if (statusFilter === "DRAFT") return product.status === "DRAFT";
    if (statusFilter === "FEATURED") return Boolean(product.featured);
    return true;
  });

  const statCards = [
    { label: "Total Products", value: stats.total },
    { label: "Published Products", value: stats.published },
    { label: "Draft Products", value: stats.draft },
    { label: "Featured Products", value: stats.featured },
  ];

  return (
    <AdminLayout user={user}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">
            Overview
          </p>
          <h1 className="mt-1 text-3xl font-medium text-white">
            Product Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle showLabel className="hidden sm:inline-flex" />
          {!editorMode && (
            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-medium text-black transition-colors hover:bg-accent"
            >
              + Add Product
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
          >
            <p className="text-xs text-white/50">{card.label}</p>
            <p className="mt-2 text-3xl font-medium tabular-nums text-white">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {feedbackBanner && (
        <div
          role="status"
          className="mt-6 flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-200"
        >
          <span>{feedbackBanner}</span>
          <button
            type="button"
            onClick={() => setFeedbackBanner("")}
            className="text-emerald-200/70 hover:text-white"
          >
            Î“Â£Ã²
          </button>
        </div>
      )}

      {loadError && (
        <div
          role="alert"
          className="mt-6 flex items-center justify-between rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-200"
        >
          <span>{loadError}</span>
          <button
            type="button"
            onClick={fetchAdminProducts}
            className="underline hover:text-white"
          >
            Retry
          </button>
        </div>
      )}

      {editorMode && (
        <div className="mt-8">
          <ProductForm
            initialProduct={editorMode === "create" ? null : editorMode}
            onSave={handleSaveProduct}
            onCancel={handleCloseEditor}
            saving={saving}
            serverError={formError}
          />
        </div>
      )}

      <section className="mt-10">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-medium text-white">Products</h2>
            <div className="flex flex-wrap items-center gap-1 rounded-full border border-white/10 bg-white/[0.02] p-1">
              {[
                { key: "ALL", label: "All" },
                { key: "PUBLISHED", label: "Published" },
                { key: "DRAFT", label: "Drafts" },
                { key: "FEATURED", label: "Featured" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setStatusFilter(tab.key)}
                  className={`rounded-full px-3 py-1 text-xs transition-colors ${
                    statusFilter === tab.key
                      ? "bg-white text-black font-medium"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {editorMode && (
            <button
              type="button"
              onClick={handleOpenCreate}
              className="rounded-full border border-white/20 px-4 py-1.5 text-xs text-white hover:bg-white/10"
            >
              + New Product
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] py-16">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-accent" />
            <p className="mt-3 text-xs text-white/50">Loading products...</p>
          </div>
        ) : (
          <ProductTable
            products={filteredProducts}
            onEdit={handleOpenEdit}
            onTogglePublish={handleTogglePublish}
            onRequestDelete={(product) => setProductToDelete(product)}
            actionLoadingId={actionLoadingId}
          />
        )}
      </section>

      {productToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#111111] p-6 shadow-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-red-400">
              Confirm Deletion
            </p>
            <h3
              id="delete-modal-title"
              className="mt-2 text-xl font-medium text-white"
            >
              Delete &ldquo;{productToDelete.name}&rdquo;?
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-white/60">
              This action is permanent and will immediately remove this product
              from the database and public website.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setProductToDelete(null)}
                className="rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-white/70 transition-colors hover:border-white/30 hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="rounded-full bg-red-500 px-5 py-2 text-xs font-medium text-white transition-colors hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute>
      {(user) => <DashboardContent user={user} />}
    </ProtectedRoute>
  );
}
