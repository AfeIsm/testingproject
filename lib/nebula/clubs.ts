import { nebulaRequest } from "./client";

export interface Club {
  id: string;
  name: string;
  description: string;
  category: string;
  meetingTime: string;
  location: string;
  contactEmail: string;
  tags: string[];
}

const MOCK_CLUBS: Club[] = [
  { id: "acm", name: "ACM UTD", description: "Association for Computing Machinery student chapter. Weekly talks, hackathons, and coding competitions.", category: "Technology", meetingTime: "Fridays 7:00 PM", location: "ECSS 2.415", contactEmail: "acm@utdallas.edu", tags: ["coding", "tech", "competitive programming"] },
  { id: "swe", name: "Society of Women Engineers", description: "Supporting women in STEM through professional development and community.", category: "Engineering", meetingTime: "Tuesdays 6:30 PM", location: "ECSN 2.112", contactEmail: "swe@utdallas.edu", tags: ["engineering", "networking", "diversity"] },
  { id: "gdsc", name: "Google Developer Student Club", description: "Learn Google technologies, build projects, and connect with developers.", category: "Technology", meetingTime: "Wednesdays 7:00 PM", location: "ECSS 2.203", contactEmail: "gdsc@utdallas.edu", tags: ["google", "development", "projects"] },
  { id: "hackutd", name: "HackUTD", description: "Organizing UTD's annual hackathon and fostering innovation culture.", category: "Technology", meetingTime: "Thursdays 6:00 PM", location: "ECSS 2.415", contactEmail: "hackutd@utdallas.edu", tags: ["hackathon", "innovation", "tech"] },
  { id: "data-sci", name: "Data Science Club", description: "Exploring machine learning, AI, and data analytics through projects.", category: "Technology", meetingTime: "Mondays 7:00 PM", location: "GR 3.302", contactEmail: "datascience@utdallas.edu", tags: ["data", "ML", "AI", "analytics"] },
  { id: "robotics", name: "UTD Robotics Club", description: "Design and build robots for competition and fun.", category: "Engineering", meetingTime: "Saturdays 2:00 PM", location: "ECSW 1.130", contactEmail: "robotics@utdallas.edu", tags: ["robotics", "engineering", "hardware"] },
  { id: "chess", name: "UTD Chess Club", description: "One of the strongest collegiate chess programs in the nation.", category: "Academic", meetingTime: "Tuesdays & Thursdays 6:00 PM", location: "SU 2.602", contactEmail: "chess@utdallas.edu", tags: ["chess", "competitive", "strategy"] },
  { id: "debate", name: "UTD Debate Team", description: "Competitive debate and public speaking development.", category: "Academic", meetingTime: "Mondays 6:00 PM", location: "JO 3.516", contactEmail: "debate@utdallas.edu", tags: ["debate", "public speaking", "competition"] },
  { id: "astronomy", name: "Astronomy Club", description: "Stargazing events, telescope nights, and space science.", category: "Science", meetingTime: "Fridays 8:00 PM", location: "RL 3.204", contactEmail: "astronomy@utdallas.edu", tags: ["astronomy", "science", "space"] },
  { id: "finance", name: "Finance & Investment Club", description: "Stock market simulations and financial literacy workshops.", category: "Business", meetingTime: "Wednesdays 6:00 PM", location: "SOM 1.107", contactEmail: "finance@utdallas.edu", tags: ["finance", "investing", "business"] },
];

interface NebulaClubRaw {
  _id?: string; id?: string;
  name?: string; description?: string; category?: string;
  meeting_time?: string; meetingTime?: string;
  location?: string; contact?: string; email?: string;
  tags?: string[];
}

export async function searchClubs(query?: string, category?: string): Promise<Club[]> {
  try {
    const params = new URLSearchParams();
    if (query) params.set("search_term", query);
    if (category) params.set("category", category);
    const data = await nebulaRequest<{ data?: NebulaClubRaw[] }>(`/v1/club?${params}`);
    const clubs = data.data ?? [];
    if (clubs.length === 0) throw new Error("empty");
    return clubs.map((c) => ({
      id: c._id ?? c.id ?? "",
      name: c.name ?? "",
      description: c.description ?? "",
      category: c.category ?? "General",
      meetingTime: c.meeting_time ?? c.meetingTime ?? "",
      location: c.location ?? "",
      contactEmail: c.contact ?? c.email ?? "",
      tags: c.tags ?? [],
    }));
  } catch {
    let results = [...MOCK_CLUBS];
    if (query) {
      const q = query.toLowerCase();
      results = results.filter(
        (c) => c.name.toLowerCase().includes(q) ||
               c.description.toLowerCase().includes(q) ||
               c.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (category) {
      results = results.filter((c) => c.category.toLowerCase() === category.toLowerCase());
    }
    return results;
  }
}

export function getClubsByInterests(interests: string[]): Club[] {
  if (!interests.length) return MOCK_CLUBS.slice(0, 5);
  return MOCK_CLUBS.filter((club) =>
    interests.some((interest) =>
      club.tags.some((tag) => tag.toLowerCase().includes(interest.toLowerCase())) ||
      club.description.toLowerCase().includes(interest.toLowerCase())
    )
  );
}