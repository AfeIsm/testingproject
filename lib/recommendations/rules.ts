import { FreeTimeBlock } from "@/lib/free-time/detector";

export type RecommendationType = "event" | "club" | "room" | "study" | "meal" | "break";

export interface Recommendation {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  score: number;
  freeTimeBlockId: string;
  sourceId?: string;
}

export function isBlockSuitableFor(
  block: FreeTimeBlock,
  type: RecommendationType
): boolean {
  const { classification, durationMin } = block;

  switch (type) {
    case "break":
      return durationMin >= 10 && durationMin < 30;
    case "meal":
      return (
        classification === "MEAL_WINDOW" ||
        (durationMin >= 45 && classification !== "MICRO_BREAK")
      );
    case "study":
      return (
        classification === "FOCUS_BLOCK" ||
        classification === "DEEP_WORK" ||
        durationMin >= 45
      );
    case "club":
      return durationMin >= 60 || classification === "FLEXIBLE_EVENING";
    case "event":
      return durationMin >= 60 || classification === "FLEXIBLE_EVENING";
    case "room":
      return durationMin >= 30;
    default:
      return true;
  }
}