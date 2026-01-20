import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/app/providers";
import AppShell from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "독토리 - 독서토론마을",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-dvh bg-gray-100 lg:overflow-hidden">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
