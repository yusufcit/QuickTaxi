import { NextRequest, NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { bookingStatuses } from "@/lib/config";
import { requireAdminApiUser } from "@/lib/admin-api";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { db, user, authorized } = await requireAdminApiUser();
  if (!authorized || !user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const formData = await request.formData();
  const status = String(formData.get("status") ?? "");
  if (!bookingStatuses.includes(status as (typeof bookingStatuses)[number])) {
    return new NextResponse("Invalid status", { status: 400 });
  }

  const oldSnapshot = await db.collection("bookings").doc(id).get();
  const oldData = oldSnapshot.exists ? (oldSnapshot.data() as { status?: string }) : null;

  await db.collection("bookings").doc(id).set({ status, updated_at: Timestamp.now() }, { merge: true });

  await db.collection("booking_status_history").add({
    booking_id: id,
    old_status: oldData?.status ?? null,
    new_status: status,
    changed_by: user.uid,
    created_at: Timestamp.now(),
  });

  const referer = request.headers.get("referer") ?? "/admin/bookings";
  return NextResponse.redirect(referer, { status: 303 });
}
