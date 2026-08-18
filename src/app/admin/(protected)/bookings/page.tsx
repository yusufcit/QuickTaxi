import Link from "next/link";
import { bookingStatuses } from "@/lib/config";
import { requireAdminUser } from "@/lib/auth";
import { getAllBookings } from "@/lib/firebase/collections";

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdminUser();
  const params = await searchParams;

  const queryText = typeof params.q === "string" ? params.q : "";
  const statusFilter = typeof params.status === "string" ? params.status : "";

  const allBookings = await getAllBookings();
  const q = queryText.trim().toLowerCase();
  const bookings = allBookings.filter((booking) => {
    const matchesStatus = statusFilter ? booking.status === statusFilter : true;
    if (!matchesStatus) {
      return false;
    }

    if (!q) {
      return true;
    }

    const haystack = [
      booking.booking_reference,
      booking.customer_name,
      booking.phone,
      booking.pickup_address,
      booking.destination_address,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(q);
  });

  return (
    <section className="space-y-5">
      <h1 className="text-3xl font-black text-[#0f1d3a]">Bookings</h1>
      <form className="grid gap-3 border border-[#c9d4f4] bg-white p-4 md:grid-cols-4">
        <input name="q" defaultValue={queryText} placeholder="Search reference, customer, phone..." className="input md:col-span-2" />
        <select name="status" defaultValue={statusFilter} className="input">
          <option value="">All statuses</option>
          {bookingStatuses.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <button className="bg-[#0f1d3a] px-3 py-2 text-sm font-black text-white">Apply Filters</button>
      </form>

      <div className="overflow-x-auto border border-[#c9d4f4] bg-white p-4">
        <table className="w-full min-w-[1200px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#d9e2fb] text-xs uppercase text-[#2e3d5f]">
              <th className="py-2">Reference</th>
              <th className="py-2">Customer</th>
              <th className="py-2">Phone</th>
              <th className="py-2">Date</th>
              <th className="py-2">Time</th>
              <th className="py-2">Pickup</th>
              <th className="py-2">Destination</th>
              <th className="py-2">Passengers</th>
              <th className="py-2">Luggage</th>
              <th className="py-2">Status</th>
              <th className="py-2">Driver</th>
              <th className="py-2">Created</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b border-[#edf1fd]">
                <td className="py-2 font-bold">{booking.booking_reference}</td>
                <td className="py-2">{booking.customer_name}</td>
                <td className="py-2">{booking.phone}</td>
                <td className="py-2">{booking.pickup_date}</td>
                <td className="py-2">{booking.pickup_time}</td>
                <td className="py-2">{booking.pickup_address}</td>
                <td className="py-2">{booking.destination_address}</td>
                <td className="py-2">{booking.passengers}</td>
                <td className="py-2">L {booking.large_luggage} / S {booking.small_luggage}</td>
                <td className="py-2">{booking.status}</td>
                <td className="py-2">{booking.assigned_driver_id ? "Assigned" : "-"}</td>
                <td className="py-2">{new Date(booking.created_at).toLocaleString()}</td>
                <td className="py-2">
                  <Link href={`/admin/bookings/${booking.id}`} className="font-bold text-[#0f1d3a]">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-3">
        <Link href="/api/admin/bookings/export" className="border border-[#0f1d3a] px-4 py-2 text-sm font-bold text-[#0f1d3a]">Export CSV</Link>
      </div>
    </section>
  );
}
