import { CourseSection } from "@/lib/nebula/courses";
import { hasConflict } from "./conflict";
import { scoreSchedule, ScoredSchedule } from "./scorer";
import { IPreferences } from "@/lib/models/Profile";

export interface ScheduleOption {
  id: string;
  label: string;
  score: number;
  reasons: string[];
  classes: CourseSection[];
}

// Generate all valid combinations of one section per course
function* generateCombinations(
  sectionsByCourse: CourseSection[][]
): Generator<CourseSection[]> {
  if (sectionsByCourse.length === 0) {
    yield [];
    return;
  }
  const [first, ...rest] = sectionsByCourse;
  for (const combo of generateCombinations(rest)) {
    for (const section of first) {
      yield [section, ...combo];
    }
  }
}

export function generateScheduleOptions(
  sectionsByCourse: CourseSection[][],
  preferences: Partial<IPreferences>,
  maxOptions = 5
): ScheduleOption[] {
  const scored: ScoredSchedule[] = [];

  for (const combo of generateCombinations(sectionsByCourse)) {
    if (hasConflict(combo)) continue;
    const result = scoreSchedule(combo, preferences);
    scored.push(result);
    // Cap at 500 valid combos before scoring to avoid performance issues
    if (scored.length >= 500) break;
  }

  // Sort by score descending and take top N
  scored.sort((a, b) => b.score - a.score);

  const labels = ["Option A", "Option B", "Option C", "Option D", "Option E"];

  return scored.slice(0, maxOptions).map((s, i) => ({
    id: `schedule_${i + 1}`,
    label: labels[i] ?? `Option ${i + 1}`,
    score: s.score,
    reasons: s.reasons,
    classes: s.sections,
  }));
}

// Fallback: generate options from flat list by picking non-conflicting sections
export function generateFromFlatSections(
  sections: CourseSection[],
  preferences: Partial<IPreferences>
): ScheduleOption[] {
  // Group by course code
  const byCourse: Record<string, CourseSection[]> = {};
  for (const s of sections) {
    const key = `${s.subject} ${s.catalogNumber}`;
    if (!byCourse[key]) byCourse[key] = [];
    byCourse[key].push(s);
  }
  return generateScheduleOptions(Object.values(byCourse), preferences);
}