import { PublicShell } from "@/components/site/public-shell";

export default function PrivacyPolicyPage() {
  return (
    <PublicShell>
      <section className="mx-auto w-full max-w-4xl space-y-5 px-4 py-14 lg:px-6">
        <h1 className="text-4xl font-black">Privacy Policy</h1>
        <p className="text-sm text-[#213255]">Quick Taxi processes booking details to provide transport services, contact customers, and manage booking requests.</p>
        <p className="text-sm text-[#213255]">We only collect information required to process a booking request, such as name, contact details, journey details, and relevant service requirements.</p>
        <p className="text-sm text-[#213255]">Booking records are restricted to authorized administrators and are not publicly visible.</p>
        <p className="text-sm text-[#213255]">For data update or deletion requests, please contact Quick Taxi directly.</p>
      </section>
    </PublicShell>
  );
}
