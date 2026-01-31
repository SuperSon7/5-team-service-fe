importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDSK1dvXPqNNGdey4_W7dRs8PV11Zkuix4",
  authDomain: "doktori-63358.firebaseapp.com",
  projectId: "doktori-63358",
  storageBucket: "doktori-63358.firebasestorage.app",
  messagingSenderId: "327001914326",
  appId: "1:327001914326:web:a5038bd3f4e39407914277",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload?.notification?.title ?? "새 알림";
  const options = {
    body: payload?.notification?.body ?? "",
    data: payload?.data ?? {},
  };

  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification?.data?.url || "/notifications";
  event.waitUntil(clients.openWindow(url));
});
