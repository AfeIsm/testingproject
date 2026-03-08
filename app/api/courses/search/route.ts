import { NextRequest, NextResponse } from "next/server";
import { searchCourses } from "@/lib/nebula/courses";

// GET /api/courses/search?q=CS3345
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") ?? searchParams.get("query") ?? "";

    if (!query.trim()) {
      return NextResponse.json({ success: false, error: "Search query is required" }, { status: 400 });
    }

    const courses = await searchCourses(query);
    return NextResponse.json({ success: true, data: courses });
  } catch (error) {
    console.error("Course search error:", error);
    return NextResponse.json({ success: false, error: "Course search failed" }, { status: 500 });
  }
}