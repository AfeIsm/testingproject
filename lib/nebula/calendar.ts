import { nebulaRequest } from "./client";

export type ScheduleItemType =
  | "class"
  | "meeting"
  | "event"
  | "blocked"
  | "other";

export interface ScheduleItem {
  id: string;
  type: ScheduleItemType;
  title: string;
  startTs: string;
  endTs: string;
  location?: string;
  required?: boolean;
}

interface NebulaMeeting {
  id?: string | number;
  type?: string;
  title?: string;
  name?: string;
  courseTitle?: string;
  startTs?: string;
  endTs?: string;
  start?: string;
  end?: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  room?: string;
  building?: string;
}

interface NebulaScheduleResponse {
  meetings?: NebulaMeeting[];
  classes?: NebulaMeeting[];
  items?: NebulaMeeting[];
}

function normalizeMeeting(m: NebulaMeeting, index: number): ScheduleItem | null {
  const startTs = m.startTs ?? m.start ?? m.start_time;
  const endTs = m.endTs ?? m.end ?? m.end_time;

  if (!startTs || !endTs) return null;

  return {
    id: String(m.id ?? `meeting_${index}`),
    type: "class",
    title: m.title ?? m.courseTitle ?? m.name ?? "Untitled",
    startTs,
    endTs,
    location: m.location ?? m.room ?? m.building,
    required: true,
  };
}

export async function getStudentSchedule(params: {
  userId?: string;
  start?: string;
  end?: string;
}): Promise<ScheduleItem[]> {
  const query = new URLSearchParams();

  if (params.userId) query.set("userId", params.userId);
  if (params.start) query.set("start", params.start);
  if (params.end) query.set("end", params.end);

  const payload = await nebulaRequest<NebulaScheduleResponse>(
    `/calendar?${query.toString()}`
  );

  const meetings =
    payload.meetings ?? payload.items ?? payload.classes ?? [];

  return meetings
    .map(normalizeMeeting)
    .filter((x): x is ScheduleItem => x !== null)
    .sort(
      (a, b) =>
        new Date(a.startTs).getTime() - new Date(b.startTs).getTime()
    );
}