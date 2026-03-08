export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidTime(time: string): boolean {
  return /^\d{2}:\d{2}$/.test(time);
}

export function isValidCourseCode(code: string): boolean {
  return /^[A-Z]{2,4}\s*\d{4}[A-Z]?$/i.test(code.trim());
}

export function sanitizeString(str: string): string {
  return str.trim().replace(/<[^>]*>/g, "");
}