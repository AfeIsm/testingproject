import { FreeTimeBlock } from "@/lib/free-time/detector";
import { getAvailableRooms } from "@/lib/nebula/rooms";
import { Recommendation } from "./rules";
import { isBlockSuitableFor } from "./rules";

export async function matchRoomsToBlock(
  block: FreeTimeBlock,
  nearLocation?: string
): Promise<Recommendation[]> {
  if (!isBlockSuitableFor(block, "room")) return [];

  const rooms = await getAvailableRooms({ type: "study" });

  return rooms.slice(0, 3).map((room) => {
    const blockStart = new Date(block.startTs);
    const hour = blockStart.getHours();
    const min = blockStart.getMinutes();
    const startTime = `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`;

    return {
      id: `rec_room_${room.id}_${block.id}`,
      type: "room" as const,
      title: `Study at ${room.name}`,
      description: `${room.building} — Capacity: ${room.capacity}. Amenities: ${room.amenities.join(", ")}.`,
      location: `${room.building} ${room.roomNumber}`,
      startTime,
      endTime: "",
      score: nearLocation && room.building.toLowerCase().includes(nearLocation.toLowerCase()) ? 95 : 75,
      freeTimeBlockId: block.id,
      sourceId: room.id,
    };
  });
}