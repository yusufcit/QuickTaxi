import { requireAdminUser } from "@/lib/auth";

export default async function AdminDriversPage() {
  const { supabase } = await requireAdminUser();
  const { data: drivers } = await supabase
    .from("drivers")
    .select("id, name, phone, email, vehicle, registration, vehicle_type, capacity, active")
    .order("name", { ascending: true });

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-black text-[#0f1d3a]">Drivers</h1>
      <form method="post" action="/api/admin/drivers" className="grid gap-3 border border-[#c9d4f4] bg-white p-4 md:grid-cols-3">
        <input name="name" required placeholder="Name" className="input" />
        <input name="phone" placeholder="Phone" className="input" />
        <input name="email" placeholder="Email" className="input" />
        <input name="vehicle" placeholder="Vehicle" className="input" />
        <input name="registration" placeholder="Vehicle registration" className="input" />
        <select name="vehicleType" className="input">
          <option>Standard Taxi</option>
          <option>6-Seater</option>
          <option>Wheelchair Accessible</option>
        </select>
        <input name="capacity" type="number" min={1} max={8} defaultValue={4} className="input" />
        <button className="bg-[#0f1d3a] px-3 py-2 text-sm font-black text-white">Add Driver</button>
      </form>

      <div className="overflow-x-auto border border-[#c9d4f4] bg-white p-4">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#d9e2fb] text-xs uppercase text-[#2e3d5f]">
              <th className="py-2">Name</th>
              <th className="py-2">Phone</th>
              <th className="py-2">Email</th>
              <th className="py-2">Vehicle</th>
              <th className="py-2">Registration</th>
              <th className="py-2">Type</th>
              <th className="py-2">Capacity</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {(drivers ?? []).map((driver) => (
              <tr key={driver.id} className="border-b border-[#edf1fd]">
                <td className="py-2">{driver.name}</td>
                <td className="py-2">{driver.phone ?? "-"}</td>
                <td className="py-2">{driver.email ?? "-"}</td>
                <td className="py-2">{driver.vehicle ?? "-"}</td>
                <td className="py-2">{driver.registration ?? "-"}</td>
                <td className="py-2">{driver.vehicle_type ?? "-"}</td>
                <td className="py-2">{driver.capacity ?? "-"}</td>
                <td className="py-2">{driver.active ? "Active" : "Inactive"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
