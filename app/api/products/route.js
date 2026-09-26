import { NextResponse } from "next/server";
import {
  handleListProducts,
  handleCreateProduct,
} from "@/server/controllers/productController";
import { getAdminFromRequest, revalidateProductRoutes } from "@/lib/serverAuth";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = Object.fromEntries(searchParams.entries());

  let admin = null;
  if (query.scope === "admin" || query.all === "true") {
    admin = await getAdminFromRequest(request);
  }

  const result = await handleListProducts({ query, admin });
  return NextResponse.json(result.body, { status: result.status });
}

export async function POST(request) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized access. Please log in." },
      { status: 401 }
    );
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  const result = await handleCreateProduct(body);
  if (result.status === 201 && result.body?.product) {
    revalidateProductRoutes(result.body.product.slug);
  }

  return NextResponse.json(result.body, { status: result.status });
}
