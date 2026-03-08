import { FreeTimeBlock } from "./detector";

export interface FormattedFreeBlock {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  label: string;
  color: string;
  emoji: string;
}

const CLASS_META: Record<string, { label: string; color: string; emoji: string }> = {
  MICRO_BREAK: { label: "Quick Break", color: "#94A3B8", emoji: "☕" },
  SHORT_BREAK: { label: "Short Break", color: "#60A5FA", emoji: "🧘" },
  FOCUS_BLOCK: { label: "Study Block", color: "#34D399", emoji: "📚" },
  DEEP_WORK: { label: "Deep Work", color: "#6366F1", emoji: "🎯" },
  MEAL_WINDOW: { label: "Meal Time", color: "#F59E0B", emoji: "🍽️" },
  FLEXIBLE_EVENING: { label: "Free Evening", color: "#EC4899", emoji: "🌙" },
  COMMUTE_ONLY: { label: "Transit Time", color: "#9CA3AF", emoji: "🚶" },
};

export function formatFreeBlock(block: FreeTimeBlock): FormattedFreeBlock {
  const start = new Date(block.startTs);
  const end = new Date(block.endTs);
  const meta = CLASS_META[block.classification] ?? CLASS_META["SHORT_BREAK"];

  return {
    id: block.id,
    day: start.toLocaleDateString("en-US", { weekday: "long" }),
    startTime: start.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    endTime: end.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    durationMinutes: block.durationMin,
    label: meta.label,
    color: meta.color,
    emoji: meta.emoji,
  };
}

export function formatAllFreeBlocks(blocks: FreeTimeBlock[]): FormattedFreeBlock[] {
  return blocks.map(formatFreeBlock);
}