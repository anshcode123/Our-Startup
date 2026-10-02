const express = require("express");
const rateLimit = require("express-rate-limit");
const { login, logout, getMe } = require("../controllers/authController");
const { requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many login attempts from this IP. Please try again after 15 minutes.",
  },
});

router.post("/login", loginLimiter, login);
router.post("/logout", logout);
router.get("/me", requireAdmin, getMe);

module.exports = router;
