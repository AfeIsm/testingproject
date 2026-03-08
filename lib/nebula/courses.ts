import { nebulaRequest } from "./client";

export interface CourseSection {
  id: string;
  courseCode: string;
  subject: string;
  catalogNumber: string;
  title: string;
  professor: string;
  days: string[];
  startTime: string;
  endTime: string;
  location: string;
  sectionNumber: string;
  maxEnrollment: number;
  currentEnrollment: number;
}

export interface CourseSearchResult {
  id: string;
  subject: string;
  catalog_number: string;
  title: string;
  description: string;
  credit_hours: number;
}

// Fallback mock data for demo resilience
const MOCK_COURSES: CourseSearchResult[] = [
  { id: "cs3345", subject: "CS", catalog_number: "3345", title: "Data Structures & Algorithms", description: "Fundamental data structures and algorithm analysis.", credit_hours: 3 },
  { id: "cs3354", subject: "CS", catalog_number: "3354", title: "Software Engineering", description: "Software development process and methodologies.", credit_hours: 3 },
  { id: "cs4337", subject: "CS", catalog_number: "4337", title: "Organization of Programming Languages", description: "Survey of programming language paradigms.", credit_hours: 3 },
  { id: "cs4341", subject: "CS", catalog_number: "4341", title: "Digital Logic", description: "Boolean algebra and digital circuit design.", credit_hours: 3 },
  { id: "math2418", subject: "MATH", catalog_number: "2418", title: "Linear Algebra", description: "Vectors, matrices, linear transformations.", credit_hours: 3 },
  { id: "math2451", subject: "MATH", catalog_number: "2451", title: "Multivariable Calculus", description: "Calculus of functions of several variables.", credit_hours: 4 },
  { id: "phys2326", subject: "PHYS", catalog_number: "2326", title: "University Physics II", description: "Electricity, magnetism, and optics.", credit_hours: 3 },
  { id: "cs4349", subject: "CS", catalog_number: "4349", title: "Advanced Algorithm Design", description: "Advanced algorithm design techniques.", credit_hours: 3 },
];

const MOCK_SECTIONS: CourseSection[] = [
  { id: "sec001", courseCode: "CS 3345", subject: "CS", catalogNumber: "3345", title: "Data Structures & Algorithms", professor: "Dr. Smith", days: ["Mon", "Wed", "Fri"], startTime: "09:00", endTime: "09:50", location: "ECSS 2.415", sectionNumber: "001", maxEnrollment: 40, currentEnrollment: 35 },
  { id: "sec002", courseCode: "CS 3345", subject: "CS", catalogNumber: "3345", title: "Data Structures & Algorithms", professor: "Dr. Johnson", days: ["Tue", "Thu"], startTime: "11:30", endTime: "12:45", location: "ECSS 2.415", sectionNumber: "002", maxEnrollment: 40, currentEnrollment: 28 },
  { id: "sec003", courseCode: "CS 3354", subject: "CS", catalogNumber: "3354", title: "Software Engineering", professor: "Dr. Garcia", days: ["Mon", "Wed"], startTime: "14:00", endTime: "15:15", location: "ECSS 2.203", sectionNumber: "001", maxEnrollment: 35, currentEnrollment: 30 },
  { id: "sec004", courseCode: "CS 4337", subject: "CS", catalogNumber: "4337", title: "Organization of Programming Languages", professor: "Dr. Lee", days: ["Tue", "Thu"], startTime: "09:00", endTime: "10:15", location: "ECSS 2.415", sectionNumber: "001", maxEnrollment: 35, currentEnrollment: 20 },
  { id: "sec005", courseCode: "MATH 2418", subject: "MATH", catalogNumber: "2418", title: "Linear Algebra", professor: "Dr. Chen", days: ["Mon", "Wed", "Fri"], startTime: "10:00", endTime: "10:50", location: "SOM 2.901", sectionNumber: "001", maxEnrollment: 45, currentEnrollment: 40 },
];

interface NebulaCourseRaw {
  _id?: string;
  id?: string;
  subject_prefix?: string;
  subject?: string;
  course_number?: string;
  catalog_number?: string;
  title?: string;
  description?: string;
  credit_hours?: number | string;
}

interface NebulaSectionRaw {
  _id?: string;
  id?: string;
  section_number?: string;
  course_reference_number?: string;
  subject_prefix?: string;
  course_number?: string;
  title?: string;
  instruction_mode?: string;
  professors?: Array<{ first_name?: string; last_name?: string }>;
  meetings?: Array<{
    days?: string[];
    start_time?: string;
    end_time?: string;
    location?: { building?: string; room?: string };
  }>;
  enrollment_status?: string;
  class_capacity?: number;
  enrollment_count?: number;
}

export async function searchCourses(query: string): Promise<CourseSearchResult[]> {
  try {
    const data = await nebulaRequest<{ data?: NebulaCourseRaw[]; courses?: NebulaCourseRaw[] }>(
      `/v1/course?search_term=${encodeURIComponent(query)}&limit=20`
    );
    const courses = data.data ?? data.courses ?? [];
    return courses.map((c) => ({
      id: c._id ?? c.id ?? "",
      subject: c.subject_prefix ?? c.subject ?? "",
      catalog_number: c.course_number ?? c.catalog_number ?? "",
      title: c.title ?? "",
      description: c.description ?? "",
      credit_hours: Number(c.credit_hours ?? 3),
    }));
  } catch {
    // Fallback: filter mock data
    const q = query.toLowerCase();
    return MOCK_COURSES.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.subject.toLowerCase().includes(q) ||
        c.catalog_number.includes(q)
    );
  }
}

export async function getSections(subject: string, catalogNumber: string): Promise<CourseSection[]> {
  try {
    const data = await nebulaRequest<{ data?: NebulaSectionRaw[]; sections?: NebulaSectionRaw[] }>(
      `/v1/section?subject_prefix=${subject}&course_number=${catalogNumber}&limit=20`
    );
    const sections = data.data ?? data.sections ?? [];
    return sections.map((s) => {
      const meeting = s.meetings?.[0];
      const prof = s.professors?.[0];
      return {
        id: s._id ?? s.id ?? "",
        courseCode: `${s.subject_prefix ?? subject} ${s.course_number ?? catalogNumber}`,
        subject: s.subject_prefix ?? subject,
        catalogNumber: s.course_number ?? catalogNumber,
        title: s.title ?? "",
        professor: prof ? `${prof.first_name ?? ""} ${prof.last_name ?? ""}`.trim() : "TBA",
        days: meeting?.days ?? [],
        startTime: meeting?.start_time ?? "",
        endTime: meeting?.end_time ?? "",
        location: meeting?.location
          ? `${meeting.location.building ?? ""} ${meeting.location.room ?? ""}`.trim()
          : "TBA",
        sectionNumber: s.section_number ?? s.course_reference_number ?? "",
        maxEnrollment: s.class_capacity ?? 40,
        currentEnrollment: s.enrollment_count ?? 0,
      };
    });
  } catch {
    const code = `${subject} ${catalogNumber}`;
    const filtered = MOCK_SECTIONS.filter((s) => s.courseCode === code);
    return filtered.length > 0 ? filtered : MOCK_SECTIONS.slice(0, 2);
  }
}