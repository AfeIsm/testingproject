import { nebulaRequest } from "./client";

export interface Room {
  id: string;
  building: string;
  roomNumber: string;
  name: string;
  capacity: number;
  type: "study" | "lab" | "classroom" | "lounge";
  amenities: string[];
  availableFrom: string;
  availableUntil: string;
  floor: number;
}

const MOCK_ROOMS: Room[] = [
  { id: "ecss-2415", building: "ECSS", roomNumber: "2.415", name: "ECSS Lab", capacity: 30, type: "lab", amenities: ["computers", "projector", "whiteboard"], availableFrom: "07:00", availableUntil: "22:00", floor: 2 },
  { id: "mc-study1", building: "McDermott Library", roomNumber: "SL1", name: "Silent Study Zone", capacity: 100, type: "study", amenities: ["wifi", "power outlets", "quiet"], availableFrom: "07:00", availableUntil: "02:00", floor: 1 },
  { id: "mc-collab1", building: "McDermott Library", roomNumber: "CL1", name: "Collaboration Room 1", capacity: 8, type: "study", amenities: ["whiteboard", "tv screen", "wifi"], availableFrom: "08:00", availableUntil: "22:00", floor: 2 },
  { id: "su-lonestar", building: "Student Union", roomNumber: "2.601", name: "Lonestar Ballroom", capacity: 200, type: "lounge", amenities: ["tables", "wifi", "food nearby"], availableFrom: "08:00", availableUntil: "21:00", floor: 2 },
  { id: "atec-lab", building: "ATEC", roomNumber: "1.502", name: "ATEC Computer Lab", capacity: 25, type: "lab", amenities: ["computers", "design software", "projector"], availableFrom: "08:00", availableUntil: "20:00", floor: 1 },
  { id: "som-study", building: "SOM", roomNumber: "1.107", name: "SOM Study Lounge", capacity: 40, type: "lounge", amenities: ["wifi", "power outlets", "whiteboards"], availableFrom: "07:00", availableUntil: "21:00", floor: 1 },
  { id: "rl-study", building: "Research & Learning Center", roomNumber: "3.204", name: "RLEC Study Room", capacity: 6, type: "study", amenities: ["whiteboard", "wifi", "monitor"], availableFrom: "08:00", availableUntil: "22:00", floor: 3 },
  { id: "ecsw-makerspace", building: "ECSW", roomNumber: "1.130", name: "Makerspace", capacity: 15, type: "lab", amenities: ["3D printers", "tools", "workbenches"], availableFrom: "09:00", availableUntil: "18:00", floor: 1 },
];

interface NebulaRoomRaw {
  _id?: string; id?: string; building?: string; room_number?: string;
  name?: string; capacity?: number; type?: string;
  amenities?: string[]; available_from?: string; available_until?: string; floor?: number;
}

export async function getAvailableRooms(params?: {
  building?: string;
  type?: string;
  minCapacity?: number;
}): Promise<Room[]> {
  try {
    const query = new URLSearchParams();
    if (params?.building) query.set("building", params.building);
    if (params?.type) query.set("type", params.type);

    const data = await nebulaRequest<{ data?: NebulaRoomRaw[] }>(`/v1/room?${query}`);
    const rooms = data.data ?? [];
    if (rooms.length === 0) throw new Error("empty");
    return rooms.map((r) => ({
      id: r._id ?? r.id ?? "",
      building: r.building ?? "",
      roomNumber: r.room_number ?? "",
      name: r.name ?? `${r.building} ${r.room_number}`,
      capacity: r.capacity ?? 20,
      type: (r.type as Room["type"]) ?? "study",
      amenities: r.amenities ?? [],
      availableFrom: r.available_from ?? "08:00",
      availableUntil: r.available_until ?? "22:00",
      floor: r.floor ?? 1,
    }));
  } catch {
    let results = [...MOCK_ROOMS];
    if (params?.building) {
      results = results.filter((r) =>
        r.building.toLowerCase().includes(params.building!.toLowerCase())
      );
    }
    if (params?.type) {
      results = results.filter((r) => r.type === params.type);
    }
    if (params?.minCapacity) {
      results = results.filter((r) => r.capacity >= params.minCapacity!);
    }
    return results;
  }
}

export function findNearbyRooms(location: string): Room[] {
  const loc = location.toLowerCase();
  const building = MOCK_ROOMS.find((r) =>
    r.building.toLowerCase().includes(loc) || loc.includes(r.building.toLowerCase().split(" ")[0])
  );
  if (building) {
    return MOCK_ROOMS.filter((r) => r.building === building.building);
  }
  return MOCK_ROOMS.slice(0, 3);
}