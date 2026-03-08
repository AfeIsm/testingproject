import { Schema, Document, model, models } from "mongoose";

export interface IChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface IChatSession extends Document {
  userId: string;
  messages: IChatMessage[];
  context: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>({
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ChatSessionSchema = new Schema<IChatSession>(
  {
    userId: { type: String, required: true, index: true },
    messages: { type: [ChatMessageSchema], default: [] },
    context: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const ChatSession =
  models.ChatSession ?? model<IChatSession>("ChatSession", ChatSessionSchema);