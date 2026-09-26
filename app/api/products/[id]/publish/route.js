import { NextResponse } from "next/server";
import { handlePublishProduct } from "@/server/controllers/productController";
import { getAdminFromRequest, revalidateProductRoutes } from "@/lib/serverAuth";

export async function POST(request, { params }) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized access. Please log in." },
      { status: 401 }
    );
  }

  const result = await handlePublishProduct(params?.id, true);
  if (result.status === 200 && result.body?.product) {
    revalidateProductRoutes(result.body.product.slug);
  }

  return NextResponse.json(result.body, { status: result.status });
}
