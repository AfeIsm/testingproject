import { ScheduleItem } from "@/lib/nebula/calendar";
import { minutesBetween } from "@/lib/utils/time";
import { estimateWalkingTime } from "@/lib/schedule/walking";
import { classifyFreeTimeBlock } from "./classifier";

export interface FreeTimeBlock {
  id: string;
  startTs: string;
  endTs: string;
  durationMin: number;
  classification: string;
}

export function detectFreeTimeBlocks(
  schedule: ScheduleItem[]
): FreeTimeBlock[] {

  const freeBlocks: FreeTimeBlock[] = [];

  const sorted = [...schedule].sort(
    (a, b) =>
      new Date(a.startTs).getTime() -
      new Date(b.startTs).getTime()
  );

  for (let i = 0; i < sorted.length - 1; i++) {

    const prev = sorted[i];
    const next = sorted[i + 1];

    const rawGap = minutesBetween(prev.endTs, next.startTs);

    const walk = estimateWalkingTime(prev.location, next.location);

    const usable = rawGap - walk - 5;

    if (usable < 10) continue;

    freeBlocks.push({
      id: `ft_${i}`,
      startTs: prev.endTs,
      endTs: next.startTs,
      durationMin: usable,
      classification: classifyFreeTimeBlock(
        prev.endTs,
        usable,
        walk
      ),
    });
  }

  return freeBlocks;
}