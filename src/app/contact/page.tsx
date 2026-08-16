import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/site/public-shell";
import { siteConfig, whatsappUrl } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contact | Quick Taxi",
  description: "Call or WhatsApp Quick Taxi for bookings and enquiries.",
};

export default function ContactPage() {
  return (
    <PublicShell>
      <section className="mx-auto w-full max-w-4xl px-4 py-14 lg:px-6">
        <h1 className="text-4xl font-black">Contact Quick Taxi</h1>
        <p className="mt-3 text-[#213255]">Call or WhatsApp us for enquiries, availability, and booking support.</p>
        <div className="mt-8 space-y-3 border border-[#c9d4f4] bg-white p-6">
          <p className="text-lg font-black">Quick Taxi</p>
          <a href={siteConfig.phoneTel} className="block text-base font-bold">Phone: {siteConfig.phoneDisplay}</a>
          <a href={whatsappUrl()} target="_blank" rel="noreferrer" className="block text-base font-bold">WhatsApp: {siteConfig.whatsappDisplay}</a>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href={siteConfig.phoneTel} className="bg-[#f2c230] px-4 py-2 text-sm font-extrabold text-[#0f1d3a]">Call Now</a>
            <a href={whatsappUrl()} target="_blank" rel="noreferrer" className="border border-[#0f1d3a] px-4 py-2 text-sm font-extrabold text-[#0f1d3a]">WhatsApp</a>
            <Link href="/book" className="bg-[#0f1d3a] px-4 py-2 text-sm font-extrabold text-white">Book a Taxi</Link>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
