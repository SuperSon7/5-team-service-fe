import BottomNav from "@/components/layout/BottomNav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="flex-1 overflow-y-auto">{children}</div>
      <div className="shrink-0">
        <BottomNav />
      </div>
    </div>
  );
}
