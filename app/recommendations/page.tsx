import AppShell from "../../components/layout/AppShell";

export default function RecommendationsPage() {
  return (
    <AppShell>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Recommendations</h1>
        <p className="mt-2 text-slate-600">
          Suggested courses based on your progress and interests.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">CS 3345</h2>
          <p className="mt-1 text-sm text-slate-600">
            Data Structures and Algorithms
          </p>
          <p className="mt-3 text-sm text-slate-500">
            Recommended because it unlocks many upper-level CS courses.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">MATH 2418</h2>
          <p className="mt-1 text-sm text-slate-600">
            Linear Algebra
          </p>
          <p className="mt-3 text-sm text-slate-500">
            Important for machine learning and advanced computing courses.
          </p>
        </div>
      </section>
    </AppShell>
  );
}