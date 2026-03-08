import { Schema, Document, model, models } from "mongoose";

export interface ISelectedSchedule extends Document {
  userId: string;
  scheduleOptionId: string;
  semester: string;
  classes: object[];
  savedAt: Date;
}

const SelectedScheduleSchema = new Schema<ISelectedSchedule>(
  {
    userId: { type: String, required: true, unique: true },
    scheduleOptionId: { type: String, required: true },
    semester: { type: String, default: "" },
    classes: { type: [Schema.Types.Mixed], default: [] },
  },
  { timestamps: true }
);

export const SelectedSchedule =
  models.SelectedSchedule ??
  model<ISelectedSchedule>("SelectedSchedule", SelectedScheduleSchema);