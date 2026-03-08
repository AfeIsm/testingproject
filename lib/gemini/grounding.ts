import { geminiGenerate } from "./client";

export async function groundedAnswer(
  question: string,
  context: string
): Promise<string> {
  const prompt = `You are CometFlow, a UTD campus assistant. Answer the student's question using the provided context.

Context:
${context}

Question: ${question}

Answer concisely and helpfully. If the context doesn't contain enough information, say so and provide general UTD guidance.`;

  return geminiGenerate(prompt);
}

export async function summarizeScheduleForChat(
  scheduleData: object
): Promise<string> {
  const prompt = `Summarize this UTD class schedule in plain English for a student. 
Be friendly and mention any notable patterns (busy days, long gaps, etc.).

Schedule: ${JSON.stringify(scheduleData)}

Keep it to 2-3 sentences.`;

  return geminiGenerate(prompt);
}