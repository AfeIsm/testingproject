import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { SavedActivity } from "@/lib/models/SavedActivity";
import { getSessionFromRequest } from "@/lib/auth/session";

// POST /api/events/save — save an activity/event to user's schedule
export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await request.json();
    const { type, title, description, location, startTime, endTime, sourceId, freeTimeBlockId } = body;

    if (!title || !type) {
      return NextResponse.json({ success: false, error: "title and type are required" }, { status: 400 });
    }

    const activity = await SavedActivity.create({
      userId: session.userId,
      type: type ?? "event",
      title,
      description: description ?? "",
      location: location ?? "",
      startTime: startTime ?? "",
      endTime: endTime ?? "",
      sourceId: sourceId ?? "",
      freeTimeBlockId: freeTimeBlockId ?? "",
    });

    return NextResponse.json({ success: true, data: activity }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to save activity" }, { status: 500 });
  }
}

// GET /api/events/save — get all saved activities
export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const activities = await SavedActivity.find({ userId: session.userId }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: activities });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to fetch saved activities" }, { status: 500 });
  }
}

// DELETE /api/events/save — delete a saved activity
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { activityId } = await request.json();
    await SavedActivity.findOneAndDelete({ _id: activityId, userId: session.userId });
    return NextResponse.json({ success: true, data: { message: "Activity removed" } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to delete activity" }, { status: 500 });
  }
}