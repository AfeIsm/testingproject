import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { SelectedSchedule } from "@/lib/models/SelectedSchedule";
import { getSessionFromRequest } from "@/lib/auth/session";

// GET /api/schedule/selected
export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const selected = await SelectedSchedule.findOne({ userId: session.userId });

    if (!selected) {
      return NextResponse.json({ success: true, data: null });
    }

    return NextResponse.json({ success: true, data: selected });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to fetch selected schedule" }, { status: 500 });
  }
}