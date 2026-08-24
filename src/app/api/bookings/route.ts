import { NextRequest, NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { Resend } from "resend";
import { bookingRequestSchema, sanitizePhone } from "@/lib/booking";
import { checkRateLimit } from "@/lib/rate-limit";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";
import { sendOrderSlackAlert } from "@/lib/notifications/slack";

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
    from: "Quick Taxi <noreply@quicktaxi.ie>",
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

    const db = getFirebaseAdminDb();

    const duplicatePhone = sanitizePhone(parsed.data.phone);
    const possibleDupes = await db
      .collection("bookings")
      .where("phone", "==", duplicatePhone)
      .where("pickup_date", "==", parsed.data.pickupDate)
      .limit(25)
      .get();

    const duplicate = possibleDupes.docs.find((doc) => {
      const value = doc.data() as {
        pickup_time?: string;
        pickup_address?: string;
        destination_address?: string;
      };
      return (
        value.pickup_time === parsed.data.pickupTime
        && value.pickup_address === parsed.data.pickupAddress
        && value.destination_address === parsed.data.destinationAddress
      );
    });

    if (duplicate) {
      return NextResponse.json(
        { error: "This booking request appears to be a duplicate submission." },
        { status: 409 },
      );
    }

    const createdDate = new Date().toISOString().slice(0, 10);
    const todayBookings = await db
      .collection("bookings")
      .where("created_date", "==", createdDate)
      .count()
      .get();
    const bookingReference = buildBookingReference(todayBookings.data().count + 1);

    const now = Timestamp.now();
    const bookingDoc = await db.collection("bookings").add({
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
        created_date: createdDate,
        created_at: now,
        updated_at: now,
      });

    // Fire-and-forget Slack alert — does not block the checkout response
    void sendOrderSlackAlert({
      bookingReference,
      customerName: parsed.data.customerName,
      email: parsed.data.email || null,
      items: [
        `Booking Type: ${parsed.data.bookingType}`,
        `Journey Type: ${parsed.data.journeyType}`,
        `Pickup: ${parsed.data.pickupAddress}`,
        `Destination: ${parsed.data.destinationAddress}`,
        `Pickup Date/Time: ${parsed.data.pickupDate} ${parsed.data.pickupTime}`,
        `Passengers: ${parsed.data.passengers}`,
      ],
      orderTotal: null,
    }).catch((error: unknown) => {
      console.error("Slack webhook failed:", error);
    });

    await db.collection("admin_notifications").add({
      type: "booking",
      title: `New booking request: ${bookingReference}`,
      message: `${parsed.data.customerName} requested ${parsed.data.pickupAddress} to ${parsed.data.destinationAddress}`,
      booking_id: bookingDoc.id,
      read: false,
      created_at: now,
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

    return NextResponse.json({ bookingReference }, { status: 201 });
  } catch (error) {
    console.error("Booking request error", error);
    return NextResponse.json(
      { error: "Unable to submit booking request at this time. Please call or WhatsApp us." },
      { status: 500 },
    );
  }
}
