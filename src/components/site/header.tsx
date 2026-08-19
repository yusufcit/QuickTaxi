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
            width={384}
            height={128}
            priority={true}
            className="h-11 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-semibold lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-[#f6d35a]">
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Container */}
        <div className="hidden items-center gap-2 md:flex">
          {/* Facebook f Logo Icon placed on the left side of desktop call actions */}
          <a 
            href="https://www.facebook.com/profile.php?id=61593252488154" 
            target="_blank" 
            rel="noreferrer" 
            className="border border-[#f2c230] p-2 text-[#f6d35a] hover:bg-[#f2c230] hover:text-[#0f1d3a] transition inline-flex items-center justify-center h-10 w-10"
            aria-label="Facebook Profile"
          >
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
            </svg>
          </a>

          <a
            href={siteConfig.phoneTel}
            className="inline-flex items-center gap-2 rounded-none border border-[#f2c230] px-3 py-2 text-sm font-bold text-[#f6d35a] hover:bg-[#f2c230] hover:text-[#0f1d3a] h-10"
          >
            <PhoneCall className="h-4 w-4" />
            Call: {siteConfig.phoneDisplay}
          </a>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-none bg-[#f2c230] px-3 py-2 text-sm font-bold text-[#0f1d3a] hover:bg-[#ffd95d] h-10"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
          <Link
            href="/book"
            className="inline-flex items-center rounded-none bg-white px-3 py-2 text-sm font-extrabold text-[#0f1d3a] hover:bg-[#eef2ff] h-10"
          >
            Book Now
          </Link>
        </div>

        {/* Mobile Container */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Facebook f Logo Icon placed on the left side of mobile call actions */}
          <a 
            href="https://www.facebook.com/profile.php?id=61593252488154" 
            target="_blank" 
            rel="noreferrer" 
            className="rounded-none border border-[#f2c230] p-2 text-[#f6d35a]"
            aria-label="Facebook Profile"
          >
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
            </svg>
          </a>

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
