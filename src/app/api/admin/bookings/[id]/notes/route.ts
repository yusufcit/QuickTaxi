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
  const quotedFare = String(formData.get("quotedFare") ?? "").trim();
  const adminNotes = String(formData.get("adminNotes") ?? "").trim();

  await db.collection("bookings").doc(id).set(
    {
      quoted_fare: quotedFare || null,
      admin_notes: adminNotes || null,
      updated_at: Timestamp.now(),
    },
    { merge: true },
  );

  const referer = request.headers.get("referer") ?? "/admin/bookings";
  return NextResponse.redirect(referer, { status: 303 });
}
