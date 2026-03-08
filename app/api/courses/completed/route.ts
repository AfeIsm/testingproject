import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Profile } from "@/lib/models/Profile";
import { getSessionFromRequest } from "@/lib/auth/session";

// GET /api/courses/completed
export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const profile = await Profile.findOne({ userId: session.userId });
    return NextResponse.json({ success: true, data: profile?.completedCourses ?? [] });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to fetch completed courses" }, { status: 500 });
  }
}

// POST /api/courses/completed — add a completed course
export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { courseCode } = await request.json();
    if (!courseCode) return NextResponse.json({ success: false, error: "courseCode is required" }, { status: 400 });

    const profile = await Profile.findOneAndUpdate(
      { userId: session.userId },
      { $addToSet: { completedCourses: courseCode } },
      { new: true, upsert: true }
    );
    return NextResponse.json({ success: true, data: profile.completedCourses });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to add course" }, { status: 500 });
  }
}

// DELETE /api/courses/completed — remove a completed course
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { courseCode } = await request.json();

    const profile = await Profile.findOneAndUpdate(
      { userId: session.userId },
      { $pull: { completedCourses: courseCode } },
      { new: true }
    );
    return NextResponse.json({ success: true, data: profile?.completedCourses ?? [] });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to remove course" }, { status: 500 });
  }
}