import { proxyBackendRequest } from "@/lib/serverAuth";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { response } = await proxyBackendRequest(request, "/api/auth/me", {
    method: "GET",
  });
  return response;
}