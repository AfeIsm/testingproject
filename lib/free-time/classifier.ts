export type FreeTimeClass =
  | "MICRO_BREAK"
  | "SHORT_BREAK"
  | "FOCUS_BLOCK"
  | "DEEP_WORK"
  | "MEAL_WINDOW"
  | "FLEXIBLE_EVENING"
  | "COMMUTE_ONLY";

export function classifyFreeTimeBlock(
  startTs: string,
  durationMin: number,
  travelMin: number
): FreeTimeClass {

  const hour = new Date(startTs).getHours();

  if (durationMin < 20) return "MICRO_BREAK";

  if (travelMin > durationMin * 0.5) return "COMMUTE_ONLY";

  if (durationMin < 45) {
    if ((hour >= 11 && hour <= 13) ||
        (hour >= 17 && hour <= 19)) {
      return "MEAL_WINDOW";
    }
    return "SHORT_BREAK";
  }

  if (durationMin < 90) return "FOCUS_BLOCK";

  if (hour >= 18) return "FLEXIBLE_EVENING";

  return "DEEP_WORK";
}