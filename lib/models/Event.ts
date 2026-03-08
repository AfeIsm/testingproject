import { Schema, Document, model, models } from "mongoose";

export interface IEvent extends Document {
  title: string;
  category: string;
  location: string;
  startTime: string;
  endTime: string;
  description: string;
  organizerId: string;
  isActive: boolean;
  createdAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    category: { type: String, default: "general" },
    location: { type: String, default: "" },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    description: { type: String, default: "" },
    organizerId: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Event = models.Event ?? model<IEvent>("Event", EventSchema);