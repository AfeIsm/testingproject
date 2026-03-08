import Sidebar from "./Sidebar";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto flex max-w-7xl gap-6">
        <Sidebar />
        <div className="flex-1">{children}</div>
      </div>
    </main>
  );
}