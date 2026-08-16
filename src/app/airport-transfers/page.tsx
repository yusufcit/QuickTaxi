import type { Metadata } from "next";
import { PublicShell } from "@/components/site/public-shell";

export const metadata: Metadata = {
  title: "Airport Transfers | Quick Taxi",
  description: "Advance airport pickup and drop-off booking requests for individuals, families and groups.",
};

const airports = [
  "Dublin Airport",
  "Cork Airport",
  "Shannon Airport",
  "Belfast International Airport",
  "Belfast City Airport",
];

export default function AirportTransfersPage() {
  return (
    <PublicShell>
      <section className="mx-auto w-full max-w-6xl px-4 py-14 lg:px-6">
        <h1 className="text-4xl font-black">Airport Transfers</h1>
        <p className="mt-4 max-w-3xl text-[#213255]">
          Book airport pickups and drop-offs in advance for dependable travel planning. Share flight details, luggage requirements and preferred contact method in your booking request.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="border border-[#c9d4f4] bg-white p-6">
            <h2 className="text-2xl font-black">What We Need</h2>
            <ul className="mt-4 space-y-2 text-sm text-[#2e3d5f]">
              <li>Pickup and destination details</li>
              <li>Date and time</li>
              <li>Passenger and luggage details</li>
              <li>Flight number for airport journeys</li>
            </ul>
          </div>
          <div className="border border-[#c9d4f4] bg-white p-6">
            <h2 className="text-2xl font-black">Available Airports</h2>
            <p className="mt-2 text-xs text-[#2e3d5f]">Subject to availability. Airports are editable from admin settings.</p>
            <ul className="mt-3 space-y-2 text-sm text-[#2e3d5f]">
              {airports.map((airport) => (
                <li key={airport}>{airport}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
