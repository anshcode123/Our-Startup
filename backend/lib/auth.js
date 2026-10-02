const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("./prisma");

const AUTH_COOKIE_NAME = "anshul_admin_token";
const BCRYPT_ROUNDS = 12;
const TOKEN_TTL_SECONDS = 60 * 60 * 24; // 24 hours

// Login rate-limiting window (max 10 failed attempts per 15 minutes per IP)
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 10;
const loginAttempts = new Map();

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.trim().length < 16) {
    throw new Error(
      "Server authentication is not properly configured (missing or weak AUTH_SECRET)."
    );
  }
  return secret;
}

async function hashPassword(plainPassword) {
  return bcrypt.hash(String(plainPassword), BCRYPT_ROUNDS);
}

async function verifyPassword(plainPassword, passwordHash) {
  if (!plainPassword || !passwordHash) return false;
  return bcrypt.compare(String(plainPassword), String(passwordHash));
}

function signAdminToken(admin) {
  const secret = getAuthSecret();
  return jwt.sign(
    {
      sub: admin.id,
      email: admin.email,
      role: "admin",
    },
    secret,
    {
      algorithm: "HS256",
      expiresIn: TOKEN_TTL_SECONDS,
      issuer: "anshul.dev",
      audience: "anshul.dev-admin",
    }
  );
}

function verifyAdminToken(token) {
  if (!token || typeof token !== "string") return null;
  try {
    const secret = getAuthSecret();
    const decoded = jwt.verify(token, secret, {
      algorithms: ["HS256"],
      issuer: "anshul.dev",
      audience: "anshul.dev-admin",
    });
    if (!decoded || decoded.role !== "admin" || !decoded.sub) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

function getCookieOptions(clear = false) {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: clear ? 0 : TOKEN_TTL_SECONDS * 1000,
  };
}

/**
 * Ensures the single configured admin account exists in the database with a
 * bcrypt-hashed password when ADMIN_EMAIL and ADMIN_PASSWORD are provided.
 * Never stores raw passwords in the database.
 */
async function ensureAdminInitialized() {
  const envEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const envPassword = process.env.ADMIN_PASSWORD || "";

  if (!envEmail || !envPassword) {
    return null;
  }

  const existing = await prisma.admin.findUnique({
    where: { email: envEmail },
    select: { id: true, email: true, name: true },
  });

  if (existing) {
    return existing;
  }

  const passwordHash = await hashPassword(envPassword);
  return prisma.admin.create({
    data: {
      email: envEmail,
      passwordHash,
      name: "Admin",
    },
    select: { id: true, email: true, name: true },
  });
}

function checkLoginRateLimit(clientKey = "global") {
  const now = Date.now();
  const entry = loginAttempts.get(clientKey);
  if (!entry) return { allowed: true, retryAfterSeconds: 0 };

  if (now - entry.firstAttemptAt > LOGIN_WINDOW_MS) {
    loginAttempts.delete(clientKey);
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (entry.count >= LOGIN_MAX_ATTEMPTS) {
    const retryAfterSeconds = Math.ceil(
      (LOGIN_WINDOW_MS - (now - entry.firstAttemptAt)) / 1000
    );
    return { allowed: false, retryAfterSeconds };
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

function recordLoginFailure(clientKey = "global") {
  const now = Date.now();
  const entry = loginAttempts.get(clientKey);
  if (!entry || now - entry.firstAttemptAt > LOGIN_WINDOW_MS) {
    loginAttempts.set(clientKey, { count: 1, firstAttemptAt: now });
  } else {
    entry.count += 1;
  }
}

function resetLoginRateLimit(clientKey = "global") {
  loginAttempts.delete(clientKey);
}

module.exports = {
  AUTH_COOKIE_NAME,
  TOKEN_TTL_SECONDS,
  hashPassword,
  verifyPassword,
  signAdminToken,
  verifyAdminToken,
  getCookieOptions,
  ensureAdminInitialized,
  checkLoginRateLimit,
  recordLoginFailure,
  resetLoginRateLimit,
};
