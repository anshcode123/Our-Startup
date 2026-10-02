import { proxyBackendRequest, revalidateProductRoutes } from "@/lib/serverAuth";

export async function POST(request, { params }) {
  const id = encodeURIComponent(params?.id || "");
  const { response, status, data } = await proxyBackendRequest(
    request,
    `/api/products/${id}/publish`,
    { method: "POST" }
  );

  if (status === 200 && data?.product) {
    revalidateProductRoutes(data.product.slug);
  }

  return response;
}