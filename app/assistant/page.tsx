import AppShell from "../../components/layout/AppShell";

export default function AssistantPage() {
  return (
    <AppShell>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Assistant</h1>
        <p className="mt-2 text-slate-600">
          Ask CometFlow about schedules, free time, and course planning.
        </p>
      </header>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div className="max-w-xl rounded-2xl bg-slate-100 p-4 text-slate-800">
            What should I take next semester?
          </div>

          <div className="max-w-xl rounded-2xl bg-slate-900 p-4 text-white">
            Based on your progress, I recommend CS 3345 and MATH 2418.
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 p-4 text-sm text-slate-500">
          Type your question here...
        </div>
      </section>
    </AppShell>
  );
}