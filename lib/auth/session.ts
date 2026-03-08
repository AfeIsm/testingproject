import { SignJWT, jwtVerify } from "jose";
import { NextRequest } from "next/server";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "fallback-secret-change-me"
);

export interface SessionPayload {
  userId: string;
  email: string;
}

export async function signToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSessionFromRequest(
  request: NextRequest
): Promise<SessionPayload | null> {
  const authHeader = request.headers.get("authorization");
  const cookieToken = request.cookies.get("token")?.value;

  const token = authHeader?.replace("Bearer ", "") ?? cookieToken;
  if (!token) return null;

  return verifyToken(token);
}