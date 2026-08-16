import Link from "next/link";
import { requireAdminUser } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, role } = await requireAdminUser();

  return (
    <div className="min-h-screen bg-[#eef2ff]">
      <header className="border-b border-[#c9d4f4] bg-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 lg:px-6">
          <div>
            <p className="text-2xl font-black text-[#0f1d3a]">Quick Taxi Admin</p>
            <p className="text-xs text-[#2e3d5f]">{user.email} ({role})</p>
          </div>
          <nav className="flex flex-wrap gap-3 text-sm font-semibold text-[#0f1d3a]">
            <Link href="/admin">Dashboard</Link>
            <Link href="/admin/bookings">Bookings</Link>
            <Link href="/admin/drivers">Drivers</Link>
            <Link href="/admin/calendar">Calendar</Link>
            <Link href="/admin/settings">Settings</Link>
          </nav>
          <form method="post" action="/api/admin/logout">
            <button className="border border-[#0f1d3a] px-3 py-2 text-xs font-bold text-[#0f1d3a]">Sign out</button>
          </form>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-6">{children}</main>
    </div>
  );
}
