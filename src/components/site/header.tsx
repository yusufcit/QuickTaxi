import Link from "next/link";
import Image from "next/image";
import { PhoneCall, MessageCircle } from "lucide-react";
import { siteConfig, whatsappUrl } from "@/lib/config";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/airport-transfers", label: "Airport Transfers" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
  { href: "/book", label: "Book Now" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-[#f2c230] bg-[#0f1d3a] text-white">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/branding/quicktaxi-logo.png"
            alt="Quick Taxi logo"
            width={44}
            height={44}
            className="h-11 w-11 object-contain"
          />
          <div>
            <p className="text-xl font-black tracking-wide">Quick Taxi</p>
            <p className="text-xs text-[#f6d35a]">Reliable local taxi service</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-semibold lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-[#f6d35a]">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <a
            href={siteConfig.phoneTel}
            className="inline-flex items-center gap-2 rounded-none border border-[#f2c230] px-3 py-2 text-sm font-bold text-[#f6d35a] hover:bg-[#f2c230] hover:text-[#0f1d3a]"
          >
            <PhoneCall className="h-4 w-4" />
            Call: {siteConfig.phoneDisplay}
          </a>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-none bg-[#f2c230] px-3 py-2 text-sm font-bold text-[#0f1d3a] hover:bg-[#ffd95d]"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
          <Link
            href="/book"
            className="inline-flex items-center rounded-none bg-white px-3 py-2 text-sm font-extrabold text-[#0f1d3a] hover:bg-[#eef2ff]"
          >
            Book Now
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <a href={siteConfig.phoneTel} className="rounded-none border border-[#f2c230] p-2 text-[#f6d35a]">
            <PhoneCall className="h-4 w-4" />
          </a>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noreferrer"
            className="rounded-none border border-[#f2c230] p-2 text-[#f6d35a]"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
        </div>
      </div>
      <div className="border-t border-[#223768] bg-[#12244a] px-4 py-2 text-xs font-semibold text-[#f6d35a] md:hidden">
        Call: {siteConfig.phoneDisplay} | WhatsApp: {siteConfig.whatsappDisplay}
      </div>
    </header>
  );
}
