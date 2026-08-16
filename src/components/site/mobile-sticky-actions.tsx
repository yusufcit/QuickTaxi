import Link from "next/link";
import { siteConfig, whatsappUrl } from "@/lib/config";

export function MobileStickyActions() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-[#f2c230] bg-[#0f1d3a] md:hidden">
      <a
        href={siteConfig.phoneTel}
        className="px-2 py-3 text-center text-sm font-extrabold tracking-wide text-white"
      >
        CALL
      </a>
      <a
        href={whatsappUrl()}
        target="_blank"
        rel="noreferrer"
        className="border-x border-[#f2c230] px-2 py-3 text-center text-sm font-extrabold tracking-wide text-[#f6d35a]"
      >
        WHATSAPP
      </a>
      <Link href="/book" className="px-2 py-3 text-center text-sm font-extrabold tracking-wide text-white">
        BOOK NOW
      </Link>
    </div>
  );
}
