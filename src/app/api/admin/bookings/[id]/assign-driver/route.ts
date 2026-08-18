import { NextRequest, NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { requireAdminApiUser } from "@/lib/admin-api";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { db, authorized } = await requireAdminApiUser();
  if (!authorized) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const formData = await request.formData();
  const driverId = String(formData.get("driverId") ?? "");

  const payload = driverId
    ? { assigned_driver_id: driverId, status: "Driver Assigned", updated_at: Timestamp.now() }
    : { assigned_driver_id: null, updated_at: Timestamp.now() };

  await db.collection("bookings").doc(id).set(payload, { merge: true });

  const referer = request.headers.get("referer") ?? "/admin/bookings";
  return NextResponse.redirect(referer, { status: 303 });
}
