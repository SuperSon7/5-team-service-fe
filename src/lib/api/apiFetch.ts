import { authStore } from "@/stores/authStore";
import { ApiErrorResponse, ApiFetchOptions, ApiResponse } from "./types";
import { refreshAccessToken } from "../auth/refreshAccessToken";

export async function apiFetch<T>(path: string, init: ApiFetchOptions) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
  }

  const url = `${base}${path}`;
  const controller = new AbortController();
  const timeoutMs = init.timeoutMs ?? 5000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const accessToken = authStore.getAccessToken();
    const headers = new Headers(init.headers);

    if (!headers.has("Content-Type") && init.body) {
      headers.set("Content-Type", "application/json");
    }

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    const response = await fetch(url, {
      ...init,
      headers,
      signal: controller.signal,
      credentials: init.credentials ?? "include",
    });

    if (response.status === 401 && !init.skipRefresh && !init.retried) {
      let error: ApiErrorResponse | null = null;
      try {
        error = (await response.json()) as ApiErrorResponse;
      } catch {
        error = null;
      }

      if (error?.code === "TOKEN_EXPIRED") {
        const newAccessToken = await refreshAccessToken();

        if (newAccessToken) {
          const retryHeaders = new Headers(init.headers);
          retryHeaders.set("Authorization", `Bearer ${newAccessToken}`);
          return apiFetch<T>(url, {
            ...init,
            headers: retryHeaders,
            signal: controller.signal,
            credentials: init.credentials ?? "include",
            retried: true,
          });
        }

        authStore.clear();
        throw new Error("세션이 만료되었습니다. 다시 로그인해주세요");
      }

      if (error?.code === "TOKEN_INVALID") {
        authStore.clear();
        throw new Error("유효하지 않은 토큰입니다. 다시 로그인해주세요");
      }

      if (error?.code === "AUTH_UNAUTHORIZED") {
        authStore.clear();
        throw new Error("인증이 필요합니다.");
      }
    }

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    if (response.status === 204) {
      return null as T;
    }

    const body = (await response.json()) as ApiResponse<T>;
    return body.data;
  } finally {
    clearTimeout(timeoutId);
  }
}
