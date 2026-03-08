"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    // later this will call backend signup
    router.push("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
        <p className="mt-2 text-sm text-slate-600">
          Start planning your semester with CometFlow.
        </p>

        <form onSubmit={handleSignup} className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Full name"
            className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-slate-400"
          />

          <input
            type="email"
            placeholder="UTD email"
            className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-slate-400"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-slate-400"
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-slate-900 py-3 text-sm font-medium text-white"
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-slate-900 underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}