export function minutesBetween(start: string, end: string): number {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();

  return Math.max(0, Math.round((e - s) / 60000));
}

export function overlaps(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string
): boolean {
  return new Date(aStart) < new Date(bEnd) &&
         new Date(bStart) < new Date(aEnd);
}

export function sortByStartTime<T extends { startTs: string }>(
  items: T[]
): T[] {
  return [...items].sort(
    (a, b) =>
      new Date(a.startTs).getTime() -
      new Date(b.startTs).getTime()
  );
}