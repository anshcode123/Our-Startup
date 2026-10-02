import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAdminSession } from "@/lib/serverAuth";
import { fetchFirestoreTheme, updateFirestoreTheme } from "@/lib/firebase";

export const dynamic = "force-dynamic";

let inMemoryGlobalTheme = "dark";

export async function GET() {
  let theme = inMemoryGlobalTheme;
  try {
    const firestoreTheme = await fetchFirestoreTheme();
    if (firestoreTheme === "light" || firestoreTheme === "dark") {
      theme = firestoreTheme;
      inMemoryGlobalTheme = firestoreTheme;
    }
  } catch (err) {
    console.warn("[GET /api/theme] Firestore read notice:", err?.message);
  }

  return NextResponse.json(
    { theme },
    {
      headers: {
        "Cache-Control": "public, s-maxage=5, stale-while-revalidate=59",
      },
    }
  );
}

export async function POST(request) {
  const admin = await verifyAdminSession(request);
  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized. Admin authentication required to change site theme." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const newTheme = String(body?.theme || "").trim().toLowerCase();

    if (newTheme !== "dark" && newTheme !== "light") {
      return NextResponse.json(
        { error: "Invalid theme value. Allowed values: 'dark' | 'light'" },
        { status: 400 }
      );
    }

    inMemoryGlobalTheme = newTheme;

    // Update in Firestore document settings/site
    try {
      await updateFirestoreTheme(newTheme);
    } catch (err) {
      console.warn("[POST /api/theme] Firestore update notice:", err?.message);
    }

    try {
      revalidatePath("/");
      revalidatePath("/products");
      revalidatePath("/admin/dashboard");
    } catch {
      // Ignore
    }

    return NextResponse.json({
      success: true,
      theme: newTheme,
      updatedBy: admin.email,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update theme: " + error.message },
      { status: 500 }
    );
  }
}