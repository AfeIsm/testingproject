import { NextRequest, NextResponse } from "next/server";
import { getAvailableRooms } from "@/lib/nebula/rooms";

// GET /api/rooms?building=ECSS&type=study&minCapacity=10
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const building = searchParams.get("building") ?? undefined;
    const type = searchParams.get("type") as "study" | "lab" | "classroom" | "lounge" | undefined;
    const minCapacity = searchParams.get("minCapacity")
      ? Number(searchParams.get("minCapacity"))
      : undefined;

    const rooms = await getAvailableRooms({ building, type, minCapacity });
    return NextResponse.json({ success: true, data: rooms });
  } catch (error) {
    console.error("Rooms error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch rooms" }, { status: 500 });
  }
}