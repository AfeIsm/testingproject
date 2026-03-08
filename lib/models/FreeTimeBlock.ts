import { Schema, Document, model, models } from "mongoose";

export interface IFreeTimeBlock extends Document {
  userId: string;
  day: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  type: string;
  scheduleId: string;
  createdAt: Date;
}

const FreeTimeBlockSchema = new Schema<IFreeTimeBlock>(
  {
    userId: { type: String, required: true, index: true },
    day: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    type: { type: String, default: "FREE" },
    scheduleId: { type: String, default: "" },
  },
  { timestamps: true }
);

export const FreeTimeBlock =
  models.FreeTimeBlock ??
  model<IFreeTimeBlock>("FreeTimeBlock", FreeTimeBlockSchema);