import { Schema, Document, model, models } from "mongoose";

export interface ISavedActivity extends Document {
  userId: string;
  type: "event" | "club" | "room" | "study";
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  sourceId: string;
  freeTimeBlockId: string;
  createdAt: Date;
}

const SavedActivitySchema = new Schema<ISavedActivity>(
  {
    userId: { type: String, required: true, index: true },
    type: { type: String, enum: ["event", "club", "room", "study"], required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    location: { type: String, default: "" },
    startTime: { type: String, default: "" },
    endTime: { type: String, default: "" },
    sourceId: { type: String, default: "" },
    freeTimeBlockId: { type: String, default: "" },
  },
  { timestamps: true }
);

export const SavedActivity =
  models.SavedActivity ??
  model<ISavedActivity>("SavedActivity", SavedActivitySchema);