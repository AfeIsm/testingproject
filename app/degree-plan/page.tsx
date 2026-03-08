import AppShell from "../../components/layout/AppShell";

export default function DegreePlanPage() {
  return (
    <AppShell>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Degree Plan</h1>
        <p className="mt-2 text-slate-600">
          Track your progress toward completing your degree.
        </p>
      </header>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Progress Overview</h2>

        <div className="mt-4">
          <div className="h-3 w-full rounded-full bg-slate-200">
            <div className="h-3 w-1/2 rounded-full bg-slate-900"></div>
          </div>
          <p className="mt-2 text-sm text-slate-600">60 / 120 credits completed</p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="font-semibold text-slate-900">Completed</p>
            <p className="text-sm text-slate-600">Core CS courses</p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="font-semibold text-slate-900">Remaining</p>
            <p className="text-sm text-slate-600">Advanced electives</p>
          </div>
        </div>
      </section>
    </AppShell>
  );
}