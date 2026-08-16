import { NextResponse } from "next/server";
import { requireAdminApiUser } from "@/lib/admin-api";

export async function GET() {
  const { supabase, authorized } = await requireAdminApiUser();
  if (!authorized) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("booking_reference, customer_name, phone, pickup_address, destination_address, pickup_date, pickup_time, passengers, large_luggage, small_luggage, status, quoted_fare, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return new NextResponse("Failed to export bookings", { status: 500 });
  }

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

  const rows = (bookings ?? []).map((b) => [
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
