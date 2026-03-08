import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({
      success: true,
      data: {
        status: "ok",
        timestamp: new Date().toISOString(),
        database: "connected",
        services: {
          nebula: !!process.env.NEBULA_API_KEY,
          gemini: !!process.env.GEMINI_API_KEY,
          mongodb: !!process.env.MONGODB_URI,
        },
      },
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      data: {
        status: "degraded",
        timestamp: new Date().toISOString(),
        database: "disconnected",
        error: String(error),
      },
    }, { status: 503 });
  }
}