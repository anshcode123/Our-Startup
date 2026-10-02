require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const { requireAdmin } = require("./middleware/authMiddleware");
const { uploadProductImage } = require("./controllers/productController");
const { MAX_IMAGE_SIZE_BYTES } = require("./lib/validation");
const { ensureAdminInitialized } = require("./lib/auth");

const app = express();
app.disable("x-powered-by");

app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

const allowedOrigins = new Set(
  [
    process.env.FRONTEND_URL,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ].filter(Boolean)
);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_IMAGE_SIZE_BYTES,
    files: 1,
  },
});

app.post(
  "/api/upload",
  requireAdmin,
  (req, res, next) => {
    upload.single("file")(req, res, (err) => {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            error: "Image exceeds the maximum allowed size of 5 MB.",
          });
        }
        return res.status(400).json({
          error: "Invalid file upload request.",
        });
      }
      return next();
    });
  },
  uploadProductImage
);

app.use("/api", (_req, res) => {
  res.status(404).json({ error: "API endpoint not found." });
});

app.use((err, _req, res, _next) => {
  if (err && err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON payload." });
  }
  if (err && err.message === "Origin not allowed by CORS") {
    return res.status(403).json({ error: "CORS policy blocked this request." });
  }
  console.error("[Express Global Error]", err?.message || "Unexpected error");
  return res.status(500).json({
    error: "An unexpected server error occurred.",
  });
});

if (require.main === module) {
  const port = Number(process.env.BACKEND_PORT || process.env.PORT || 4000);
  ensureAdminInitialized()
    .catch((err) => {
      console.warn("[Admin Init Notice]", err.message);
    })
    .finally(() => {
      app.listen(port, () => {
        console.info(`Anshul.dev Product CMS Backend listening on http://localhost:${port}`);
      });
    });
}

module.exports = app;
