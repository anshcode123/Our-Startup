import { proxyBackendRequest, revalidateProductRoutes } from "@/lib/serverAuth";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { search } = new URL(request.url);
  const id = encodeURIComponent(params?.id || "");
  const { response } = await proxyBackendRequest(
    request,
    `/api/products/${id}${search || ""}`,
    { method: "GET" }
  );
  return response;
}

export async function PUT(request, { params }) {
  const id = encodeURIComponent(params?.id || "");
  const { response, status, data } = await proxyBackendRequest(
    request,
    `/api/products/${id}`,
    { method: "PUT" }
  );

  if (status === 200 && data?.product) {
    revalidateProductRoutes(data.product.slug, data.previousSlug);
  }

  return response;
}

export async function DELETE(request, { params }) {
  const id = encodeURIComponent(params?.id || "");
  const { response, status, data } = await proxyBackendRequest(
    request,
    `/api/products/${id}`,
    { method: "DELETE" }
  );

  if (status === 200) {
    revalidateProductRoutes(data?.deletedSlug);
  }

  return response;
}