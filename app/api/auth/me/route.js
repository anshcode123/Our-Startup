import { NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/serverAuth";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized access. Please log in." },
      { status: 401 }
    );
  }

  return NextResponse.json(
    {
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name || "Admin",
      },
    },
    { status: 200 }
  );
}
