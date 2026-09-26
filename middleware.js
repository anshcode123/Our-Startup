import { NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "anshul_admin_token";

function base64UrlToUint8Array(base64Url) {
  const padding = "=".repeat((4 - (base64Url.length % 4)) % 4);
  const base64 = (base64Url + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function verifyJwtEdge(token, secret) {
  if (!token || !secret || secret.trim().length < 16) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [headerB64, payloadB64, signatureB64] = parts;

  try {
    const headerJson = JSON.parse(
      new TextDecoder().decode(base64UrlToUint8Array(headerB64))
    );
    if (headerJson.alg !== "HS256") return null;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const data = encoder.encode(`${headerB64}.${payloadB64}`);
    const signature = base64UrlToUint8Array(signatureB64);

    const isValid = await crypto.subtle.verify("HMAC", key, signature, data);
    if (!isValid) return null;

    const payload = JSON.parse(
      new TextDecoder().decode(base64UrlToUint8Array(payloadB64))
    );

    const nowSec = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp <= nowSec) return null;
    if (payload.iss !== "anshul.dev" || payload.aud !== "anshul.dev-admin") {
      return null;
    }
    if (payload.role !== "admin" || !payload.sub) return null;

    return payload;
  } catch {
    return null;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value || "";
  const secret = process.env.AUTH_SECRET || "";
  const verifiedPayload = token ? await verifyJwtEdge(token, secret) : null;

  if (pathname === "/admin") {
    const target = verifiedPayload ? "/admin/dashboard" : "/admin/login";
    return NextResponse.redirect(new URL(target, request.url));
  }

  if (pathname.startsWith("/admin/login")) {
    if (verifiedPayload) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  if (!verifiedPayload) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("Cache-Control", "no-store, max-age=0");
  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
