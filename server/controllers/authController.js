const prisma = require("../lib/prisma");
const {
  AUTH_COOKIE_NAME,
  verifyPassword,
  signAdminToken,
  getCookieOptions,
  ensureAdminInitialized,
  checkLoginRateLimit,
  recordLoginFailure,
  resetLoginRateLimit,
} = require("../lib/auth");
const { validateLoginInput } = require("../lib/validation");

const DUMMY_BCRYPT_HASH =
  "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4oL9.x1W6O";

async function performLogin(body = {}, clientIp = "unknown") {
  const rateCheck = checkLoginRateLimit(clientIp);
  if (!rateCheck.allowed) {
    return {
      status: 429,
      body: {
        error: `Too many failed login attempts. Please try again in ${Math.ceil(
          rateCheck.retryAfterSeconds / 60
        )} minute(s).`,
      },
    };
  }

  const validation = validateLoginInput(body);
  if (!validation.valid) {
    return {
      status: 400,
      body: { error: validation.error },
    };
  }

  const { email, password } = validation.data;

  try {
    await ensureAdminInitialized();

    const admin = await prisma.admin.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        passwordHash: true,
      },
    });

    if (!admin) {
      await verifyPassword(password, DUMMY_BCRYPT_HASH);
      recordLoginFailure(clientIp);
      return {
        status: 401,
        body: { error: "Invalid email or password." },
      };
    }

    const isPasswordValid = await verifyPassword(password, admin.passwordHash);
    if (!isPasswordValid) {
      recordLoginFailure(clientIp);
      return {
        status: 401,
        body: { error: "Invalid email or password." },
      };
    }

    resetLoginRateLimit(clientIp);

    const safeUser = {
      id: admin.id,
      email: admin.email,
      name: admin.name || "Admin",
    };

    const token = signAdminToken(safeUser);

    return {
      status: 200,
      token,
      body: {
        message: "Authenticated successfully.",
        user: safeUser,
      },
    };
  } catch (error) {
    console.error("[authController.performLogin] Error:", error.message);
    return {
      status: 500,
      body: {
        error: "Unable to complete login at this time. Please try again later.",
      },
    };
  }
}

async function login(req, res) {
  const clientIp =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.ip ||
    "unknown";

  const result = await performLogin(req.body, clientIp);

  if (result.token) {
    res.cookie(AUTH_COOKIE_NAME, result.token, getCookieOptions(false));
  }

  return res.status(result.status).json(result.body);
}

async function logout(_req, res) {
  res.clearCookie(AUTH_COOKIE_NAME, getCookieOptions(true));
  return res.status(200).json({
    message: "Logged out successfully.",
  });
}

async function getMe(req, res) {
  if (!req.admin) {
    return res.status(401).json({
      error: "Unauthorized access. Please log in.",
    });
  }

  return res.status(200).json({
    user: {
      id: req.admin.id,
      email: req.admin.email,
      name: req.admin.name || "Admin",
    },
  });
}

module.exports = {
  performLogin,
  login,
  logout,
  getMe,
};
