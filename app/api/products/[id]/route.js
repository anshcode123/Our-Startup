import { NextResponse } from "next/server";
import {
  handleGetProduct,
  handleUpdateProduct,
  handleDeleteProduct,
} from "@/server/controllers/productController";
import { getAdminFromRequest, revalidateProductRoutes } from "@/lib/serverAuth";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { searchParams } = new URL(request.url);
  const query = Object.fromEntries(searchParams.entries());

  let admin = null;
  if (query.scope === "admin") {
    admin = await getAdminFromRequest(request);
  }

  const result = await handleGetProduct({
    slugOrId: params?.id,
    query,
    admin,
  });

  return NextResponse.json(result.body, { status: result.status });
}

export async function PUT(request, { params }) {
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

  const result = await handleUpdateProduct(params?.id, body);
  if (result.status === 200 && result.body?.product) {
    revalidateProductRoutes(
      result.body.product.slug,
      result.body.previousSlug
    );
  }

  return NextResponse.json(result.body, { status: result.status });
}

export async function DELETE(request, { params }) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized access. Please log in." },
      { status: 401 }
    );
  }

  const result = await handleDeleteProduct(params?.id);
  if (result.status === 200) {
    revalidateProductRoutes(result.body?.deletedSlug);
  }

  return NextResponse.json(result.body, { status: result.status });
}
