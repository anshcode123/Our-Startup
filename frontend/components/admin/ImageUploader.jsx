"use client";

import { useId, useRef, useState } from "react";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

function uploadFileWithProgress(file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);

    xhr.open("POST", "/api/upload", true);
    xhr.withCredentials = true;

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && typeof onProgress === "function") {
        const pct = Math.round((event.loaded / event.total) * 100);
        onProgress(pct);
      }
    };

    xhr.onload = () => {
      let data = {};
      try {
        data = JSON.parse(xhr.responseText || "{}");
      } catch {
        data = {};
      }

      if (xhr.status >= 200 && xhr.status < 300 && data.url) {
        resolve(data.url);
      } else {
        reject(
          new Error(
            data.error || `Image upload failed (status ${xhr.status}).`
          )
        );
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error occurred while uploading image."));
    };

    xhr.send(formData);
  });
}

export default function ImageUploader({
  label,
  hint,
  value,
  onChange,
  multiple = false,
  onUploadingChange,
}) {
  const inputId = useId();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  const images = multiple
    ? Array.isArray(value)
      ? value.filter(Boolean)
      : []
    : value
      ? [value]
      : [];

  function setUploadState(isUploading) {
    setUploading(isUploading);
    if (typeof onUploadingChange === "function") {
      onUploadingChange(isUploading);
    }
  }

  function validateClientFile(file) {
    if (!file) return "No file selected.";
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return `"${file.name}" has an unsupported format. Use PNG, JPG, WEBP, GIF, AVIF, or SVG.`;
    }
    if (file.size > MAX_SIZE_BYTES) {
      return `"${file.name}" exceeds the 5 MB file size limit.`;
    }
    return null;
  }

  async function handleFileSelection(event) {
    const selectedFiles = Array.from(event.target.files || []);
    event.target.value = "";
    if (selectedFiles.length === 0) return;

    setError("");

    const filesToProcess = multiple ? selectedFiles : [selectedFiles[0]];

    for (const file of filesToProcess) {
      const validationError = validateClientFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setUploadState(true);
    setProgress(0);

    try {
      const uploadedUrls = [];
      for (let i = 0; i < filesToProcess.length; i += 1) {
        const file = filesToProcess[i];
        const url = await uploadFileWithProgress(file, (filePct) => {
          const overallPct = Math.round(
            ((i + filePct / 100) / filesToProcess.length) * 100
          );
          setProgress(overallPct);
        });
        uploadedUrls.push(url);
      }

      if (multiple) {
        onChange([...images, ...uploadedUrls]);
      } else {
        onChange(uploadedUrls[0] || "");
      }
      setProgress(100);
    } catch (err) {
      setError(err.message || "Failed to upload image.");
    } finally {
      setUploadState(false);
    }
  }

  function handleAddUrl() {
    setError("");
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        setError("Image URL must begin with https:// or http://.");
        return;
      }
    } catch {
      setError("Please enter a valid image URL.");
      return;
    }

    if (multiple) {
      if (!images.includes(trimmed)) {
        onChange([...images, trimmed]);
      }
    } else {
      onChange(trimmed);
    }
    setUrlInput("");
    setShowUrlInput(false);
  }

  function handleRemoveImage(indexToRemove) {
    setError("");
    if (multiple) {
      onChange(images.filter((_, idx) => idx !== indexToRemove));
    } else {
      onChange("");
    }
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <label
          htmlFor={inputId}
          className="block text-xs font-medium uppercase tracking-wider text-white/70"
        >
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput((prev) => !prev)}
          className="text-xs text-white/50 underline-offset-4 hover:text-accent hover:underline"
        >
          {showUrlInput ? "Hide URL input" : "Or use image URL"}
        </button>
      </div>

      {hint && <p className="text-xs text-white/50">{hint}</p>}

      <input
        id={inputId}
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,image/avif"
        multiple={multiple}
        onChange={handleFileSelection}
        disabled={uploading}
        className="sr-only"
      />

      {images.length > 0 && (
        <div
          className={`grid gap-3 ${
            multiple
              ? "grid-cols-2 sm:grid-cols-3"
              : "grid-cols-1 sm:max-w-xs"
          }`}
        >
          {images.map((imgUrl, idx) => (
            <div
              key={`${imgUrl}-${idx}`}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-black/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgUrl}
                  alt={`${label} preview ${idx + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-white/10 bg-ink/90 px-3 py-2">
                {!multiple ? (
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-medium text-white/70 transition-colors hover:text-white disabled:opacity-50"
                  >
                    Replace
                  </button>
                ) : (
                  <span className="truncate text-[11px] text-white/50">
                    Image #{idx + 1}
                  </span>
                )}
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => handleRemoveImage(idx)}
                  className="text-xs font-medium text-red-400 transition-colors hover:text-red-300 disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(multiple || images.length === 0) && (
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-4 text-xs font-medium text-white/70 transition-colors hover:border-accent/50 hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span>{uploading ? "Uploading..." : multiple ? "+ Upload Images" : "+ Upload Image"}</span>
          <span className="text-white/40">(PNG, JPG, WEBP, SVG ΓÇó Max 5MB)</span>
        </button>
      )}

      {uploading && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>Uploading to cloud storage...</span>
            <span className="tabular-nums">{progress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-accent transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {showUrlInput && (
        <div className="flex items-center gap-2 pt-1">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://res.cloudinary.com/..."
            className="flex-1 rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2 text-xs text-white placeholder:text-white/30 focus:border-accent focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-white/20"
          >
            Add URL
          </button>
        </div>
      )}

      {error && (
        <p role="alert" className="text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
