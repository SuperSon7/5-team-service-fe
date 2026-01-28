"use client";

import { refreshAccessToken } from "@/lib/auth/refreshAccessToken";
import { authStore } from "@/stores/authStore";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AuthInit() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/oauth")) {
      return;
    }
    if (!authStore.getAccessToken()) {
      refreshAccessToken().catch(() => {});
    }
  }, [pathname]);
  return null;
}
