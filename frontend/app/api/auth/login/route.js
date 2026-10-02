import { proxyBackendRequest } from "@/lib/serverAuth";

export async function POST(request) {
  const { response } = await proxyBackendRequest(request, "/api/auth/login", {
    method: "POST",
  });
  return response;
}