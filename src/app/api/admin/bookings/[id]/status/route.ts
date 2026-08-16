import { NextRequest, NextResponse } from "next/server";
import { bookingStatuses } from "@/lib/config";
import { requireAdminApiUser } from "@/lib/admin-api";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, user, authorized } = await requireAdminApiUser();
  if (!authorized || !user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const formData = await request.formData();
  const status = String(formData.get("status") ?? "");
  if (!bookingStatuses.includes(status as (typeof bookingStatuses)[number])) {
    return new NextResponse("Invalid status", { status: 400 });
  }

  const { data: old } = await supabase.from("bookings").select("status").eq("id", id).maybeSingle();

  const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
  if (error) {
    return new NextResponse("Unable to update status", { status: 500 });
  }

  await supabase.from("booking_status_history").insert({
    booking_id: id,
    old_status: old?.status ?? null,
    new_status: status,
    changed_by: user.id,
  });

  const referer = request.headers.get("referer") ?? "/admin/bookings";
  return NextResponse.redirect(referer, { status: 303 });
}
