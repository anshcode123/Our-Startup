"use client";

import { useEffect, useState } from "react";
import ImageUploader from "./ImageUploader";

const SUGGESTED_CATEGORIES = [
  "Web App",
  "Mobile App",
  "SaaS",
  "Custom Software",
  "Developer Tool",
  "AI Product",
  "E-commerce",
  "Other",
];

const SUGGESTED_TECHNOLOGIES = [
  "Next.js",
  "React",
  "JavaScript",
  "Node.js",
  "Express",
  "Flutter",
  "PostgreSQL",
  "MongoDB",
  "Prisma",
  "Tailwind CSS",
  "TypeScript",
];

function slugifyClient(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ProductForm({
  initialProduct = null,
  onSave,
  onCancel,
  saving = false,
  serverError = "",
}) {
  const isEditMode = Boolean(initialProduct?.id);

  const [name, setName] = useState(initialProduct?.name || "");
  const [slug, setSlug] = useState(initialProduct?.slug || "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initialProduct?.slug));
  const [category, setCategory] = useState(
    initialProduct?.category || "Web App"
  );
  const [shortDescription, setShortDescription] = useState(
    initialProduct?.shortDescription || ""
  );
  const [description, setDescription] = useState(
    initialProduct?.description || ""
  );
  const [logoUrl, setLogoUrl] = useState(initialProduct?.logoUrl || "");
  const [coverImage, setCoverImage] = useState(
    initialProduct?.coverImage || ""
  );
  const [galleryImages, setGalleryImages] = useState(
    Array.isArray(initialProduct?.galleryImages)
      ? initialProduct.galleryImages
      : []
  );
  const [technologies, setTechnologies] = useState(
    Array.isArray(initialProduct?.technologies)
      ? initialProduct.technologies
      : []
  );
  const [techInput, setTechInput] = useState("");
  const [features, setFeatures] = useState(
    Array.isArray(initialProduct?.features) ? initialProduct.features : []
  );
  const [featureInput, setFeatureInput] = useState("");
  const [liveUrl, setLiveUrl] = useState(initialProduct?.liveUrl || "");
  const [githubUrl, setGithubUrl] = useState(initialProduct?.githubUrl || "");
  const [status, setStatus] = useState(initialProduct?.status || "DRAFT");
  const [featured, setFeatured] = useState(Boolean(initialProduct?.featured));
  const [localError, setLocalError] = useState("");
  const [activeUploads, setActiveUploads] = useState({
    logo: false,
    cover: false,
    gallery: false,
  });

  useEffect(() => {
    setName(initialProduct?.name || "");
    setSlug(initialProduct?.slug || "");
    setSlugTouched(Boolean(initialProduct?.slug));
    setCategory(initialProduct?.category || "Web App");
    setShortDescription(initialProduct?.shortDescription || "");
    setDescription(initialProduct?.description || "");
    setLogoUrl(initialProduct?.logoUrl || "");
    setCoverImage(initialProduct?.coverImage || "");
    setGalleryImages(
      Array.isArray(initialProduct?.galleryImages)
        ? initialProduct.galleryImages
        : []
    );
    setTechnologies(
      Array.isArray(initialProduct?.technologies)
        ? initialProduct.technologies
        : []
    );
    setFeatures(
      Array.isArray(initialProduct?.features) ? initialProduct.features : []
    );
    setLiveUrl(initialProduct?.liveUrl || "");
    setGithubUrl(initialProduct?.githubUrl || "");
    setStatus(initialProduct?.status || "DRAFT");
    setFeatured(Boolean(initialProduct?.featured));
    setLocalError("");
  }, [initialProduct]);

  const isAnyUploading =
    activeUploads.logo || activeUploads.cover || activeUploads.gallery;

  function handleNameChange(event) {
    const nextName = event.target.value;
    setName(nextName);
    if (!slugTouched) {
      setSlug(slugifyClient(nextName));
    }
  }

  function handleSlugChange(event) {
    setSlugTouched(true);
    setSlug(slugifyClient(event.target.value));
  }

  function addTechnology(rawTech) {
    const cleaned = String(rawTech || "").trim();
    if (!cleaned) return;
    const exists = technologies.some(
      (t) => t.toLowerCase() === cleaned.toLowerCase()
    );
    if (!exists) {
      setTechnologies((prev) => [...prev, cleaned]);
    }
    setTechInput("");
  }

  function removeTechnology(techToRemove) {
    setTechnologies((prev) => prev.filter((t) => t !== techToRemove));
  }

  function handleTechKeyDown(event) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTechnology(techInput);
    }
  }

  function addFeature(rawFeature) {
    const cleaned = String(rawFeature || "").trim();
    if (!cleaned) return;
    if (!features.includes(cleaned)) {
      setFeatures((prev) => [...prev, cleaned]);
    }
    setFeatureInput("");
  }

  function removeFeature(featureToRemove) {
    setFeatures((prev) => prev.filter((f) => f !== featureToRemove));
  }

  function handleFeatureKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addFeature(featureInput);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (saving || isAnyUploading) return;

    setLocalError("");

    const trimmedName = name.trim();
    const finalSlug = (slug || slugifyClient(trimmedName)).trim();
    const trimmedCategory = category.trim();
    const trimmedShortDesc = shortDescription.trim();

    if (!trimmedName) {
      setLocalError("Product name is required.");
      return;
    }
    if (!finalSlug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(finalSlug)) {
      setLocalError(
        "A valid URL slug is required (lowercase letters, numbers, and hyphens only)."
      );
      return;
    }
    if (!trimmedCategory) {
      setLocalError("Category is required.");
      return;
    }
    if (!trimmedShortDesc) {
      setLocalError("Short description is required.");
      return;
    }

    const finalTechnologies = [...technologies];
    if (techInput.trim()) {
      const pendingTech = techInput.trim();
      if (
        !finalTechnologies.some(
          (t) => t.toLowerCase() === pendingTech.toLowerCase()
        )
      ) {
        finalTechnologies.push(pendingTech);
      }
    }

    const finalFeatures = [...features];
    if (featureInput.trim() && !finalFeatures.includes(featureInput.trim())) {
      finalFeatures.push(featureInput.trim());
    }

    const payload = {
      name: trimmedName,
      slug: finalSlug,
      category: trimmedCategory,
      shortDescription: trimmedShortDesc,
      description: description.trim(),
      logoUrl: logoUrl.trim() || null,
      coverImage: coverImage.trim() || null,
      galleryImages: galleryImages.filter(Boolean),
      technologies: finalTechnologies,
      features: finalFeatures,
      liveUrl: liveUrl.trim() || null,
      githubUrl: githubUrl.trim() || null,
      status,
      featured,
    };

    await onSave(payload);
  }

  const displayError = localError || serverError;

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8"
      noValidate
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-accent">
            {isEditMode ? "Edit Product" : "Add Product"}
          </p>
          <h2 className="mt-1 text-2xl font-medium text-white">
            {isEditMode ? `Editing ${initialProduct.name}` : "New Product"}
          </h2>
        </div>

        {onCancel && (
          <button
            type="button"
            disabled={saving}
            onClick={onCancel}
            className="rounded-full border border-white/15 px-4 py-1.5 text-xs text-white/70 transition-colors hover:border-white/30 hover:text-white disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>

      {displayError && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-200"
        >
          {displayError}
        </div>
      )}

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="product-name"
            className="block text-xs font-medium uppercase tracking-wider text-white/70"
          >
            Product Name <span className="text-accent">*</span>
          </label>
          <input
            id="product-name"
            type="text"
            required
            value={name}
            onChange={handleNameChange}
            placeholder="e.g., Akivro Cloud Studio"
            className="mt-2 w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="product-slug"
            className="block text-xs font-medium uppercase tracking-wider text-white/70"
          >
            URL Slug <span className="text-accent">*</span>
          </label>
          <div className="mt-2 flex items-center rounded-xl border border-white/15 bg-white/[0.03] px-3 py-2.5 focus-within:border-accent">
            <span className="select-none text-xs text-white/40">
              /products/
            </span>
            <input
              id="product-slug"
              type="text"
              required
              value={slug}
              onChange={handleSlugChange}
              placeholder="akivro-cloud-studio"
              className="w-full bg-transparent pl-1 text-sm text-white placeholder:text-white/30 focus:outline-none"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="product-category"
            className="block text-xs font-medium uppercase tracking-wider text-white/70"
          >
            Category <span className="text-accent">*</span>
          </label>
          <input
            id="product-category"
            type="text"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Select below or enter custom category"
            className="mt-2 w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-accent focus:outline-none"
          />
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {SUGGESTED_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  category === cat
                    ? "border-accent bg-accent/15 text-accent"
                    : "border-white/10 bg-white/[0.02] text-white/60 hover:border-white/25 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="sm:col-span-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="product-short-desc"
              className="block text-xs font-medium uppercase tracking-wider text-white/70"
            >
              Short Description <span className="text-accent">*</span>
            </label>
            <span className="text-[11px] text-white/40">
              {shortDescription.length}/350
            </span>
          </div>
          <input
            id="product-short-desc"
            type="text"
            required
            maxLength={350}
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="Concise summary used on product cards and SEO meta description."
            className="mt-2 w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-accent focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="product-description"
            className="block text-xs font-medium uppercase tracking-wider text-white/70"
          >
            Description
          </label>
          <textarea
            id="product-description"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed overview of the product, architecture, and problem it solves..."
            className="mt-2 w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-sm leading-relaxed text-white placeholder:text-white/30 focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <ImageUploader
            label="Logo"
            hint="Square icon or brand mark (optional)"
            value={logoUrl}
            onChange={setLogoUrl}
            multiple={false}
            onUploadingChange={(isUp) =>
              setActiveUploads((prev) => ({ ...prev, logo: isUp }))
            }
          />
        </div>

        <div>
          <ImageUploader
            label="Cover Image"
            hint="16:9 hero preview shown on cards & detail header"
            value={coverImage}
            onChange={setCoverImage}
            multiple={false}
            onUploadingChange={(isUp) =>
              setActiveUploads((prev) => ({ ...prev, cover: isUp }))
            }
          />
        </div>

        <div className="sm:col-span-2">
          <ImageUploader
            label="Gallery Images"
            hint="Upload one or more product screenshots"
            value={galleryImages}
            onChange={setGalleryImages}
            multiple
            onUploadingChange={(isUp) =>
              setActiveUploads((prev) => ({ ...prev, gallery: isUp }))
            }
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="product-tech"
            className="block text-xs font-medium uppercase tracking-wider text-white/70"
          >
            Technologies
          </label>

          {technologies.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {technologies.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs text-accent"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTechnology(tech)}
                    aria-label={`Remove ${tech}`}
                    className="text-accent/70 hover:text-white"
                  >
                    Γ£ò
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="mt-2 flex gap-2">
            <input
              id="product-tech"
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={handleTechKeyDown}
              placeholder="Type a technology and press Enter (e.g., Next.js)"
              className="flex-1 rounded-xl border border-white/15 bg-white/[0.03] px-4 py-2 text-sm text-white placeholder:text-white/30 focus:border-accent focus:outline-none"
            />
            <button
              type="button"
              onClick={() => addTechnology(techInput)}
              className="rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2 text-xs font-medium text-white hover:bg-white/10"
            >
              Add
            </button>
          </div>

          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {SUGGESTED_TECHNOLOGIES.map((tech) => {
              const selected = technologies.some(
                (t) => t.toLowerCase() === tech.toLowerCase()
              );
              return (
                <button
                  key={tech}
                  type="button"
                  onClick={() =>
                    selected ? removeTechnology(tech) : addTechnology(tech)
                  }
                  className={`rounded-full border px-2.5 py-1 text-[11px] transition-colors ${
                    selected
                      ? "border-accent/50 bg-accent/15 text-accent"
                      : "border-white/10 bg-white/[0.02] text-white/50 hover:border-white/25 hover:text-white"
                  }`}
                >
                  {selected ? `Γ£ô ${tech}` : `+ ${tech}`}
                </button>
              );
            })}
          </div>
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="product-features"
            className="block text-xs font-medium uppercase tracking-wider text-white/70"
          >
            Key Features (Optional)
          </label>
          {features.length > 0 && (
            <ul className="mt-2 space-y-1.5">
              {features.map((feat) => (
                <li
                  key={feat}
                  className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs text-white/80"
                >
                  <span>ΓÇó {feat}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(feat)}
                    className="text-white/40 hover:text-red-300"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-2 flex gap-2">
            <input
              id="product-features"
              type="text"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyDown={handleFeatureKeyDown}
              placeholder="Add a key feature highlight and press Enter"
              className="flex-1 rounded-xl border border-white/15 bg-white/[0.03] px-4 py-2 text-sm text-white placeholder:text-white/30 focus:border-accent focus:outline-none"
            />
            <button
              type="button"
              onClick={() => addFeature(featureInput)}
              className="rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2 text-xs font-medium text-white hover:bg-white/10"
            >
              Add Feature
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="product-live-url"
            className="block text-xs font-medium uppercase tracking-wider text-white/70"
          >
            Live URL
          </label>
          <input
            id="product-live-url"
            type="url"
            value={liveUrl}
            onChange={(e) => setLiveUrl(e.target.value)}
            placeholder="https://example.com"
            className="mt-2 w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="product-github-url"
            className="block text-xs font-medium uppercase tracking-wider text-white/70"
          >
            GitHub URL
          </label>
          <input
            id="product-github-url"
            type="url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/username/repo"
            className="mt-2 w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="product-status"
            className="block text-xs font-medium uppercase tracking-wider text-white/70"
          >
            Status
          </label>
          <select
            id="product-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-2 w-full rounded-xl border border-white/15 bg-[#121212] px-4 py-2.5 text-sm text-white focus:border-accent focus:outline-none"
          >
            <option value="DRAFT">Draft (Private)</option>
            <option value="PUBLISHED">Published (Public)</option>
          </select>
        </div>

        <div className="flex flex-col justify-end">
          <span className="block text-xs font-medium uppercase tracking-wider text-white/70">
            Featured on Homepage
          </span>
          <div className="mt-2 flex items-center justify-between rounded-xl border border-white/15 bg-white/[0.03] px-4 py-2">
            <span className="text-sm text-white/80">
              {featured ? "ON ΓÇö Highlighted as Featured" : "OFF ΓÇö Standard"}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={featured}
              onClick={() => setFeatured((v) => !v)}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                featured ? "bg-accent" : "bg-white/20"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${
                  featured ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-end gap-3 border-t border-white/10 pt-6">
        {onCancel && (
          <button
            type="button"
            disabled={saving}
            onClick={onCancel}
            className="rounded-full border border-white/15 px-5 py-2.5 text-xs font-medium text-white/70 transition-colors hover:border-white/30 hover:text-white disabled:opacity-50"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={saving || isAnyUploading}
          className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-xs font-medium text-black transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ? "Saving Product..."
            : isAnyUploading
              ? "Waiting for upload..."
              : isEditMode
                ? "Update Product"
                : "Save Product"}
        </button>
      </div>
    </form>
  );
}
