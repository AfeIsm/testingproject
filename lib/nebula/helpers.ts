export function parseCourseCode(code: string): { subject: string; catalogNumber: string } | null {
  const match = code.trim().match(/^([A-Z]{2,4})\s*(\d{4}[A-Z]?)$/i);
  if (!match) return null;
  return {
    subject: match[1].toUpperCase(),
    catalogNumber: match[2].toUpperCase(),
  };
}

export function formatTimeSlot(startTime: string, endTime: string, days: string[]): string {
  const dayAbbr = days.map((d) => d.slice(0, 3)).join("/");
  return `${dayAbbr} ${startTime}–${endTime}`;
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + (m || 0);
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function isTimeWithinRange(
  time: string,
  rangeStart: string,
  rangeEnd: string
): boolean {
  const t = timeToMinutes(time);
  const s = timeToMinutes(rangeStart);
  const e = timeToMinutes(rangeEnd);
  return t >= s && t <= e;
}