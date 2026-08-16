import Link from "next/link";
import { requireAdminUser } from "@/lib/auth";

export default async function AdminDashboardPage() {
  const { supabase } = await requireAdminUser();

  const today = new Date().toISOString().slice(0, 10);

  const [{ count: total }, { count: todayCount }, { count: newCount }, { data: upcoming }] = await Promise.all([
    supabase.from("bookings").select("id", { count: "exact", head: true }),
    supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("pickup_date", today),
    supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("status", "New Request"),
    supabase
      .from("bookings")
      .select("id, booking_reference, customer_name, pickup_address, destination_address, pickup_date, pickup_time, status, passengers")
      .gte("pickup_date", today)
      .order("pickup_date", { ascending: true })
      .limit(10),
  ]);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-black text-[#0f1d3a]">Dashboard</h1>
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          <StatCard label="Total Bookings" value={String(total ?? 0)} />
          <StatCard label="Today" value={String(todayCount ?? 0)} />
          <StatCard label="New Requests" value={String(newCount ?? 0)} />
          <StatCard label="Upcoming" value={String(upcoming?.length ?? 0)} />
        </div>
      </section>

      <section className="border border-[#c9d4f4] bg-white p-5">
        <h2 className="text-xl font-black text-[#0f1d3a]">Quick Actions</h2>
        <div className="mt-4 flex flex-wrap gap-3 text-sm font-bold">
          <Link href="/admin/bookings/new" className="bg-[#f2c230] px-4 py-2 text-[#0f1d3a]">New Booking</Link>
          <Link href="/admin/bookings?status=New%20Request" className="border border-[#0f1d3a] px-4 py-2 text-[#0f1d3a]">View New Requests</Link>
          <Link href="/admin/bookings" className="border border-[#0f1d3a] px-4 py-2 text-[#0f1d3a]">Upcoming Bookings</Link>
          <Link href="/admin/drivers" className="border border-[#0f1d3a] px-4 py-2 text-[#0f1d3a]">Manage Drivers</Link>
          <Link href="/admin/settings" className="border border-[#0f1d3a] px-4 py-2 text-[#0f1d3a]">Website Settings</Link>
        </div>
      </section>

      <section className="border border-[#c9d4f4] bg-white p-5">
        <h2 className="text-xl font-black text-[#0f1d3a]">Upcoming Bookings</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#d9e2fb] text-xs uppercase text-[#2e3d5f]">
                <th className="py-2">Ref</th>
                <th className="py-2">Date</th>
                <th className="py-2">Time</th>
                <th className="py-2">Customer</th>
                <th className="py-2">Pickup</th>
                <th className="py-2">Destination</th>
                <th className="py-2">Passengers</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {(upcoming ?? []).map((booking) => (
                <tr key={booking.id} className="border-b border-[#edf1fd]">
                  <td className="py-2 font-bold"><Link href={`/admin/bookings/${booking.id}`}>{booking.booking_reference}</Link></td>
                  <td className="py-2">{booking.pickup_date}</td>
                  <td className="py-2">{booking.pickup_time}</td>
                  <td className="py-2">{booking.customer_name}</td>
                  <td className="py-2">{booking.pickup_address}</td>
                  <td className="py-2">{booking.destination_address}</td>
                  <td className="py-2">{booking.passengers}</td>
                  <td className="py-2">{booking.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="border border-[#c9d4f4] bg-white p-4">
      <p className="text-xs uppercase tracking-wide text-[#2e3d5f]">{label}</p>
      <p className="mt-2 text-3xl font-black text-[#0f1d3a]">{value}</p>
    </article>
  );
}
