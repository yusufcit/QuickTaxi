import type { Metadata } from "next";
import { BookingForm } from "@/components/booking/booking-form";
import { PublicShell } from "@/components/site/public-shell";

export const metadata: Metadata = {
  title: "Book Your Taxi | Quick Taxi",
  description:
    "Submit your journey details and Quick Taxi will contact you by WhatsApp or phone with your fare and booking confirmation.",
};

export default function BookPage() {
  return (
    <PublicShell>
      <section className="mx-auto w-full max-w-5xl px-4 py-14 lg:px-6">
        <h1 className="text-4xl font-black">Book Your Taxi</h1>
        <p className="mt-3 max-w-3xl text-[#213255]">
          Submit your journey details and we&apos;ll get back to you with your fare and booking confirmation.
        </p>
        <p className="mt-2 max-w-3xl text-sm font-semibold text-[#213255]">
          Request Your Taxi: Tell us where you need to go, when you need to travel and how many passengers are travelling. Submit your request and we&apos;ll contact you by WhatsApp or phone to discuss your fare and confirm your booking.
        </p>
        <p className="mt-2 text-sm font-semibold text-[#213255]">
          Please allow sufficient time for airport journeys.
        </p>
        <div className="mt-8 border border-[#c9d4f4] bg-white p-6">
          <BookingForm />
        </div>
      </section>
    </PublicShell>
  );
}
