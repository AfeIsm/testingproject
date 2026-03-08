import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/lib/models/User";
import { Profile } from "@/lib/models/Profile";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { signToken } from "@/lib/auth/session";
import { isValidEmail } from "@/lib/utils/validators";

// POST /api/auth — signup or login depending on `action`
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { action, email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ success: false, error: "Invalid email address" }, { status: 400 });
    }

    // ── SIGNUP ──
    if (action === "signup") {
      if (!name) {
        return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });
      }
      if (password.length < 8) {
        return NextResponse.json({ success: false, error: "Password must be at least 8 characters" }, { status: 400 });
      }

      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return NextResponse.json({ success: false, error: "An account with this email already exists" }, { status: 409 });
      }

      const hashed = await hashPassword(password);
      const user = await User.create({ email: email.toLowerCase(), password: hashed, name });

      // Create empty profile for new user
      await Profile.create({ userId: String(user._id), name });

      const token = await signToken({ userId: String(user._id), email: user.email });

      const response = NextResponse.json({
        success: true,
        data: { userId: String(user._id), email: user.email, name: user.name },
      }, { status: 201 });

      response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });

      return response;
    }

    // ── LOGIN ──
    if (action === "login") {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 });
      }

      const valid = await verifyPassword(password, user.password);
      if (!valid) {
        return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 });
      }

      const token = await signToken({ userId: String(user._id), email: user.email });

      const response = NextResponse.json({
        success: true,
        data: { userId: String(user._id), email: user.email, name: user.name, token },
      });

      response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });

      return response;
    }

    return NextResponse.json({ success: false, error: "Invalid action. Use 'signup' or 'login'" }, { status: 400 });

  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 500 });
  }
}

// DELETE /api/auth — logout
export async function DELETE() {
  const response = NextResponse.json({ success: true, data: { message: "Logged out" } });
  response.cookies.delete("token");
  return response;
}