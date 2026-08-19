import Image from "next/image";
import Link from "next/link";
import { PublicShell } from "@/components/site/public-shell";
import { siteConfig, whatsappUrl } from "@/lib/config";

const services = [
  "Airport Transfers",
  "Local Journeys",
  "Long-Distance Journeys",
  "6-Seater Taxi (Up to 6 Passengers)",
  "Family and Group Transportation",
  "Advance Bookings",
];

const whyChoose = [
  { title: "Reliable", copy: "Dependable taxi service for your journey." },
  { title: "Safe", copy: "Professional service with customer comfort in mind." },
  { title: "Trusted", copy: "A local taxi service you can rely on." },
  { title: "Advance Booking", copy: "Book ahead for airport journeys and important trips." },
  { title: "6-Seater", copy: "Comfortable transportation for families and groups." },
  { title: "Airport Transfers", copy: "Convenient airport transportation." },
];

export default function Home() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "TaxiService",
    name: "Quick Taxi",
    url: siteConfig.siteUrl,
    telephone: "+353877073363",
    areaServed: ["Dublin", "Dublin Airport", "Surrounding areas"],
    serviceType: ["Airport Transfers", "Local Journeys", "Long-Distance Journeys", "6-Seater Taxi"],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Do I need to pay online?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Online payment is not currently available. Your fare will be discussed and confirmed manually.",
        },
      },
      {
        "@type": "Question",
        name: "How do I book?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Complete the booking form or contact us through WhatsApp/phone.",
        },
      },
    ],
  };

  return (
    <PublicShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <section className="border-b border-[#f2c230] bg-[#0f1d3a] text-white">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 lg:grid-cols-2 lg:px-6 lg:py-20">
          
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f6d35a]">Your Local Taxi Service</p>
            <h1 className="mt-3 text-4xl font-black leading-tight lg:text-6xl">Reliable. Safe. Trusted.</h1>
            <p className="mt-5 max-w-2xl text-base text-[#d7deef]">
              Airport transfers, local journeys and long-distance travel across Ireland.
            </p>
            <p className="mt-2 max-w-2xl text-base text-[#d7deef]">Book in advance for a reliable and comfortable service.</p>
            <p className="mt-2 max-w-2xl text-base text-[#d7deef]">
              Airport transfers, local journeys and long-distance travel for individuals, families and groups.
            </p>
            
            {/* Primary Action Buttons Container */}
            <div className="mt-7 flex flex-wrap justify-center items-center gap-3 lg:justify-start">
              <Link href="/book" className="bg-[#f2c230] px-5 py-3 text-sm font-black text-[#0f1d3a]">
                BOOK A TAXI
              </Link>
              <a href={whatsappUrl()} target="_blank" rel="noreferrer" className="border border-[#f2c230] px-5 py-3 text-sm font-black text-[#f6d35a]">
                WHATSAPP US
              </a>
            </div>
            
            {/* Call Component Box */}
            <a
              href={siteConfig.phoneTel}
              className="mt-6 inline-flex items-center gap-2 text-base font-black text-[#fbc02d] transition-colors hover:text-[#f2c230]"
            >
              <svg
                xmlns="http://w3.org"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-white"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>

              <span className="underline underline-offset-4 decoration-2">
                CALL: {siteConfig.phoneDisplay}
              </span>
            </a>

            {/* Clean, stand-alone review anchor link positioned cleanly below the number block */}
            <a 
              href="https://google.com"
              target="_blank"
              rel="noreferrer"
              className="mt-3 block text-sm font-semibold text-gray-300 hover:text-white underline underline-offset-4 transition duration-200"
            >
              Leave us a review on Google ⭐
            </a>
          </div>

          <div className="relative flex min-h-72 items-center justify-center border border-[#f2c230] bg-[#0b1732] p-6">
            <div className="relative w-full max-w-[450px] aspect-[3/1]">
              <Image
                src="/branding/quicktaxi-logo.png"
                alt="Quick Taxi logo layout"
                fill
                priority={true}
                className="object-contain"
                sizes="(max-width: 768px) 90vw, 450px"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-12 lg:px-6">
        <h2 className="text-3xl font-black">How It Works</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {[
            ["1. Book", "Tell us where and when you need a taxi."],
            ["2. We Contact You", "We review your request and contact you by WhatsApp or phone."],
            ["3. Get Your Fare", "Your fare is provided manually before confirmation."],
            ["4. Travel", "Once confirmed, your driver will be assigned."],
          ].map(([title, copy]) => (
            <article key={title} className="border border-[#c9d4f4] bg-white p-5">
              <h3 className="text-lg font-black">{title}</h3>
              <p className="mt-2 text-sm text-[#2e3d5f]">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
          <h2 className="text-3xl font-black">Services</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {services.map((service) => (
              <article key={service} className="border border-[#c9d4f4] p-5">
                <h3 className="text-xl font-black">{service}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-12 lg:px-6">
        <h2 className="text-3xl font-black">Why Choose Quick Taxi</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {whyChoose.map((item) => (
            <article key={item.title} className="border border-[#c9d4f4] bg-white p-5">
              <h3 className="text-xl font-black">{item.title}</h3>
              <p className="mt-2 text-sm text-[#2e3d5f]">{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#0f1d3a] py-12 text-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-4 px-4 lg:flex-row lg:items-center lg:px-6">
          <div>
            <h2 className="text-3xl font-black">Ready to Request Your Taxi?</h2>
            <p className="mt-2 text-[#d7deef]">Book now or contact us directly on WhatsApp.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/book" className="bg-[#f2c230] px-5 py-3 text-sm font-black text-[#0f1d3a]">BOOK NOW</Link>
            <a href={whatsappUrl()} target="_blank" rel="noreferrer" className="border border-[#f2c230] px-5 py-3 text-sm font-black text-[#f6d35a]">WHATSAPP</a>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
