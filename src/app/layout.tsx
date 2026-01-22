import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/app/providers";
import AppShell from "@/components/layout/AppShell";
import localFont from "next/font/local";

export const metadata: Metadata = {
  title: "독토리 - 독서토론마을",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const myFont = localFont({
  src: [
    { path: "../assets/fonts/Pretendard-Regular.woff2", weight: "400", style: "normal" },
    { path: "../assets/fonts/Pretendard-Medium.woff2", weight: "500", style: "normal" },
    { path: "../assets/fonts/Pretendard-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../assets/fonts/Pretendard-Bold.woff2", weight: "700", style: "normal" },
    { path: "../assets/fonts/Pretendard-ExtraBold.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-my",
  preload: true,
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={myFont.variable}>
      <body className={`${myFont.className} min-h-dvh bg-gray-100 lg:overflow-hidden`}>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
