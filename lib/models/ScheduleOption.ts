import { Schema, Document, model, models } from "mongoose";

export interface IClassEntry {
  courseCode: string;
  section: string;
  professor: string;
  days: string[];
  startTime: string;
  endTime: string;
  location: string;
}

export interface IScheduleOption extends Document {
  userId: string;
  label: string;
  score: number;
  reasons: string[];
  classes: IClassEntry[];
  isSelected: boolean;
  semester: string;
  createdAt: Date;
}

const ClassEntrySchema = new Schema<IClassEntry>({
  courseCode: String,
  section: String,
  professor: String,
  days: [String],
  startTime: String,
  endTime: String,
  location: String,
});

const ScheduleOptionSchema = new Schema<IScheduleOption>(
  {
    userId: { type: String, required: true, index: true },
    label: { type: String, required: true },
    score: { type: Number, default: 0 },
    reasons: { type: [String], default: [] },
    classes: { type: [ClassEntrySchema], default: [] },
    isSelected: { type: Boolean, default: false },
    semester: { type: String, default: "" },
  },
  { timestamps: true }
);

export const ScheduleOption =
  models.ScheduleOption ??
  model<IScheduleOption>("ScheduleOption", ScheduleOptionSchema);