import { Schema, Document, model, models } from "mongoose";

export interface IPreferences {
  earliestClass: string;
  latestClass: string;
  maxClassesPerDay: number;
  difficultyPreference: "easy" | "medium" | "hard" | "any";
  preferCompact: boolean;
  preferMorning: boolean;
}

export interface IProfile extends Document {
  userId: string;
  name: string;
  major: string;
  year: string;
  completedCourses: string[];
  desiredCourses: string[];
  preferences: IPreferences;
  updatedAt: Date;
}

const ProfileSchema = new Schema<IProfile>(
  {
    userId: { type: String, required: true, unique: true },
    name: { type: String, default: "" },
    major: { type: String, default: "" },
    year: { type: String, default: "Freshman" },
    completedCourses: { type: [String], default: [] },
    desiredCourses: { type: [String], default: [] },
    preferences: {
      earliestClass: { type: String, default: "08:00" },
      latestClass: { type: String, default: "20:00" },
      maxClassesPerDay: { type: Number, default: 3 },
      difficultyPreference: { type: String, default: "any" },
      preferCompact: { type: Boolean, default: false },
      preferMorning: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export const Profile = models.Profile ?? model<IProfile>("Profile", ProfileSchema);