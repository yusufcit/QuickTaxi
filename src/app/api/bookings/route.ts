import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { bookingRequestSchema, sanitizePhone } from "@/lib/booking";
import { checkRateLimit } from "@/lib/rate-limit";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  return "unknown";
}

function buildBookingReference(sequence: number): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `QT-${y}${m}${d}-${String(sequence).padStart(3, "0")}`;
}

async function sendAdminEmail(input: {
  bookingReference: string;
  customerName: string;
  phone: string;
  pickupAddress: string;
  destinationAddress: string;
  pickupDate: string;
  pickupTime: string;
  passengers: number;
  largeLuggage: number;
  smallLuggage: number;
  specialRequirements?: string;
}) {
  if (!process.env.RESEND_API_KEY || !process.env.ADMIN_EMAIL) {
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "Quick Taxi <onboarding@resend.dev>",
    to: process.env.ADMIN_EMAIL,
    subject: `New Quick Taxi Booking - ${input.bookingReference}`,
    text: [
      `Booking Reference: ${input.bookingReference}`,
      `Customer: ${input.customerName}`,
      `Phone: ${input.phone}`,
      `Pickup: ${input.pickupAddress}`,
      `Destination: ${input.destinationAddress}`,
      `Date: ${input.pickupDate}`,
      `Time: ${input.pickupTime}`,
      `Passengers: ${input.passengers}`,
      `Luggage: Large ${input.largeLuggage}, Small ${input.smallLuggage}`,
      `Special Requirements: ${input.specialRequirements ?? "None"}`,
    ].join("\n"),
  });
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const limit = checkRateLimit(`bookings:${ip}`);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: `Too many requests. Please try again in ${limit.retryAfter} seconds.` },
        { status: 429 },
      );
    }

    const body = await request.json();
    const parsed = bookingRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid booking request." },
        { status: 400 },
      );
    }

    if (parsed.data.website) {
      return NextResponse.json({ error: "Request rejected." }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();

    const duplicatePhone = sanitizePhone(parsed.data.phone);
    const { data: duplicate, error: duplicateError } = await supabase
      .from("bookings")
      .select("id")
      .eq("phone", duplicatePhone)
      .eq("pickup_date", parsed.data.pickupDate)
      .eq("pickup_time", parsed.data.pickupTime)
      .eq("pickup_address", parsed.data.pickupAddress)
      .eq("destination_address", parsed.data.destinationAddress)
      .limit(1)
      .maybeSingle();

    if (duplicateError) {
      throw duplicateError;
    }

    if (duplicate) {
      return NextResponse.json(
        { error: "This booking request appears to be a duplicate submission." },
        { status: 409 },
      );
    }

    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();

    const { count, error: countError } = await supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .gte("created_at", start)
      .lt("created_at", end);

    if (countError) {
      throw countError;
    }

    const bookingReference = buildBookingReference((count ?? 0) + 1);

    const { data: booking, error: insertError } = await supabase
      .from("bookings")
      .insert({
        booking_reference: bookingReference,
        customer_name: parsed.data.customerName,
        phone: duplicatePhone,
        email: parsed.data.email || null,
        preferred_contact: parsed.data.preferredContact,
        booking_type: parsed.data.bookingType,
        journey_type: parsed.data.journeyType,
        pickup_address: parsed.data.pickupAddress,
        pickup_area: parsed.data.pickupArea || null,
        destination_address: parsed.data.destinationAddress,
        destination_area: parsed.data.destinationArea || null,
        pickup_date: parsed.data.pickupDate,
        pickup_time: parsed.data.pickupTime,
        passengers: parsed.data.passengers,
        large_luggage: parsed.data.largeLuggage,
        small_luggage: parsed.data.smallLuggage,
        flight_number: parsed.data.flightNumber || null,
        airport: parsed.data.airport || null,
        airport_direction: parsed.data.airportDirection || null,
        return_date: parsed.data.returnDate || null,
        return_time: parsed.data.returnTime || null,
        return_pickup: parsed.data.returnPickup || null,
        return_destination: parsed.data.returnDestination || null,
        special_requirements: parsed.data.specialRequirements || null,
        status: "New Request",
      })
      .select("id, booking_reference")
      .single();

    if (insertError) {
      throw insertError;
    }

    await supabase.from("admin_notifications").insert({
      type: "booking",
      title: `New booking request: ${bookingReference}`,
      message: `${parsed.data.customerName} requested ${parsed.data.pickupAddress} to ${parsed.data.destinationAddress}`,
      booking_id: booking.id,
      read: false,
    });

    await sendAdminEmail({
      bookingReference,
      customerName: parsed.data.customerName,
      phone: duplicatePhone,
      pickupAddress: parsed.data.pickupAddress,
      destinationAddress: parsed.data.destinationAddress,
      pickupDate: parsed.data.pickupDate,
      pickupTime: parsed.data.pickupTime,
      passengers: parsed.data.passengers,
      largeLuggage: parsed.data.largeLuggage,
      smallLuggage: parsed.data.smallLuggage,
      specialRequirements: parsed.data.specialRequirements,
    });

    return NextResponse.json({ bookingReference: booking.booking_reference }, { status: 201 });
  } catch (error) {
    console.error("Booking request error", error);
    return NextResponse.json(
      { error: "Unable to submit booking request at this time. Please call or WhatsApp us." },
      { status: 500 },
    );
  }
}
