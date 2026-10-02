import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export const AUTH_COOKIE_NAME = "anshul_admin_token";

export function getBackendBaseUrl() {
  const configured =
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    `http://127.0.0.1:${process.env.BACKEND_PORT || 4000}`;
  return configured.replace(/\/+$/, "");
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

export async function proxyBackendRequest(
  request,
  backendPath,
  { method = "GET", rawBody = false } = {}
) {
  const url = `${getBackendBaseUrl()}${backendPath}`;
  const headers = new Headers();

  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader) {
    headers.set("cookie", cookieHeader);
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader) {
    headers.set("authorization", authHeader);
  }

  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    headers.set("x-forwarded-for", forwardedFor);
  }

  const contentType = request.headers.get("content-type");
  if (contentType) {
    headers.set("content-type", contentType);
  }

  let body;
  if (method !== "GET" && method !== "HEAD") {
    if (rawBody) {
      const arrayBuffer = await request.arrayBuffer();
      body = Buffer.from(arrayBuffer);
    } else {
      body = await request.text();
    }
  }

  try {
    const backendRes = await fetch(url, {
      method,
      headers,
      body,
      cache: "no-store",
    });

    let data = {};
    try {
      data = await backendRes.json();
    } catch {
      data = { error: "Unexpected response from backend server." };
    }

    const nextRes = NextResponse.json(data, { status: backendRes.status });

    const setCookie = backendRes.headers.get("set-cookie");
    if (setCookie) {
      nextRes.headers.set("set-cookie", setCookie);
    }

    return {
      response: nextRes,
      status: backendRes.status,
      data,
    };
  } catch {
    const errorBody = {
      error:
        "Backend server is unreachable. Please ensure the backend server is running.",
    };
    return {
      response: NextResponse.json(errorBody, { status: 503 }),
      status: 503,
      data: errorBody,
    };
  }
}

export async function verifyAdminSession(request) {
  try {
    const { status, data } = await proxyBackendRequest(request, "/api/auth/me", {
      method: "GET",
    });
    if (status === 200 && data?.user) {
      return data.user;
    }
    return null;
  } catch {
    return null;
  }
}