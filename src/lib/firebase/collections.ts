import { Timestamp } from "firebase-admin/firestore";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";
import type { BookingRecord, DriverRecord } from "@/lib/firebase/types";

function toIso(value: unknown): string {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }
  if (typeof value === "string") {
    return value;
  }
  return new Date().toISOString();
}

export function toBookingRecord(id: string, data: Record<string, unknown>): BookingRecord {
  return {
    id,
    booking_reference: String(data.booking_reference ?? ""),
    customer_name: String(data.customer_name ?? ""),
    phone: String(data.phone ?? ""),
    email: (data.email as string | null | undefined) ?? null,
    preferred_contact: (data.preferred_contact as BookingRecord["preferred_contact"]) ?? "Phone",
    booking_type: (data.booking_type as BookingRecord["booking_type"]) ?? "Advance Booking",
    journey_type: (data.journey_type as BookingRecord["journey_type"]) ?? "One Way",
    pickup_address: String(data.pickup_address ?? ""),
    pickup_area: (data.pickup_area as string | null | undefined) ?? null,
    destination_address: String(data.destination_address ?? ""),
    destination_area: (data.destination_area as string | null | undefined) ?? null,
    pickup_date: String(data.pickup_date ?? ""),
    pickup_time: String(data.pickup_time ?? ""),
    return_date: (data.return_date as string | null | undefined) ?? null,
    return_time: (data.return_time as string | null | undefined) ?? null,
    return_pickup: (data.return_pickup as string | null | undefined) ?? null,
    return_destination: (data.return_destination as string | null | undefined) ?? null,
    passengers: Number(data.passengers ?? 1),
    large_luggage: Number(data.large_luggage ?? 0),
    small_luggage: Number(data.small_luggage ?? 0),
    flight_number: (data.flight_number as string | null | undefined) ?? null,
    airport: (data.airport as string | null | undefined) ?? null,
    airport_direction: (data.airport_direction as "Arrival" | "Departure" | null | undefined) ?? null,
    special_requirements: (data.special_requirements as string | null | undefined) ?? null,
    quoted_fare: (data.quoted_fare as string | null | undefined) ?? null,
    status: String(data.status ?? "New Request"),
    assigned_driver_id: (data.assigned_driver_id as string | null | undefined) ?? null,
    admin_notes: (data.admin_notes as string | null | undefined) ?? null,
    created_at: toIso(data.created_at),
    updated_at: toIso(data.updated_at),
    created_date: String(data.created_date ?? ""),
  };
}

export function toDriverRecord(id: string, data: Record<string, unknown>): DriverRecord {
  return {
    id,
    name: String(data.name ?? ""),
    phone: (data.phone as string | null | undefined) ?? null,
    email: (data.email as string | null | undefined) ?? null,
    vehicle: (data.vehicle as string | null | undefined) ?? null,
    registration: (data.registration as string | null | undefined) ?? null,
    vehicle_type: (data.vehicle_type as string | null | undefined) ?? null,
    capacity: typeof data.capacity === "number" ? data.capacity : null,
    active: Boolean(data.active ?? true),
    notes: (data.notes as string | null | undefined) ?? null,
    created_at: toIso(data.created_at),
  };
}

export async function getAllBookings() {
  const db = getFirebaseAdminDb();
  const snapshot = await db.collection("bookings").orderBy("created_at", "desc").limit(1000).get();
  return snapshot.docs.map((doc) => toBookingRecord(doc.id, doc.data()));
}

export async function getBookingById(id: string) {
  const db = getFirebaseAdminDb();
  const snapshot = await db.collection("bookings").doc(id).get();
  if (!snapshot.exists) {
    return null;
  }
  return toBookingRecord(snapshot.id, snapshot.data() as Record<string, unknown>);
}

export async function getAllDrivers() {
  const db = getFirebaseAdminDb();
  const snapshot = await db.collection("drivers").orderBy("name", "asc").get();
  return snapshot.docs.map((doc) => toDriverRecord(doc.id, doc.data()));
}
