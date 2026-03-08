import { geminiGenerate, geminiChat } from "./client";
import { chatbotSystemPrompt } from "./prompts";
import { FreeTimeBlock } from "@/lib/free-time/detector";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatContext {
  schedule?: object;
  freeBlocks?: FreeTimeBlock[];
  profile?: { name?: string; major?: string; year?: string };
}

export async function processChatMessage(
  userMessage: string,
  history: ChatMessage[],
  context: ChatContext = {}
): Promise<string> {
  const systemPrompt = chatbotSystemPrompt(context);

  // Build full prompt with history
  const historyText = history
    .slice(-6) // Keep last 6 messages for context window
    .map((m) => `${m.role === "user" ? "Student" : "CometFlow"}: ${m.content}`)
    .join("\n");

  const fullPrompt = `${systemPrompt}

${historyText ? `Previous conversation:\n${historyText}\n` : ""}
Student: ${userMessage}
CometFlow:`;

  try {
    const response = await geminiGenerate(fullPrompt);
    return response.trim();
  } catch (error) {
    console.error("Gemini chat error:", error);
    return "I'm having trouble connecting right now. Please try again in a moment!";
  }
}

export async function generateWeeklySummary(
  schedule: object[],
  freeBlocks: FreeTimeBlock[],
  context: ChatContext = {}
): Promise<string> {
  const systemPrompt = chatbotSystemPrompt(context);
  const prompt = `${systemPrompt}

Generate a friendly weekly summary for this student. Include:
1. A brief overview of their schedule
2. Their best free time blocks and what to do with them
3. One motivational tip for the week

Schedule: ${JSON.stringify(schedule)}
Free blocks: ${JSON.stringify(freeBlocks)}

Keep it under 150 words, warm and encouraging.`;

  return geminiGenerate(prompt);
}