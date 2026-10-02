const { v2: cloudinary } = require("cloudinary");

function isCloudinaryConfigured() {
  const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || "").trim();
  const apiKey = (process.env.CLOUDINARY_API_KEY || "").trim();
  const apiSecret = (process.env.CLOUDINARY_API_SECRET || "").trim();
  return Boolean(cloudName && apiKey && apiSecret);
}

function configureCloudinary() {
  if (!isCloudinaryConfigured()) {
    return false;
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME.trim(),
    api_key: process.env.CLOUDINARY_API_KEY.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET.trim(),
    secure: true,
  });

  return true;
}

/**
 * Uploads a validated image Buffer to Cloudinary cloud storage.
 * Never writes files to local disk (/public/uploads).
 */
async function uploadImageToCloud(buffer, { mimeType = "image/png", folder = "anshul-dev/products" } = {}) {
  if (
    process.env.NODE_ENV !== "production" &&
    process.env.CLOUDINARY_DEV_MOCK === "true" &&
    !isCloudinaryConfigured()
  ) {
    const base64 = buffer.toString("base64");
    const safeMime = mimeType === "image/jpg" ? "image/jpeg" : mimeType;
    return {
      url: `data:${safeMime};base64,${base64}`,
      publicId: `dev-mock-${Date.now()}`,
      bytes: buffer.length,
      format: safeMime.split("/")[1] || "png",
    };
  }

  if (!configureCloudinary()) {
    const err = new Error(
      "Cloud image storage is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
    );
    err.statusCode = 503;
    throw err;
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result || !result.secure_url) {
          const uploadErr = new Error(
            "Failed to upload image to cloud storage. Please verify your storage credentials and try again."
          );
          uploadErr.statusCode = 502;
          reject(uploadErr);
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

module.exports = {
  isCloudinaryConfigured,
  uploadImageToCloud,
};
