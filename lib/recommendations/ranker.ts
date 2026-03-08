import { Recommendation } from "./rules";

export function rankRecommendations(
  recommendations: Recommendation[],
  preferences?: { preferStudy?: boolean; preferSocial?: boolean }
): Recommendation[] {
  return recommendations
    .map((rec) => {
      let boost = 0;
      if (preferences?.preferStudy && (rec.type === "study" || rec.type === "room")) boost += 15;
      if (preferences?.preferSocial && (rec.type === "club" || rec.type === "event")) boost += 15;
      return { ...rec, score: Math.min(100, rec.score + boost) };
    })
    .sort((a, b) => b.score - a.score);
}

export function deduplicateRecommendations(
  recommendations: Recommendation[]
): Recommendation[] {
  const seen = new Set<string>();
  return recommendations.filter((r) => {
    const key = `${r.type}:${r.title}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}