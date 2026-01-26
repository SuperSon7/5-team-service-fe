import BottomNav from "@/components/layout/BottomNav";
import { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">{children}</div>
      <div className="shrink-0">
        <Suspense fallback={null}>
          <BottomNav />
        </Suspense>
      </div>
    </div>
  );
}
