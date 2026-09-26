import { NextResponse } from "next/server";
import { performLogin } from "@/server/controllers/authController";
import { AUTH_COOKIE_NAME, getCookieOptions } from "@/server/lib/auth";

export async function POST(request) {
  let body = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  const forwarded = request.headers.get("x-forwarded-for");
  const clientIp = forwarded ? forwarded.split(",")[0].trim() : "local";

  const result = await performLogin(body, clientIp);
  const response = NextResponse.json(result.body, { status: result.status });

  if (result.token) {
    const opts = getCookieOptions(false);
    response.cookies.set(AUTH_COOKIE_NAME, result.token, {
      httpOnly: opts.httpOnly,
      secure: opts.secure,
      sameSite: opts.sameSite,
      path: opts.path,
      maxAge: Math.floor(opts.maxAge / 1000),
    });
  }

  return response;
}
