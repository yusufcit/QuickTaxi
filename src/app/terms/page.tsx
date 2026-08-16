import { PublicShell } from "@/components/site/public-shell";

export default function TermsPage() {
  return (
    <PublicShell>
      <section className="mx-auto w-full max-w-4xl space-y-5 px-4 py-14 lg:px-6">
        <h1 className="text-4xl font-black">Terms & Conditions</h1>
        <p className="text-sm text-[#213255]">Submitting a booking form creates a booking request only. A booking is confirmed only after direct confirmation by Quick Taxi.</p>
        <p className="text-sm text-[#213255]">Fares are discussed and agreed manually by WhatsApp or phone before final confirmation.</p>
        <p className="text-sm text-[#213255]">Cancellation, waiting time, no-show handling, and airport delay policies may vary and will be confirmed by the business before booking confirmation.</p>
        <p className="text-sm text-[#213255]">Please provide accurate passenger, luggage and contact details so we can serve you safely and efficiently.</p>
      </section>
    </PublicShell>
  );
}
