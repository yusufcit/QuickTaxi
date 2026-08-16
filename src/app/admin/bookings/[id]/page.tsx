import Link from "next/link";
import { notFound } from "next/navigation";
import { bookingStatuses, siteConfig, whatsappUrl } from "@/lib/config";
import { requireAdminUser } from "@/lib/auth";

export default async function BookingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireAdminUser();

  const [{ data: booking }, { data: drivers }] = await Promise.all([
    supabase.from("bookings").select("*").eq("id", id).maybeSingle(),
    supabase.from("drivers").select("id, name, vehicle, registration, phone, active").eq("active", true),
  ]);

  if (!booking) {
    notFound();
  }

  const customerWhatsAppDigits = booking.phone.replace(/^\+/, "").replace(/\s+/g, "");

  return (
    <section className="space-y-6">
      <Link href="/admin/bookings" className="text-sm font-bold text-[#0f1d3a]">Back to bookings</Link>
      <h1 className="text-3xl font-black text-[#0f1d3a]">Booking {booking.booking_reference}</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="border border-[#c9d4f4] bg-white p-5">
          <h2 className="text-xl font-black">Customer</h2>
          <p className="mt-2 text-sm">Name: {booking.customer_name}</p>
          <p className="text-sm">Phone: {booking.phone}</p>
          <p className="text-sm">Email: {booking.email ?? "-"}</p>
          <p className="text-sm">Preferred contact: {booking.preferred_contact}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a href={whatsappUrl(`Hello, this is Quick Taxi regarding your booking ${booking.booking_reference}.`, customerWhatsAppDigits)} target="_blank" rel="noreferrer" className="bg-[#f2c230] px-3 py-2 text-xs font-black text-[#0f1d3a]">Contact Customer on WhatsApp</a>
            <a href={`tel:${booking.phone}`} className="border border-[#0f1d3a] px-3 py-2 text-xs font-black text-[#0f1d3a]">Call Customer</a>
          </div>
        </article>

        <article className="border border-[#c9d4f4] bg-white p-5">
          <h2 className="text-xl font-black">Journey</h2>
          <p className="mt-2 text-sm">Type: {booking.journey_type}</p>
          <p className="text-sm">Booking Type: {booking.booking_type}</p>
          <p className="text-sm">Pickup: {booking.pickup_address}</p>
          <p className="text-sm">Destination: {booking.destination_address}</p>
          <p className="text-sm">Date / Time: {booking.pickup_date} {booking.pickup_time}</p>
          <p className="text-sm">Passengers: {booking.passengers}</p>
          <p className="text-sm">Luggage: Large {booking.large_luggage} / Small {booking.small_luggage}</p>
          <p className="text-sm">Flight Number: {booking.flight_number ?? "-"}</p>
          <p className="text-sm">Airport: {booking.airport ?? "-"}</p>
          {booking.journey_type === "Return Journey" && (
            <>
              <p className="text-sm">Return Date / Time: {booking.return_date ?? "-"} {booking.return_time ?? ""}</p>
              <p className="text-sm">Return Pickup: {booking.return_pickup ?? "-"}</p>
              <p className="text-sm">Return Destination: {booking.return_destination ?? "-"}</p>
            </>
          )}
          <p className="mt-3 text-sm">Special Requirements: {booking.special_requirements ?? "-"}</p>
        </article>

        <article className="border border-[#c9d4f4] bg-white p-5">
          <h2 className="text-xl font-black">Status</h2>
          <form method="post" action={`/api/admin/bookings/${booking.id}/status`} className="mt-3 space-y-3">
            <select name="status" defaultValue={booking.status} className="input">
              {bookingStatuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <button className="bg-[#0f1d3a] px-4 py-2 text-sm font-black text-white">Update Status</button>
          </form>
        </article>

        <article className="border border-[#c9d4f4] bg-white p-5">
          <h2 className="text-xl font-black">Driver Assignment</h2>
          <form method="post" action={`/api/admin/bookings/${booking.id}/assign-driver`} className="mt-3 space-y-3">
            <select name="driverId" defaultValue={booking.assigned_driver_id ?? ""} className="input">
              <option value="">No driver assigned</option>
              {(drivers ?? []).map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.name} - {driver.vehicle ?? "Vehicle"} ({driver.registration ?? "No reg"})
                </option>
              ))}
            </select>
            <button className="bg-[#0f1d3a] px-4 py-2 text-sm font-black text-white">Assign Driver</button>
          </form>
          <p className="mt-3 text-xs text-[#2e3d5f]">
            Conflicts are reviewed manually. If the selected driver already has a booking at the same time, check calendar before confirming.
          </p>
        </article>

        <article className="border border-[#c9d4f4] bg-white p-5 lg:col-span-2">
          <h2 className="text-xl font-black">Admin Notes and Quote (Private)</h2>
          <form method="post" action={`/api/admin/bookings/${booking.id}/notes`} className="mt-3 grid gap-3 md:grid-cols-2">
            <label className="text-sm font-semibold">Quoted Fare (Admin Only)
              <input name="quotedFare" defaultValue={booking.quoted_fare ?? ""} className="input mt-2" />
            </label>
            <label className="text-sm font-semibold md:col-span-2">Admin Notes
              <textarea name="adminNotes" defaultValue={booking.admin_notes ?? ""} className="input mt-2 min-h-28" />
            </label>
            <button className="w-fit bg-[#0f1d3a] px-4 py-2 text-sm font-black text-white">Save Private Notes</button>
          </form>
        </article>
      </div>

      <p className="text-xs text-[#2e3d5f]">Public site never displays quoted fare. This field is internal only.</p>
      <a href={siteConfig.phoneTel} className="text-sm font-bold text-[#0f1d3a]">Call: {siteConfig.phoneDisplay}</a>
    </section>
  );
}
