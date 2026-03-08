import { FreeTimeBlock } from "@/lib/free-time/detector";
import { Club, searchClubs } from "@/lib/nebula/clubs";
import { Recommendation } from "./rules";
import { isBlockSuitableFor } from "./rules";

export async function matchClubsToBlock(
  block: FreeTimeBlock,
  interests: string[] = []
): Promise<Recommendation[]> {
  if (!isBlockSuitableFor(block, "club")) return [];

  let clubs: Club[];
  try {
    clubs = interests.length > 0
      ? await searchClubs(interests[0])
      : await searchClubs();
  } catch {
    clubs = [];
  }

  return clubs.slice(0, 3).map((club) => ({
    id: `rec_club_${club.id}_${block.id}`,
    type: "club" as const,
    title: `Join: ${club.name}`,
    description: `${club.description} Meets: ${club.meetingTime}`,
    location: club.location,
    startTime: club.meetingTime.split(" ").pop() ?? "",
    endTime: "",
    score: interests.some((i) =>
      club.tags.some((t) => t.toLowerCase().includes(i.toLowerCase()))
    )
      ? 90
      : 70,
    freeTimeBlockId: block.id,
    sourceId: club.id,
  }));
}