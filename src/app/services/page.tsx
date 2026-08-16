import type { Metadata } from "next";
import { PublicShell } from "@/components/site/public-shell";

export const metadata: Metadata = {
  title: "Services | Quick Taxi",
  description: "Airport transfers, local journeys, long-distance travel and 6-seater taxi bookings with Quick Taxi.",
};

const services = [
  {
    title: "Airport Transfers",
    description: "Pre-book your airport transfer and travel with confidence.",
  },
  {
    title: "Local Journeys",
    description: "Taxi transportation for local trips and everyday travel.",
  },
  {
    title: "Long-Distance Journeys",
    description: "Comfortable travel for longer journeys across Ireland.",
  },
  {
    title: "6-Seater Taxi",
    description: "Up to 6 passengers for families, groups and extra luggage.",
  },
];

export default function ServicesPage() {
  return (
    <PublicShell>
      <section className="mx-auto w-full max-w-6xl px-4 py-14 lg:px-6">
        <h1 className="text-4xl font-black">Services</h1>
        <p className="mt-3 max-w-3xl text-base text-[#213255]">
          Quick Taxi provides reliable transport for airport transfers, local journeys, long-distance trips and family or group travel.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {services.map((service) => (
            <article key={service.title} className="border border-[#c9d4f4] bg-white p-6">
              <h2 className="text-2xl font-black">{service.title}</h2>
              <p className="mt-2 text-sm text-[#2e3d5f]">{service.description}</p>
            </article>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
