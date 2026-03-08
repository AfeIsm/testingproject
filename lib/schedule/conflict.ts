import { CourseSection } from "@/lib/nebula/courses";
import { timeToMinutes } from "@/lib/nebula/helpers";

export function sectionsConflict(a: CourseSection, b: CourseSection): boolean {
  const sharedDays = a.days.some((d) => b.days.includes(d));
  if (!sharedDays) return false;

  const aStart = timeToMinutes(a.startTime);
  const aEnd = timeToMinutes(a.endTime);
  const bStart = timeToMinutes(b.startTime);
  const bEnd = timeToMinutes(b.endTime);

  return aStart < bEnd && bStart < aEnd;
}

export function hasConflict(sections: CourseSection[]): boolean {
  for (let i = 0; i < sections.length; i++) {
    for (let j = i + 1; j < sections.length; j++) {
      if (sectionsConflict(sections[i], sections[j])) return true;
    }
  }
  return false;
}

export function findConflictingPairs(sections: CourseSection[]): [CourseSection, CourseSection][] {
  const pairs: [CourseSection, CourseSection][] = [];
  for (let i = 0; i < sections.length; i++) {
    for (let j = i + 1; j < sections.length; j++) {
      if (sectionsConflict(sections[i], sections[j])) {
        pairs.push([sections[i], sections[j]]);
      }
    }
  }
  return pairs;
}