import { proxyBackendRequest, revalidateProductRoutes } from "@/lib/serverAuth";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { search } = new URL(request.url);
  const { response } = await proxyBackendRequest(
    request,
    `/api/products${search || ""}`,
    { method: "GET" }
  );
  return response;
}

export async function POST(request) {
  const { response, status, data } = await proxyBackendRequest(
    request,
    "/api/products",
    { method: "POST" }
  );

  if (status === 201 && data?.product) {
    revalidateProductRoutes(data.product.slug);
  }

  return response;
}