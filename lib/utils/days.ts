export function normalizeDayName(day: string): string {
  const map: Record<string, string> = {
    M: "Mon", T: "Tue", W: "Wed", R: "Thu", F: "Fri",
    Mon: "Mon", Tue: "Tue", Wed: "Wed", Thu: "Thu", Fri: "Fri",
    Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed", Thursday: "Thu", Friday: "Fri",
  };
  return map[day] ?? day;
}

export function getDayIndex(day: string): number {
  const order = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return order.indexOf(normalizeDayName(day));
}

export function sortDays(days: string[]): string[] {
  return [...days].sort((a, b) => getDayIndex(a) - getDayIndex(b));
}