import { requireAdminUser } from "@/lib/auth";

export default async function AdminSettingsPage() {
  const { supabase } = await requireAdminUser();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", ["business_hours", "booking_unavailable", "service_areas", "airports"]);

  const map = new Map((settings ?? []).map((entry) => [entry.key, entry.value]));

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-black text-[#0f1d3a]">Website Settings</h1>
      <form method="post" action="/api/admin/settings" className="space-y-4 border border-[#c9d4f4] bg-white p-5">
        <label className="block text-sm font-semibold">
          Business Hours
          <textarea name="businessHours" className="input mt-2 min-h-24" defaultValue={String(map.get("business_hours") ?? "Monday-Sunday: configurable")}/>
        </label>
        <label className="block text-sm font-semibold">
          Booking Temporarily Unavailable Message
          <input name="bookingUnavailable" className="input mt-2" defaultValue={String(map.get("booking_unavailable") ?? "")}/>
        </label>
        <label className="block text-sm font-semibold">
          Service Areas (comma separated)
          <input name="serviceAreas" className="input mt-2" defaultValue={String(map.get("service_areas") ?? "Dublin,Dublin Airport,Surrounding areas")}/>
        </label>
        <label className="block text-sm font-semibold">
          Airports (comma separated)
          <input name="airports" className="input mt-2" defaultValue={String(map.get("airports") ?? "Dublin Airport,Cork Airport,Shannon Airport")}/>
        </label>
        <button className="bg-[#0f1d3a] px-4 py-2 text-sm font-black text-white">Save Settings</button>
      </form>
    </section>
  );
}
