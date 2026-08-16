import type { Metadata } from "next";
import { PublicShell } from "@/components/site/public-shell";

export const metadata: Metadata = {
  title: "FAQ | Quick Taxi",
  description: "Frequently asked questions about Quick Taxi booking requests and services.",
};

const faqs = [
  {
    q: "Do I need to pay online?",
    a: "No. Online payment is not currently available. Your fare will be discussed and confirmed manually.",
  },
  { q: "How do I book?", a: "Complete the booking form or contact us through WhatsApp/phone." },
  { q: "Can I book in advance?", a: "Yes." },
  { q: "Do you provide airport transfers?", a: "Yes, subject to availability." },
  { q: "Do you have a 6-seater taxi?", a: "Yes, subject to availability." },
  { q: "Can I bring extra luggage?", a: "Please mention your luggage requirements when booking." },
  { q: "How will I receive my fare?", a: "We will contact you by WhatsApp or phone." },
];

export default function FaqPage() {
  return (
    <PublicShell>
      <section className="mx-auto w-full max-w-4xl px-4 py-14 lg:px-6">
        <h1 className="text-4xl font-black">Frequently Asked Questions</h1>
        <div className="mt-8 space-y-4">
          {faqs.map((faq) => (
            <article key={faq.q} className="border border-[#c9d4f4] bg-white p-5">
              <h2 className="text-lg font-black">{faq.q}</h2>
              <p className="mt-2 text-sm text-[#2e3d5f]">{faq.a}</p>
            </article>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
