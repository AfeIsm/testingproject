"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `block rounded-xl px-4 py-3 text-sm font-medium transition ${
      pathname === path
        ? "bg-slate-900 text-white"
        : "text-slate-700 hover:bg-slate-100"
    }`;

  return (
    <aside className="w-64 rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900">CometFlow</h2>

      <nav className="mt-8 space-y-2">
        <Link href="/dashboard" className={linkClass("/dashboard")}>
          Dashboard
        </Link>

        <Link href="/schedule-builder" className={linkClass("/schedule-builder")}>
          Schedule Builder
        </Link>

        <Link href="/degree-plan" className={linkClass("/degree-plan")}>
          Degree Plan
        </Link>

        <Link href="/recommendations" className={linkClass("/recommendations")}>
          Recommendations
        </Link>

        <Link href="/assistant" className={linkClass("/assistant")}>
          Assistant
        </Link>
      </nav>
    </aside>
  );
}