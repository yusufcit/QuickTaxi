import Link from "next/link";
import { requireAdminUser } from "@/lib/auth";

export default async function AdminCalendarPage() {
  const { supabase } = await requireAdminUser();
  const today = new Date().toISOString().slice(0, 10);

  const { data: bookings } = await supabase
    .from("bookings")
    .select("id, booking_reference, pickup_date, pickup_time, customer_name, status")
    .gte("pickup_date", today)
    .order("pickup_date", { ascending: true })
    .order("pickup_time", { ascending: true })
    .limit(200);

  const grouped = (bookings ?? []).reduce<Record<string, typeof bookings>>((acc, booking) => {
    acc[booking.pickup_date] = [...(acc[booking.pickup_date] ?? []), booking];
    return acc;
  }, {});

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-black text-[#0f1d3a]">Booking Calendar</h1>
      <p className="text-sm text-[#2e3d5f]">Month/week/day view can be layered later. This MVP groups upcoming bookings by date.</p>
      {Object.keys(grouped).length === 0 && (
        <article className="border border-[#c9d4f4] bg-white p-4 text-sm text-[#2e3d5f]">No upcoming bookings.</article>
      )}
      {Object.entries(grouped).map(([date, items]) => (
        <article key={date} className="border border-[#c9d4f4] bg-white p-4">
          <h2 className="text-xl font-black text-[#0f1d3a]">{date}</h2>
          <div className="mt-3 space-y-2 text-sm">
            {items?.map((booking) => (
              <p key={booking.id}>
                <span className="font-bold">{booking.pickup_time}</span> - <Link href={`/admin/bookings/${booking.id}`} className="font-semibold">{booking.booking_reference}</Link> - {booking.customer_name} - {booking.status}
              </p>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}
