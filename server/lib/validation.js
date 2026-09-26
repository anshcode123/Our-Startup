const ALLOWED_STATUSES = ["DRAFT", "PUBLISHED"];
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
]);

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

function slugify(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sanitizeText(value, maxLength = 5000) {
  if (value === undefined || value === null) return "";
  return String(value).trim().slice(0, maxLength);
}

/**
 * Validates and normalizes an external or cloud-storage URL.
 * Rejects dangerous schemes like javascript:, vbscript:, file:, etc.
 */
function sanitizeAndValidateUrl(rawUrl, fieldLabel = "URL", { allowImageUrl = false } = {}) {
  if (rawUrl === undefined || rawUrl === null || String(rawUrl).trim() === "") {
    return { valid: true, url: null };
  }

  const trimmed = String(rawUrl).trim();

  if (
    allowImageUrl &&
    process.env.NODE_ENV !== "production" &&
    /^data:image\/(png|jpeg|jpg|webp|gif|svg\+xml);base64,[A-Za-z0-9+/=]+$/i.test(trimmed)
  ) {
    return { valid: true, url: trimmed };
  }

  if (trimmed.length > 2048) {
    return { valid: false, error: `${fieldLabel} is too long (max 2048 characters).` };
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return {
        valid: false,
        error: `${fieldLabel} must start with http:// or https://.`,
      };
    }
    return { valid: true, url: parsed.toString() };
  } catch {
    return {
      valid: false,
      error: `${fieldLabel} must be a valid URL (e.g., https://example.com).`,
    };
  }
}

function normalizeStringArray(input, { maxItems = 40, maxItemLength = 80 } = {}) {
  let rawList = [];
  if (Array.isArray(input)) {
    rawList = input;
  } else if (typeof input === "string" && input.trim() !== "") {
    rawList = input.split(",");
  }

  const seen = new Set();
  const result = [];

  for (const item of rawList) {
    const cleaned = String(item || "").trim();
    if (!cleaned) continue;
    const truncated = cleaned.slice(0, maxItemLength);
    const key = truncated.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(truncated);
      if (result.length >= maxItems) break;
    }
  }

  return result;
}

function validateLoginInput(body = {}) {
  const email = String(body.email || "").trim().toLowerCase();
  const password = typeof body.password === "string" ? body.password : "";

  if (!email) {
    return { valid: false, error: "Email address is required." };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { valid: false, error: "Please enter a valid email address." };
  }
  if (!password) {
    return { valid: false, error: "Password is required." };
  }

  return { valid: true, data: { email, password } };
}

function validateProductInput(body = {}, { partial = false } = {}) {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Invalid request payload." };
  }

  const errors = [];
  const data = {};

  if (!partial || body.name !== undefined) {
    const name = sanitizeText(body.name, 150);
    if (!name) {
      errors.push("Product name is required.");
    } else if (name.length < 2) {
      errors.push("Product name must be at least 2 characters.");
    } else {
      data.name = name;
    }
  }

  if (!partial || body.slug !== undefined || (!partial && body.name)) {
    const rawSlug =
      body.slug !== undefined && String(body.slug).trim() !== ""
        ? String(body.slug).trim().toLowerCase()
        : slugify(body.name || "");

    if (!rawSlug) {
      errors.push("Product slug is required.");
    } else if (rawSlug.length > 150) {
      errors.push("Product slug must be 150 characters or fewer.");
    } else if (!SLUG_REGEX.test(rawSlug)) {
      errors.push(
        "Slug may only contain lowercase letters, numbers, and single hyphens (e.g., my-product)."
      );
    } else {
      data.slug = rawSlug;
    }
  }

  if (!partial || body.shortDescription !== undefined) {
    const shortDescription = sanitizeText(body.shortDescription, 350);
    if (!shortDescription) {
      errors.push("Short description is required.");
    } else {
      data.shortDescription = shortDescription;
    }
  }

  if (!partial || body.category !== undefined) {
    const category = sanitizeText(body.category, 100);
    if (!category) {
      errors.push("Category is required.");
    } else {
      data.category = category;
    }
  }

  if (!partial || body.status !== undefined) {
    const status = String(body.status ?? "DRAFT").trim().toUpperCase();
    if (!ALLOWED_STATUSES.includes(status)) {
      errors.push("Status must be either DRAFT or PUBLISHED.");
    } else {
      data.status = status;
    }
  }

  if (!partial || body.description !== undefined) {
    data.description = sanitizeText(body.description ?? "", 20000);
  }

  if (!partial || body.logoUrl !== undefined) {
    const check = sanitizeAndValidateUrl(body.logoUrl, "Logo URL", {
      allowImageUrl: true,
    });
    if (!check.valid) {
      errors.push(check.error);
    } else {
      data.logoUrl = check.url;
    }
  }

  if (!partial || body.coverImage !== undefined) {
    const check = sanitizeAndValidateUrl(body.coverImage, "Cover image URL", {
      allowImageUrl: true,
    });
    if (!check.valid) {
      errors.push(check.error);
    } else {
      data.coverImage = check.url;
    }
  }

  if (!partial || body.galleryImages !== undefined) {
    const rawGallery = Array.isArray(body.galleryImages) ? body.galleryImages : [];
    if (rawGallery.length > 20) {
      errors.push("Gallery can contain at most 20 images.");
    } else {
      const validatedGallery = [];
      for (let i = 0; i < rawGallery.length; i += 1) {
        const item = rawGallery[i];
        if (!item || String(item).trim() === "") continue;
        const check = sanitizeAndValidateUrl(
          item,
          `Gallery image #${i + 1}`,
          { allowImageUrl: true }
        );
        if (!check.valid) {
          errors.push(check.error);
        } else if (check.url) {
          validatedGallery.push(check.url);
        }
      }
      data.galleryImages = validatedGallery;
    }
  }

  if (!partial || body.technologies !== undefined) {
    data.technologies = normalizeStringArray(body.technologies, {
      maxItems: 40,
      maxItemLength: 60,
    });
  }

  if (!partial || body.features !== undefined) {
    data.features = normalizeStringArray(body.features, {
      maxItems: 30,
      maxItemLength: 200,
    });
  }

  if (!partial || body.liveUrl !== undefined) {
    const check = sanitizeAndValidateUrl(body.liveUrl, "Live URL");
    if (!check.valid) {
      errors.push(check.error);
    } else {
      data.liveUrl = check.url;
    }
  }

  if (!partial || body.githubUrl !== undefined) {
    const check = sanitizeAndValidateUrl(body.githubUrl, "GitHub URL");
    if (!check.valid) {
      errors.push(check.error);
    } else {
      data.githubUrl = check.url;
    }
  }

  if (!partial || body.featured !== undefined) {
    data.featured = Boolean(body.featured);
  }

  if (errors.length > 0) {
    return {
      valid: false,
      error: errors[0],
      errors,
    };
  }

  return { valid: true, data };
}

function validateImageBuffer(buffer, mimeType = "", originalName = "") {
  if (!buffer || !Buffer.isBuffer(buffer) || buffer.length === 0) {
    return { valid: false, error: "No image file provided or file is empty." };
  }

  if (buffer.length > MAX_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      error: "Image exceeds the maximum allowed size of 5 MB.",
    };
  }

  const normalizedMime = String(mimeType).toLowerCase().trim();
  if (!ALLOWED_IMAGE_MIME_TYPES.has(normalizedMime)) {
    return {
      valid: false,
      error:
        "Unsupported file type. Allowed formats: PNG, JPG, WEBP, GIF, AVIF, and SVG.",
    };
  }

  const isPng =
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47;
  const isJpeg =
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff;
  const isGif =
    buffer.length >= 6 &&
    buffer.subarray(0, 4).toString("ascii") === "GIF8";
  const isWebp =
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP";
  const isAvif =
    buffer.length >= 12 &&
    buffer.subarray(4, 8).toString("ascii") === "ftyp";

  if (normalizedMime === "image/svg+xml") {
    const text = buffer.toString("utf8").slice(0, 4096);
    if (!text.includes("<svg") || /<script\b|onload\s*=|onerror\s*=/i.test(text)) {
      return {
        valid: false,
        error: "Invalid or unsafe SVG image file.",
      };
    }
    return { valid: true, filename: originalName };
  }

  if (!isPng && !isJpeg && !isGif && !isWebp && !isAvif) {
    return {
      valid: false,
      error: "File content does not match a valid image signature.",
    };
  }

  return { valid: true, filename: originalName };
}

module.exports = {
  ALLOWED_STATUSES,
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_IMAGE_SIZE_BYTES,
  slugify,
  sanitizeAndValidateUrl,
  validateLoginInput,
  validateProductInput,
  validateImageBuffer,
};
