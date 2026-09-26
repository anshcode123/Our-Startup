import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, getCookieOptions } from "@/server/lib/auth";

export async function POST() {
  const response = NextResponse.json(
    { message: "Logged out successfully." },
    { status: 200 }
  );

  const opts = getCookieOptions(true);
  response.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: opts.httpOnly,
    secure: opts.secure,
    sameSite: opts.sameSite,
    path: opts.path,
    maxAge: 0,
  });

  return response;
}
