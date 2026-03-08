import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Profile } from "@/lib/models/Profile";
import { ScheduleOption } from "@/lib/models/ScheduleOption";
import { getSessionFromRequest } from "@/lib/auth/session";
import { getSections, CourseSection } from "@/lib/nebula/courses";
import { parseCourseCode } from "@/lib/nebula/helpers";
import { generateScheduleOptions } from "@/lib/schedule/generator";
import { formatScheduleOption } from "@/lib/schedule/formatter";

// POST /api/schedule/generate
export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    // Accept either inline courses or pull from profile
    let desiredCourses: string[] = body.courses ?? body.desiredCourses ?? [];
    let preferences = body.preferences ?? {};

    if (desiredCourses.length === 0) {
      // Load from profile
      const profile = await Profile.findOne({ userId: session.userId });
      desiredCourses = profile?.desiredCourses ?? [];
      if (!Object.keys(preferences).length) {
        preferences = profile?.preferences ?? {};
      }
    }

    if (desiredCourses.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No courses specified. Add desired courses to your profile or include them in the request body.",
      }, { status: 400 });
    }

    // Fetch sections for each course in parallel
    const sectionsByCourse: CourseSection[][] = await Promise.all(
      desiredCourses.map(async (code) => {
        const parsed = parseCourseCode(code);
        if (!parsed) return [];
        try {
          return await getSections(parsed.subject, parsed.catalogNumber);
        } catch {
          return [];
        }
      })
    );

    // Filter out courses with no sections found
    const validSections = sectionsByCourse.filter((s) => s.length > 0);

    if (validSections.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No sections found for the specified courses. Try different course codes.",
      }, { status: 404 });
    }

    // Generate schedule options
    const options = generateScheduleOptions(validSections, preferences, 5);

    if (options.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No conflict-free schedules found. Try different courses or preferences.",
      }, { status: 404 });
    }

    // Save generated options to MongoDB
    await ScheduleOption.deleteMany({ userId: session.userId, isSelected: false });
    const saved = await ScheduleOption.insertMany(
      options.map((opt) => ({
        userId: session.userId,
        label: opt.label,
        score: opt.score,
        reasons: opt.reasons,
        classes: opt.classes.map((c) => ({
          courseCode: c.courseCode,
          section: c.sectionNumber,
          professor: c.professor,
          days: c.days,
          startTime: c.startTime,
          endTime: c.endTime,
          location: c.location,
        })),
        isSelected: false,
        semester: body.semester ?? "Fall 2025",
      }))
    );

    return NextResponse.json({
      success: true,
      data: {
        options: options.map((opt, i) => ({
          ...formatScheduleOption(opt),
          _id: String(saved[i]._id),
        })),
        coursesFound: validSections.length,
        coursesRequested: desiredCourses.length,
      },
    });

  } catch (error) {
    console.error("Schedule generate error:", error);
    return NextResponse.json({ success: false, error: "Schedule generation failed" }, { status: 500 });
  }
}