const express = require("express");
const multer = require("multer");
const {
  listProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  publishProduct,
  unpublishProduct,
  uploadProductImage,
} = require("../controllers/productController");
const { requireAdmin, optionalAdmin } = require("../middleware/authMiddleware");
const { MAX_IMAGE_SIZE_BYTES } = require("../lib/validation");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_IMAGE_SIZE_BYTES,
    files: 1,
  },
});

function handleUploadMiddleware(req, res, next) {
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
}

router.get("/", optionalAdmin, listProducts);
router.post("/upload", requireAdmin, handleUploadMiddleware, uploadProductImage);
router.get("/:slug", optionalAdmin, getProductBySlug);
router.post("/", requireAdmin, createProduct);
router.put("/:id", requireAdmin, updateProduct);
router.delete("/:id", requireAdmin, deleteProduct);
router.post("/:id/publish", requireAdmin, publishProduct);
router.post("/:id/unpublish", requireAdmin, unpublishProduct);

module.exports = router;
