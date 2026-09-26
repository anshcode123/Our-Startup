import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { AUTH_COOKIE_NAME } from "@/server/lib/auth";
import { verifyAdminFromToken } from "@/server/middleware/authMiddleware";

export async function getAdminFromRequest(request) {
  let token = null;

  try {
    const cookieStore = cookies();
    token = cookieStore.get(AUTH_COOKIE_NAME)?.value || null;
  } catch {
    token = null;
  }

  if (!token && request) {
    const authHeader = request.headers.get("authorization") || "";
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.slice(7).trim();
    }
  }

  if (!token) return null;
  return verifyAdminFromToken(token);
}

export function revalidateProductRoutes(...slugs) {
  try {
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/sitemap.xml");
    for (const slug of slugs) {
      if (slug && typeof slug === "string") {
        revalidatePath(`/products/${slug}`);
      }
    }
  } catch {
    // Ignore revalidation errors outside of Next.js request context
  }
}
