import { geminiGenerate } from "./client";
import { freeTimeExplanationPrompt } from "./prompts";
import { FreeTimeBlock } from "@/lib/free-time/detector";

export async function explainFreeTime(
  block: FreeTimeBlock
) {
  const prompt = freeTimeExplanationPrompt(block);

  const text = await geminiGenerate(prompt);

  return {
    block,
    explanation: text
  };
}