import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { ChatSession } from "@/lib/models/ChatSession";
import { SelectedSchedule } from "@/lib/models/SelectedSchedule";
import { Profile } from "@/lib/models/Profile";
import { getSessionFromRequest } from "@/lib/auth/session";
import { processChatMessage } from "@/lib/gemini/chatbot";
import { CHAT_HISTORY_LIMIT } from "@/lib/utils/constants";

// POST /api/chatbot — send a message
export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { message } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json({ success: false, error: "Message is required" }, { status: 400 });
    }

    // Load context from DB
    const [profile, selectedSchedule, chatSession] = await Promise.all([
      Profile.findOne({ userId: session.userId }),
      SelectedSchedule.findOne({ userId: session.userId }),
      ChatSession.findOne({ userId: session.userId }),
    ]);

    const history = chatSession?.messages.slice(-CHAT_HISTORY_LIMIT) ?? [];

    // Build context for Gemini
    const context = {
      profile: profile
        ? { name: profile.name, major: profile.major, year: profile.year }
        : undefined,
      schedule: selectedSchedule?.classes ?? undefined,
    };

    // Get AI response
    const aiResponse = await processChatMessage(
      message,
      history.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      context
    );

    // Save conversation to MongoDB
    const newMessages = [
      { role: "user" as const, content: message, timestamp: new Date() },
      { role: "assistant" as const, content: aiResponse, timestamp: new Date() },
    ];

    await ChatSession.findOneAndUpdate(
      { userId: session.userId },
      {
        $push: {
          messages: {
            $each: newMessages,
            $slice: -CHAT_HISTORY_LIMIT,
          },
        },
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      data: {
        message: aiResponse,
        role: "assistant",
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error("Chatbot error:", error);
    return NextResponse.json({ success: false, error: "Chatbot service unavailable" }, { status: 500 });
  }
}

// GET /api/chatbot — get chat history
export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const chatSession = await ChatSession.findOne({ userId: session.userId });

    return NextResponse.json({
      success: true,
      data: chatSession?.messages ?? [],
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to load chat history" }, { status: 500 });
  }
}

// DELETE /api/chatbot — clear chat history
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await connectDB();
    await ChatSession.findOneAndUpdate(
      { userId: session.userId },
      { $set: { messages: [] } }
    );

    return NextResponse.json({ success: true, data: { message: "Chat history cleared" } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to clear chat history" }, { status: 500 });
  }
}