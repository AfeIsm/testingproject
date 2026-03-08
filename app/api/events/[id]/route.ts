import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Event } from "@/lib/models/Event";
import { getSessionFromRequest } from "@/lib/auth/session";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const event = await Event.findById(params.id);
    if (!event) return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to fetch event" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const event = await Event.findOneAndDelete({ _id: params.id, organizerId: session.userId });
    if (!event) return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: { message: "Event deleted" } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to delete event" }, { status: 500 });
  }
}