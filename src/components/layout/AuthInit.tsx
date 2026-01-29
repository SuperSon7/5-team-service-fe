"use client";

import { refreshAccessToken } from "@/lib/auth/refreshAccessToken";
import { authStore, useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AuthInit() {
  const pathname = usePathname();
  const setInitialized = useAuthStore((state) => state.setInitialized);

  useEffect(() => {
    if (pathname.startsWith("/oauth")) {
      setInitialized(true);
      return;
    }
    const run = async () => {
      if (!authStore.getAccessToken()) {
        try {
          await refreshAccessToken();
        } catch {
          // ignore
        }
      }
      setInitialized(true);
    };
    run();
  }, [pathname, setInitialized]);
  return null;
}
