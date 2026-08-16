import Link from "next/link";
import { siteConfig, whatsappUrl } from "@/lib/config";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#f2c230] bg-[#0f1d3a] pb-24 text-white md:pb-8">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 md:grid-cols-3 lg:px-6">
        <div>
          <p className="text-2xl font-black">Quick Taxi</p>
          <p className="mt-2 text-sm text-[#d7deef]">Reliable local taxi service.</p>
        </div>
        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-wide text-[#f6d35a]">Links</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/book">Book</Link></li>
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/airport-transfers">Airport Transfers</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms & Conditions</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-wide text-[#f6d35a]">Contact</p>
          <a href={siteConfig.phoneTel} className="block text-lg font-bold">{siteConfig.phoneDisplay}</a>
          <a href={whatsappUrl()} target="_blank" rel="noreferrer" className="mt-2 inline-block font-semibold text-[#f6d35a]">
            WhatsApp
          </a>
        </div>
      </div>
    </footer>
  );
}
