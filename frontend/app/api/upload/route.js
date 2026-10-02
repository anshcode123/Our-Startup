import { proxyBackendRequest } from "@/lib/serverAuth";

export async function POST(request) {
  const { response } = await proxyBackendRequest(request, "/api/upload", {
    method: "POST",
    rawBody: true,
  });
  return response;
}