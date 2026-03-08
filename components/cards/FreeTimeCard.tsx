type FreeTimeCardProps = {
  day: string;
  time: string;
  description: string;
};

export default function FreeTimeCard({
  day,
  time,
  description,
}: FreeTimeCardProps) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{day}</p>
      <h3 className="mt-1 text-lg font-semibold text-slate-900">{time}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </div>
  );
}