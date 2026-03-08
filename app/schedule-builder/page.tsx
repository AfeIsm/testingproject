"use client";

import { useMemo, useState } from "react";
import AppShell from "../../components/layout/AppShell";
import ScheduleGrid from "../../components/schedule/ScheduleGrid";
import { mockCourses } from "../../data/mockCourses";

type Course = {
  code: string;
  title: string;
  day: string;
  time: string;
};

export default function ScheduleBuilderPage() {
  const [search, setSearch] = useState("");
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);

  const filteredCourses = useMemo(() => {
    return mockCourses.filter((course) =>
      `${course.code} ${course.title}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  function handleAddCourse(course: Course) {
  const alreadyAdded = selectedCourses.some(
    (selected) => selected.code === course.code
  );

  if (alreadyAdded) return;

  const conflict = selectedCourses.some(
    (selected) =>
      selected.day === course.day && selected.time === course.time
  );

  if (conflict) {
    alert("Schedule conflict! Another course is already at this time.");
    return;
  }

  setSelectedCourses([...selectedCourses, course]);
}

  function handleRemoveCourse(courseCode: string) {
    setSelectedCourses(
      selectedCourses.filter((course) => course.code !== courseCode)
    );
  }

  return (
    <AppShell>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Schedule Builder</h1>
        <p className="mt-2 text-slate-600">
          Search courses, compare options, and build your semester.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Course Search</h2>

          <input
            type="text"
            placeholder="Search for CS 3345, MATH 2418..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-4 w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-700 outline-none focus:border-slate-400"
          />

          <div className="mt-4 space-y-3">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <div
                  key={course.code}
                  className="rounded-xl bg-slate-50 p-4"
                >
                  <p className="font-semibold text-slate-900">{course.code}</p>
                  <p className="text-sm text-slate-600">{course.title}</p>

                  <button
                    onClick={() => handleAddCourse(course)}
                    className="mt-3 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white"
                  >
                    Add Course
                  </button>
                </div>
              ))
            ) : (
              <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                No matching courses found.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900">Weekly Schedule</h2>
          <ScheduleGrid courses={selectedCourses} />
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Selected Courses</h2>

          <div className="mt-4 space-y-3">
            {selectedCourses.length > 0 ? (
              selectedCourses.map((course) => (
                <div key={course.code} className="rounded-xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">{course.code}</p>
                  <p className="text-sm text-slate-600">{course.title}</p>

                  <button
                    onClick={() => handleRemoveCourse(course.code)}
                    className="mt-3 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                No courses selected yet.
              </div>
            )}
          </div>
        </div>
      </section>
    </AppShell>
  );
}