import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Profile } from "@/lib/models/Profile";
import { getSessionFromRequest } from "@/lib/auth/session";

// GET /api/profile — get current user's profile
export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    let profile = await Profile.findOne({ userId: session.userId });

    if (!profile) {
      profile = await Profile.create({ userId: session.userId });
    }

    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to load profile" }, { status: 500 });
  }
}

// PUT /api/profile — update current user's profile
export async function PUT(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();

    const allowedFields = [
      "name", "major", "year",
      "completedCourses", "desiredCourses", "preferences",
    ];

    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    const profile = await Profile.findOneAndUpdate(
      { userId: session.userId },
      { $set: updateData },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    console.error("Profile PUT error:", error);
    return NextResponse.json({ success: false, error: "Failed to update profile" }, { status: 500 });
  }
}