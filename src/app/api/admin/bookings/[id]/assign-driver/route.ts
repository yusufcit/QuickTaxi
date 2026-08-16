import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiUser } from "@/lib/admin-api";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, authorized } = await requireAdminApiUser();
  if (!authorized) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const formData = await request.formData();
  const driverId = String(formData.get("driverId") ?? "");

  const payload = driverId ? { assigned_driver_id: driverId, status: "Driver Assigned" } : { assigned_driver_id: null };
  const { error } = await supabase.from("bookings").update(payload).eq("id", id);

  if (error) {
    return new NextResponse("Unable to assign driver", { status: 500 });
  }

  const referer = request.headers.get("referer") ?? "/admin/bookings";
  return NextResponse.redirect(referer, { status: 303 });
}
