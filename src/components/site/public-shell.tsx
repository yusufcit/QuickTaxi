import { ReactNode } from "react";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { MobileStickyActions } from "@/components/site/mobile-sticky-actions";

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f4f6fb] text-[#0f1d3a]">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
      <MobileStickyActions />
    </div>
  );
}
