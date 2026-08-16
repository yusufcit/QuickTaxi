import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiUser } from "@/lib/admin-api";

export async function POST(request: NextRequest) {
  const { supabase, authorized } = await requireAdminApiUser();
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

  const { error } = await supabase.from("site_settings").upsert(settings, { onConflict: "key" });
  if (error) {
    return new NextResponse("Unable to save settings", { status: 500 });
  }

  const referer = request.headers.get("referer") ?? "/admin/settings";
  return NextResponse.redirect(referer, { status: 303 });
}
