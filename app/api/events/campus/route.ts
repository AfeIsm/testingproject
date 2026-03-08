import { NextRequest, NextResponse } from "next/server";
import { MOCK_CAMPUS_EVENTS } from "@/lib/recommendations/eventMatcher";

// GET /api/events/campus?category=tech&date=2025-09-15
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let events = [...MOCK_CAMPUS_EVENTS];
    if (category) {
      events = events.filter((e) => e.category?.toLowerCase() === category.toLowerCase());
    }

    return NextResponse.json({ success: true, data: events });
  } catch (error) {
    console.error("Campus events error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch campus events" }, { status: 500 });
  }
}