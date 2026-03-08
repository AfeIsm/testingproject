import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { ScheduleOption } from "@/lib/models/ScheduleOption";
import { SelectedSchedule } from "@/lib/models/SelectedSchedule";
import { getSessionFromRequest } from "@/lib/auth/session";

// POST /api/schedule/save — select/save a schedule option
export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { scheduleOptionId, semester } = await request.json();

    if (!scheduleOptionId) {
      return NextResponse.json({ success: false, error: "scheduleOptionId is required" }, { status: 400 });
    }

    const option = await ScheduleOption.findOne({
      _id: scheduleOptionId,
      userId: session.userId,
    });

    if (!option) {
      return NextResponse.json({ success: false, error: "Schedule option not found" }, { status: 404 });
    }

    // Mark only this one as selected
    await ScheduleOption.updateMany({ userId: session.userId }, { $set: { isSelected: false } });
    await ScheduleOption.findByIdAndUpdate(scheduleOptionId, { $set: { isSelected: true } });

    // Save/update selected schedule
    const selected = await SelectedSchedule.findOneAndUpdate(
      { userId: session.userId },
      {
        userId: session.userId,
        scheduleOptionId,
        semester: semester ?? option.semester,
        classes: option.classes,
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, data: selected });
  } catch (error) {
    console.error("Schedule save error:", error);
    return NextResponse.json({ success: false, error: "Failed to save schedule" }, { status: 500 });
  }
}

// GET /api/schedule/save — get all saved schedule options
export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const options = await ScheduleOption.find({ userId: session.userId }).sort({ score: -1 });
    return NextResponse.json({ success: true, data: options });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to fetch schedules" }, { status: 500 });
  }
}