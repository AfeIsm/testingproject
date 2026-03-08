import { Schema, Document, model, models } from "mongoose";

export interface ICoursePreference extends Document {
  userId: string;
  courseCode: string;
  priority: number;
  notes: string;
  createdAt: Date;
}

const CoursePreferenceSchema = new Schema<ICoursePreference>(
  {
    userId: { type: String, required: true, index: true },
    courseCode: { type: String, required: true },
    priority: { type: Number, default: 1 },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export const CoursePreference =
  models.CoursePreference ??
  model<ICoursePreference>("CoursePreference", CoursePreferenceSchema);