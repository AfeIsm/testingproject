export function estimateWalkingTime(
  locationA?: string,
  locationB?: string
): number {

  if (!locationA || !locationB) return 5;

  const a = locationA.toLowerCase();
  const b = locationB.toLowerCase();

  if (a === b) return 2;

  const aPrefix = a.split(" ")[0];
  const bPrefix = b.split(" ")[0];

  if (aPrefix === bPrefix) return 4;

  return 10;
}