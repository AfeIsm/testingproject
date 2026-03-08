import { FreeTimeBlock } from "@/lib/free-time/detector";
import { Recommendation } from "./rules";

interface EventSource {
  id: string;
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  category?: string;
}

const MOCK_CAMPUS_EVENTS: EventSource[] = [
  { id: "evt1", title: "Tech Talk: AI in Production", description: "Industry professionals discuss real-world AI applications.", location: "ECSS 2.415", startTime: "12:00", endTime: "13:00", category: "tech" },
  { id: "evt2", title: "Career Fair Prep Workshop", description: "Resume reviews and interview tips from Career Center staff.", location: "Student Union 2.601", startTime: "14:00", endTime: "16:00", category: "career" },
  { id: "evt3", title: "Meditation & Mindfulness", description: "Free guided meditation session open to all students.", location: "Wellness Center", startTime: "12:00", endTime: "12:30", category: "wellness" },
  { id: "evt4", title: "UTD Robotics Demo Day", description: "Watch student teams demonstrate their semester projects.", location: "ECSW 1.130", startTime: "15:00", endTime: "17:00", category: "engineering" },
  { id: "evt5", title: "Hackathon Kickoff: HackUTD", description: "Opening ceremony and team formation for the annual hackathon.", location: "Activity Center", startTime: "18:00", endTime: "20:00", category: "tech" },
  { id: "evt6", title: "International Food Festival", description: "Enjoy dishes from around the world prepared by student orgs.", location: "Plinth", startTime: "11:00", endTime: "14:00", category: "food" },
  { id: "evt7", title: "Research Symposium", description: "UTD undergrad and grad students present research findings.", location: "SOM 1.107", startTime: "10:00", endTime: "13:00", category: "academic" },
  { id: "evt8", title: "Game Night at SU", description: "Board games and video games — free entry for UTD students.", location: "Student Union Game Room", startTime: "19:00", endTime: "22:00", category: "social" },
];

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + (m || 0);
}

export function matchEventsToBlock(
  block: FreeTimeBlock,
  events: EventSource[] = MOCK_CAMPUS_EVENTS
): Recommendation[] {
  const blockStart = new Date(block.startTs);
  const blockHour = blockStart.getHours();
  const blockMin = blockHour * 60 + blockStart.getMinutes();

  return events
    .filter((e) => {
      const eStart = timeToMinutes(e.startTime);
      const eEnd = timeToMinutes(e.endTime);
      const duration = eEnd - eStart;
      // Event must fit within the free block
      return eStart >= blockMin && duration <= block.durationMin;
    })
    .map((e) => ({
      id: `rec_event_${e.id}_${block.id}`,
      type: "event" as const,
      title: e.title,
      description: e.description,
      location: e.location,
      startTime: e.startTime,
      endTime: e.endTime,
      score: 80,
      freeTimeBlockId: block.id,
      sourceId: e.id,
    }));
}

export { MOCK_CAMPUS_EVENTS };