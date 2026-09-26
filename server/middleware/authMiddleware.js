const prisma = require("../lib/prisma");
const { AUTH_COOKIE_NAME, verifyAdminToken } = require("../lib/auth");

function extractTokenFromExpressReq(req) {
  if (req.cookies && req.cookies[AUTH_COOKIE_NAME]) {
    return req.cookies[AUTH_COOKIE_NAME];
  }

  const authHeader = req.headers?.authorization || "";
  if (authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }

  return null;
}

async function verifyAdminFromToken(token) {
  if (!token) return null;

  const decoded = verifyAdminToken(token);
  if (!decoded || !decoded.sub) return null;

  try {
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.sub },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });
    return admin || null;
  } catch {
    return null;
  }
}

async function requireAdmin(req, res, next) {
  try {
    const token = extractTokenFromExpressReq(req);
    const admin = await verifyAdminFromToken(token);

    if (!admin) {
      return res.status(401).json({
        error: "Unauthorized access. Please log in.",
      });
    }

    req.admin = admin;
    return next();
  } catch {
    return res.status(401).json({
      error: "Unauthorized access. Please log in.",
    });
  }
}

async function optionalAdmin(req, _res, next) {
  try {
    const token = extractTokenFromExpressReq(req);
    req.admin = token ? await verifyAdminFromToken(token) : null;
  } catch {
    req.admin = null;
  }
  return next();
}

module.exports = {
  extractTokenFromExpressReq,
  verifyAdminFromToken,
  requireAdmin,
  optionalAdmin,
};
