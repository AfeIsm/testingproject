import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Event } from "@/lib/models/Event";
import { getSessionFromRequest } from "@/lib/auth/session";

// GET /api/events
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const filter: Record<string, unknown> = { isActive: true };
    if (category) filter.category = category;

    const events = await Event.find(filter).sort({ startTime: 1 }).limit(50);
    return NextResponse.json({ success: true, data: events });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to fetch events" }, { status: 500 });
  }
}

// POST /api/events — create an event (admin or organizer)
export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await request.json();

    const { title, category, location, startTime, endTime, description } = body;
    if (!title || !startTime || !endTime) {
      return NextResponse.json({ success: false, error: "title, startTime, and endTime are required" }, { status: 400 });
    }

    const event = await Event.create({
      title,
      category: category ?? "general",
      location: location ?? "",
      startTime,
      endTime,
      description: description ?? "",
      organizerId: session.userId,
    });

    return NextResponse.json({ success: true, data: event }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to create event" }, { status: 500 });
  }
}