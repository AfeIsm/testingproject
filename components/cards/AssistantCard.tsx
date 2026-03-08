export default function AssistantCard() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Assistant</h2>
      <p className="mt-2 text-sm text-slate-600">
        Ask CometFlow what classes to take.
      </p>
      <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
        “What should I take next semester?”
      </div>
    </div>
  );
}