import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiUser } from "@/lib/admin-api";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, authorized } = await requireAdminApiUser();
  if (!authorized) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const formData = await request.formData();
  const quotedFare = String(formData.get("quotedFare") ?? "").trim();
  const adminNotes = String(formData.get("adminNotes") ?? "").trim();

  const { error } = await supabase
    .from("bookings")
    .update({ quoted_fare: quotedFare || null, admin_notes: adminNotes || null })
    .eq("id", id);

  if (error) {
    return new NextResponse("Unable to update notes", { status: 500 });
  }

  const referer = request.headers.get("referer") ?? "/admin/bookings";
  return NextResponse.redirect(referer, { status: 303 });
}
