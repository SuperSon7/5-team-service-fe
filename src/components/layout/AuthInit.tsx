"use client";

import { refreshAccessToken } from "@/lib/auth/refreshAccessToken";
import { authStore } from "@/stores/authStore";
import { useEffect } from "react";

export default function AuthInit() {
  useEffect(() => {
    if (!authStore.getAccessToken()) {
      refreshAccessToken().catch(() => {});
    }
  }, []);
  return null;
}
