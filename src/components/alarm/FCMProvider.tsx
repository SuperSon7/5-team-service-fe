"use client";

import { useEffect, useRef } from "react";
import type { MessagePayload } from "firebase/messaging";

import { initMessaging, listenForeground } from "@/lib/firebase";
import { apiFetch } from "@/lib/api/apiFetch";
import { useAuthStore } from "@/stores/authStore";

type Unsubscribe = () => void;

export default function FCMProvider(): null {
  const accessToken = useAuthStore((s) => s.accessToken);
  const initialized = useAuthStore((s) => s.initialized);

  const unsubscribeRef = useRef<Unsubscribe | null>(null);
  const lastSentTokenRef = useRef<string | null>(null);
  const storageKeyRef = useRef("fcm:pushToken");

  const readStoredToken = () => {
    if (typeof window === "undefined") return null;
    try {
      return window.localStorage.getItem(storageKeyRef.current);
    } catch {
      return null;
    }
  };

  const writeStoredToken = (token: string) => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(storageKeyRef.current, token);
    } catch {
      //Ignore
    }
  };

  useEffect(() => {
    if (!initialized) return;

    if (!accessToken) {
      unsubscribeRef.current?.();
      unsubscribeRef.current = null;
      return;
    }

    let cancelled = false;

    const run = async () => {
      try {
        if (lastSentTokenRef.current === null) {
          lastSentTokenRef.current = readStoredToken();
        }

        const res = await initMessaging();
        if (!res || cancelled) return;

        const { messaging, token } = res;

        if (lastSentTokenRef.current !== token) {
          await apiFetch("/notifications/push-token", {
            method: "POST",
            body: JSON.stringify({ token, platform: "WEB" }),
          });
          lastSentTokenRef.current = token;
          writeStoredToken(token);
        }

        if (cancelled) return;

        unsubscribeRef.current = listenForeground(messaging, (payload: MessagePayload) => {
          console.log("foreground push:", payload);
        });
      } catch (e) {
        console.error("[FCMProvider] init/register failed:", e);
      }
    };

    void run();

    return () => {
      cancelled = true;
      unsubscribeRef.current?.();
      unsubscribeRef.current = null;
    };
  }, [initialized, accessToken]);

  return null;
}
