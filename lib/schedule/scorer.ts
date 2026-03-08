import { CourseSection } from "@/lib/nebula/courses";
import { timeToMinutes } from "@/lib/nebula/helpers";
import { IPreferences } from "@/lib/models/Profile";

export interface ScoredSchedule {
  sections: CourseSection[];
  score: number;
  reasons: string[];
}

export function scoreSchedule(
  sections: CourseSection[],
  preferences: Partial<IPreferences>
): ScoredSchedule {
  let score = 100;
  const reasons: string[] = [];

  const earliest = preferences.earliestClass ?? "08:00";
  const latest = preferences.latestClass ?? "20:00";
  const maxPerDay = preferences.maxClassesPerDay ?? 3;

  const earliestMin = timeToMinutes(earliest);
  const latestMin = timeToMinutes(latest);

  // Penalize early classes if preference is not morning
  if (!preferences.preferMorning) {
    for (const s of sections) {
      if (timeToMinutes(s.startTime) < earliestMin) {
        score -= 15;
        reasons.push(`${s.courseCode} starts before preferred earliest time`);
      }
    }
  } else {
    // Reward morning classes
    for (const s of sections) {
      if (timeToMinutes(s.startTime) <= 10 * 60) {
        score += 5;
      }
    }
  }

  // Penalize late classes
  for (const s of sections) {
    if (timeToMinutes(s.endTime) > latestMin) {
      score -= 10;
      reasons.push(`${s.courseCode} ends after preferred latest time`);
    }
  }

  // Count classes per day
  const classesByDay: Record<string, number> = {};
  for (const s of sections) {
    for (const day of s.days) {
      classesByDay[day] = (classesByDay[day] ?? 0) + 1;
    }
  }
  const maxDay = Math.max(...Object.values(classesByDay), 0);
  if (maxDay > maxPerDay) {
    score -= (maxDay - maxPerDay) * 10;
    reasons.push(`Some days have ${maxDay} classes (preference: max ${maxPerDay})`);
  }

  // Reward compact schedule (fewer unique days)
  if (preferences.preferCompact) {
    const uniqueDays = Object.keys(classesByDay).length;
    if (uniqueDays <= 3) {
      score += 20;
      reasons.push("Compact schedule with classes on fewer days");
    }
  }

  // Reward reasonable gaps (not too long, not too short)
  const dayGroups = groupByDay(sections);
  let totalGapMinutes = 0;
  for (const daySections of Object.values(dayGroups)) {
    const sorted = daySections.sort(
      (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
    );
    for (let i = 0; i < sorted.length - 1; i++) {
      const gap = timeToMinutes(sorted[i + 1].startTime) - timeToMinutes(sorted[i].endTime);
      totalGapMinutes += gap;
      if (gap >= 60 && gap <= 120) {
        score += 5; // Good gap for studying/eating
        reasons.push("Good study gap between classes");
      } else if (gap > 180) {
        score -= 5; // Too long of a gap
      }
    }
  }

  if (totalGapMinutes === 0 && sections.length > 1) {
    reasons.push("Back-to-back efficient schedule");
    score += 10;
  }

  // Reward high-availability sections
  const avgAvailability =
    sections.reduce((sum, s) => {
      const pct = s.maxEnrollment > 0
        ? (s.maxEnrollment - s.currentEnrollment) / s.maxEnrollment
        : 0.5;
      return sum + pct;
    }, 0) / (sections.length || 1);
  if (avgAvailability > 0.3) {
    score += 10;
    reasons.push("Sections have good availability");
  }

  if (reasons.length === 0) {
    reasons.push("Well-balanced schedule meeting all preferences");
  }

  return { sections, score: Math.max(0, Math.min(100, score)), reasons };
}

function groupByDay(sections: CourseSection[]): Record<string, CourseSection[]> {
  const groups: Record<string, CourseSection[]> = {};
  for (const s of sections) {
    for (const day of s.days) {
      if (!groups[day]) groups[day] = [];
      groups[day].push(s);
    }
  }
  return groups;
}