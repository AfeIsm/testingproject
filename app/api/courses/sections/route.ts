import { NextRequest, NextResponse } from "next/server";
import { getSections } from "@/lib/nebula/courses";
import { parseCourseCode } from "@/lib/nebula/helpers";

// GET /api/courses/sections?course=CS3345
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const course = searchParams.get("course") ?? "";
    const subject = searchParams.get("subject") ?? "";
    const number = searchParams.get("number") ?? searchParams.get("catalogNumber") ?? "";

    let sub = subject;
    let num = number;

    if (!sub || !num) {
      if (!course) {
        return NextResponse.json({ success: false, error: "course parameter is required (e.g. CS3345)" }, { status: 400 });
      }
      const parsed = parseCourseCode(course);
      if (!parsed) {
        return NextResponse.json({ success: false, error: "Invalid course code format. Use e.g. CS3345" }, { status: 400 });
      }
      sub = parsed.subject;
      num = parsed.catalogNumber;
    }

    const sections = await getSections(sub, num);
    return NextResponse.json({ success: true, data: sections });
  } catch (error) {
    console.error("Sections error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch sections" }, { status: 500 });
  }
}