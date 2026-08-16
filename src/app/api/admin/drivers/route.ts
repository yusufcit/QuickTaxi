import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiUser } from "@/lib/admin-api";

export async function POST(request: NextRequest) {
  const { supabase, authorized } = await requireAdminApiUser();
  if (!authorized) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const formData = await request.formData();

  const payload = {
    name: String(formData.get("name") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim() || null,
    email: String(formData.get("email") ?? "").trim() || null,
    vehicle: String(formData.get("vehicle") ?? "").trim() || null,
    registration: String(formData.get("registration") ?? "").trim() || null,
    vehicle_type: String(formData.get("vehicleType") ?? "Standard Taxi").trim(),
    capacity: Number(formData.get("capacity") ?? 4),
    active: true,
  };

  if (!payload.name) {
    return new NextResponse("Driver name is required", { status: 400 });
  }

  const { error } = await supabase.from("drivers").insert(payload);
  if (error) {
    return new NextResponse("Unable to create driver", { status: 500 });
  }

  const referer = request.headers.get("referer") ?? "/admin/drivers";
  return NextResponse.redirect(referer, { status: 303 });
}
