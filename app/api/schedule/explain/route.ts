import { NextRequest, NextResponse } from "next/server";
import { detectFreeTimeBlocks } from "@/lib/free-time/detector";
import { getStudentSchedule } from "@/lib/nebula/calendar";
import { explainFreeTime } from "@/lib/gemini/explainers";

export async function GET() {
  try {

    const schedule = await getStudentSchedule({});

    const blocks = detectFreeTimeBlocks(schedule);

    const explanations = await Promise.all(
      blocks.map((b) => explainFreeTime(b))
    );

    return NextResponse.json({
      success: true,
      explanations
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json({
      success: false
    });
  }
}