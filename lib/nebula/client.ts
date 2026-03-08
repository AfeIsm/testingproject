const NEBULA_BASE_URL = process.env.NEBULA_BASE_URL;
const NEBULA_API_KEY = process.env.NEBULA_API_KEY;

if (!NEBULA_BASE_URL) {
  console.warn("⚠️ NEBULA_BASE_URL is missing from environment variables.");
}

if (!NEBULA_API_KEY) {
  console.warn("⚠️ NEBULA_API_KEY is missing from environment variables.");
}

export async function nebulaRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {

  if (!NEBULA_BASE_URL) {
    throw new Error("NEBULA_BASE_URL is not configured.");
  }

  const url = `${NEBULA_BASE_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");

  if (NEBULA_API_KEY) {
    headers.set("Authorization", `Bearer ${NEBULA_API_KEY}`);
    headers.set("x-api-key", NEBULA_API_KEY);
  }

  const response = await fetch(url, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `Nebula API Error: ${response.status} ${response.statusText} ${text}`
    );
  }

  return response.json();
}