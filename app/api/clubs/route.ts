import { NextRequest, NextResponse } from "next/server";
import { searchClubs } from "@/lib/nebula/clubs";

// GET /api/clubs?q=robotics&category=Technology
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") ?? searchParams.get("query") ?? undefined;
    const category = searchParams.get("category") ?? undefined;

    const clubs = await searchClubs(query, category);
    return NextResponse.json({ success: true, data: clubs });
  } catch (error) {
    console.error("Clubs error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch clubs" }, { status: 500 });
  }
}