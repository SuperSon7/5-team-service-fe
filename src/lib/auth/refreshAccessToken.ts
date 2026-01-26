import { authStore } from "@/stores/authStore";

let refreshing: Promise<string | null> | null = null;

async function doRefresh(): Promise<string | null> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
  }
  const url = `${base}/auth/tokens`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    authStore.setAccessToken(null);
    return null;
  }

  const accessTokenData = await response.json();
  const accessToken = accessTokenData?.data?.accessToken ?? null;
  authStore.setAccessToken(accessToken);
  return accessToken;
}

export async function refreshAccessToken() {
  if (refreshing) return refreshing;

  refreshing = doRefresh();

  try {
    return await refreshing;
  } finally {
    refreshing = null;
  }
}
