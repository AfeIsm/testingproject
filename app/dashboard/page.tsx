import FreeTimeCard from "../../components/cards/FreeTimeCard";
import AssistantCard from "../../components/cards/AssistantCard";
import ScheduleGrid from "../../components/schedule/ScheduleGrid";
import AppShell from "../../components/layout/AppShell";

export default function DashboardPage() {
  return (
    <AppShell>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-slate-600">
          Plan classes, view free time, and get recommendations.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Weekly Schedule</h2>
          <p className="mt-2 text-sm text-slate-600">
            View your semester at a glance.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Free Time</h2>
          <p className="mt-2 text-sm text-slate-600">
            Find study blocks and open gaps.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Recommendations</h2>
          <p className="mt-2 text-sm text-slate-600">
            See suggested courses for next semester.
          </p>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="mb-4 text-xl font-semibold text-slate-900">Best Free Time Blocks</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <FreeTimeCard
            day="Tuesday"
            time="11:00 AM – 1:30 PM"
            description="2h 30m · Great study block"
          />
          <FreeTimeCard
            day="Thursday"
            time="3:00 PM – 6:00 PM"
            description="3h · Good for meetings or work"
          />
          <FreeTimeCard
            day="Friday"
            time="9:00 AM – 12:00 PM"
            description="3h · Open productivity block"
          />
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-xl font-semibold text-slate-900">Schedule Preview</h2>
          <ScheduleGrid />
        </div>

        <AssistantCard />
      </section>
    </AppShell>
  );
}