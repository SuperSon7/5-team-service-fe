"use client";

import { initializeApp, getApps } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
  Messaging,
  MessagePayload,
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
  vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
};

function getApp() {
  return getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
}

export async function initMessaging() {
  const supported = await isSupported();
  if (!supported) return null;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;

  const swReg = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

  const app = getApp();
  const messaging = getMessaging(app);

  const token = await getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration: swReg,
  });

  return { messaging, token };
}

export function listenForeground(messaging: Messaging, handler: (payload: MessagePayload) => void) {
  console.log("Foreground listener attached");

  return onMessage(messaging, (payload) => {
    const title = payload?.notification?.title ?? "새 알림";
    const body = payload?.notification?.body ?? "";

    if (Notification.permission === "granted") {
      const n = new Notification(title, {
        body,
        data: payload?.data,
      });

      n.onclick = () => {
        const url = payload?.data?.url ?? "/notifications";
        window.focus();
        window.location.href = url;
        n.close();
      };
    }

    console.log("foreground push:", payload);
    handler(payload);
  });
}
