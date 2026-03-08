type Course = {
  code: string;
  title: string;
  day?: string;
  time?: string;
};

export default function ScheduleGrid({ courses = [] }: { courses?: Course[] }) {
  const times = ["8:00 AM", "10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM"];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
      <div className="grid grid-cols-6 bg-slate-50 text-sm font-medium text-slate-600">
        <div className="border-b border-r border-slate-200 p-3">Time</div>
        {days.map((day) => (
          <div key={day} className="border-b border-r border-slate-200 p-3 text-center">
            {day}
          </div>
        ))}
      </div>

      {times.map((time) => (
        <div key={time} className="grid grid-cols-6 text-sm">
          <div className="border-r border-b border-slate-200 bg-white p-3 font-medium text-slate-500">
            {time}
          </div>

          {days.map((day) => {
            const course = courses.find(
              (c) => c.day === day && c.time === time
            );

            return (
              <div key={day} className="border-r border-b border-slate-200 p-2">
                {course && (
                  <div className="rounded-xl bg-blue-100 p-2 text-xs font-semibold text-blue-900">
                    {course.code}
                    <div className="mt-1 font-normal text-blue-800">
                      {course.title}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}