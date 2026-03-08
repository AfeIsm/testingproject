import { CourseSection } from "@/lib/nebula/courses";
import { ScheduleOption } from "./generator";

export interface FormattedClass {
  courseCode: string;
  section: string;
  professor: string;
  days: string[];
  startTime: string;
  endTime: string;
  location: string;
}

export function formatScheduleOption(option: ScheduleOption) {
  return {
    id: option.id,
    label: option.label,
    score: option.score,
    reasons: option.reasons,
    classes: option.classes.map(formatClass),
  };
}

export function formatClass(section: CourseSection): FormattedClass {
  return {
    courseCode: section.courseCode,
    section: section.sectionNumber,
    professor: section.professor,
    days: section.days,
    startTime: section.startTime,
    endTime: section.endTime,
    location: section.location,
  };
}

export function scheduleToCalendarItems(classes: CourseSection[]) {
  return classes.map((c) => ({
    id: c.id,
    title: c.courseCode,
    days: c.days,
    startTime: c.startTime,
    endTime: c.endTime,
    location: c.location,
    professor: c.professor,
    color: stringToColor(c.courseCode),
  }));
}

function stringToColor(str: string): string {
  const colors = [
    "#3B82F6", "#10B981", "#F59E0B", "#EF4444",
    "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16",
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}