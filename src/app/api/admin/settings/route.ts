import { NextRequest, NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { requireAdminApiUser } from "@/lib/admin-api";

export async function POST(request: NextRequest) {
  const { db, authorized } = await requireAdminApiUser();
  if (!authorized) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const formData = await request.formData();

  const settings = [
    { key: "business_hours", value: String(formData.get("businessHours") ?? "").trim() },
    { key: "booking_unavailable", value: String(formData.get("bookingUnavailable") ?? "").trim() },
    { key: "service_areas", value: String(formData.get("serviceAreas") ?? "").trim() },
    { key: "airports", value: String(formData.get("airports") ?? "").trim() },
  ];

  await Promise.all(
    settings.map((setting) =>
      db
        .collection("site_settings")
        .doc(setting.key)
        .set({ value: setting.value, updated_at: Timestamp.now() }, { merge: true }),
    ),
  );

  const referer = request.headers.get("referer") ?? "/admin/settings";
  return NextResponse.redirect(referer, { status: 303 });
}
