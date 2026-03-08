import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Profile } from "@/lib/models/Profile";
import { SelectedSchedule } from "@/lib/models/SelectedSchedule";
import { getSessionFromRequest } from "@/lib/auth/session";
import { detectFreeTimeBlocks } from "@/lib/free-time/detector";
import { generateAllRecommendations } from "@/lib/recommendations/engine";
import { ScheduleItem } from "@/lib/nebula/calendar";

// POST /api/free-time/recommend
export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const body = await request.json().catch(() => ({}));
    const providedSchedule: ScheduleItem[] = body.schedule ?? [];

    // Load profile for personalization context
    const profile = await Profile.findOne({ userId: session.userId });

    let schedule = providedSchedule;
    if (schedule.length === 0) {
      // Try to load selected schedule
      const selectedSchedule = await SelectedSchedule.findOne({ userId: session.userId });
      if (selectedSchedule?.classes) {
        schedule = (selectedSchedule.classes as Array<{
          startTime: string; endTime: string; courseCode: string; location?: string;
        }>).map((c, i) => ({
          id: `class_${i}`,
          type: "class" as const,
          title: c.courseCode,
          startTs: new Date(`2025-09-01T${c.startTime}:00`).toISOString(),
          endTs: new Date(`2025-09-01T${c.endTime}:00`).toISOString(),
          location: c.location,
        }));
      }
    }

    if (schedule.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No schedule found. Generate and save a schedule first.",
      }, { status: 400 });
    }

    const freeBlocks = detectFreeTimeBlocks(schedule);
    const recommendations = await generateAllRecommendations(freeBlocks, {
      interests: profile?.major ? [profile.major.split(" ")[0]] : [],
      preferStudy: profile?.preferences?.difficultyPreference !== "easy",
    });

    return NextResponse.json({
      success: true,
      data: {
        freeBlocks,
        recommendations,
        totalBlocks: freeBlocks.length,
      },
    });

  } catch (error) {
    console.error("Recommend error:", error);
    return NextResponse.json({ success: false, error: "Recommendation generation failed" }, { status: 500 });
  }
}

// GET /api/free-time/recommend
export async function GET(request: NextRequest) {
  return POST(request);
}