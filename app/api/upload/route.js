import { NextResponse } from "next/server";
import { handleUploadProductImage } from "@/server/controllers/productController";
import { getAdminFromRequest } from "@/lib/serverAuth";

export async function POST(request) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized access. Please log in." },
      { status: 401 }
    );
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid multipart form-data upload request." },
      { status: 400 }
    );
  }

  const file = formData.get("file");
  if (!file || typeof file.arrayBuffer !== "function") {
    return NextResponse.json(
      { error: "No image file received. Please select a valid image file." },
      { status: 400 }
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const result = await handleUploadProductImage({
    buffer,
    mimeType: file.type || "",
    originalName: file.name || "upload",
  });

  return NextResponse.json(result.body, { status: result.status });
}
