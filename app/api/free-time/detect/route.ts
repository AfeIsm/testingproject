import { NextResponse } from "next/server";
import { getStudentSchedule } from "@/lib/nebula/calendar";
import { detectFreeTimeBlocks } from "@/lib/free-time/detector";

export async function GET() {

  try {

    const schedule = await getStudentSchedule({});

    const freeBlocks = detectFreeTimeBlocks(schedule);

    return NextResponse.json({
      success: true,
      freeBlocks
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json({
      success: false,
      error: "Free time detection failed"
    });
  }
}