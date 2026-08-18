import { NextResponse } from "next/server";
import { requireAdminApiUser } from "@/lib/admin-api";
import { getAllBookings } from "@/lib/firebase/collections";

export async function GET() {
  const { authorized } = await requireAdminApiUser();
  if (!authorized) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const bookings = await getAllBookings();

  const header = [
    "Booking Reference",
    "Customer",
    "Phone",
    "Pickup",
    "Destination",
    "Date",
    "Time",
    "Passengers",
    "Large Luggage",
    "Small Luggage",
    "Status",
    "Quote",
    "Created",
  ];

  const rows = bookings.map((b) => [
    b.booking_reference,
    b.customer_name,
    b.phone,
    b.pickup_address,
    b.destination_address,
    b.pickup_date,
    b.pickup_time,
    b.passengers,
    b.large_luggage,
    b.small_luggage,
    b.status,
    b.quoted_fare ?? "",
    b.created_at,
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map((field) => `"${String(field ?? "").replaceAll("\"", '""')}"`).join(","))
    .join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=quick-taxi-bookings.csv",
    },
  });
}
