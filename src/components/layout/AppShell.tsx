export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-gray-100">
      <main className="mx-auto min-h-dvh w-full max-w-[500px] bg-white shadow-lg">
        <div className="min-h-dvh pb-[env(safe-area-inset-bottom)]">{children}</div>
      </main>
    </div>
  );
}
