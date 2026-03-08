import { FreeTimeBlock } from "@/lib/free-time/detector";
import { Recommendation, isBlockSuitableFor } from "./rules";
import { matchEventsToBlock } from "./eventMatcher";
import { matchClubsToBlock } from "./clubMatcher";
import { matchRoomsToBlock } from "./roomMatcher";
import { rankRecommendations, deduplicateRecommendations } from "./ranker";

export interface RecommendationContext {
  interests?: string[];
  preferStudy?: boolean;
  preferSocial?: boolean;
  lastLocation?: string;
}

export async function generateRecommendations(
  block: FreeTimeBlock,
  context: RecommendationContext = {}
): Promise<Recommendation[]> {
  const all: Recommendation[] = [];

  // Always try to match events
  const events = matchEventsToBlock(block);
  all.push(...events);

  // Add study/room recommendations for longer blocks
  if (isBlockSuitableFor(block, "room")) {
    const rooms = await matchRoomsToBlock(block, context.lastLocation);
    all.push(...rooms);
  }

  // Add club suggestions for evening/long blocks
  if (isBlockSuitableFor(block, "club")) {
    const clubs = await matchClubsToBlock(block, context.interests ?? []);
    all.push(...clubs);
  }

  // Add a generic study recommendation
  if (isBlockSuitableFor(block, "study") && block.durationMin >= 45) {
    all.push({
      id: `rec_study_${block.id}`,
      type: "study",
      title: "Focused Study Session",
      description: `Use this ${block.durationMin}-minute block to review notes, work on assignments, or prepare for upcoming exams.`,
      location: "McDermott Library",
      startTime: "",
      endTime: "",
      score: 85,
      freeTimeBlockId: block.id,
    });
  }

  // Add meal suggestion
  if (isBlockSuitableFor(block, "meal")) {
    all.push({
      id: `rec_meal_${block.id}`,
      type: "meal",
      title: "Lunch / Meal Break",
      description: "Great time to grab a meal at Dining Hall West, Chick-fil-A, or Starbucks on campus.",
      location: "Dining Hall / Food Court",
      startTime: "",
      endTime: "",
      score: 80,
      freeTimeBlockId: block.id,
    });
  }

  const ranked = rankRecommendations(all, {
    preferStudy: context.preferStudy,
    preferSocial: context.preferSocial,
  });

  return deduplicateRecommendations(ranked).slice(0, 5);
}

export async function generateAllRecommendations(
  blocks: FreeTimeBlock[],
  context: RecommendationContext = {}
): Promise<Record<string, Recommendation[]>> {
  const result: Record<string, Recommendation[]> = {};
  for (const block of blocks) {
    result[block.id] = await generateRecommendations(block, context);
  }
  return result;
}