export const siteConfig = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://quicktaxi.ie",
  businessName: process.env.NEXT_PUBLIC_BUSINESS_NAME ?? "Quick Taxi",
  phoneDisplay: "+353 87 707 3363",
  phoneTel: "tel:+353877073363",
  whatsappDigits: process.env.NEXT_PUBLIC_WHATSAPP ?? "353877073363",
  whatsappDisplay: "+353 87 707 3363",
  defaultWhatsappMessage:
    "Hello Quick Taxi, I would like to enquire about a taxi booking.",
};

export const bookingStatuses = [
  "New Request",
  "Contacted",
  "Quote Given",
  "Customer Accepted",
  "Confirmed",
  "Driver Assigned",
  "Driver On The Way",
  "Completed",
  "Cancelled",
  "Rejected",
] as const;

export type BookingStatus = (typeof bookingStatuses)[number];

export const irelandPhoneRegex = /^(?:\+353|0)8[356789]\d{7}$/;

export function whatsappUrl(message?: string, customDigits?: string): string {
  const digits = customDigits ?? siteConfig.whatsappDigits;
  const text = encodeURIComponent(message ?? siteConfig.defaultWhatsappMessage);
  return `https://wa.me/${digits}?text=${text}`;
}

export function bookingWhatsappMessage(reference: string): string {
  return `Hello Quick Taxi, I am enquiring about booking ${reference}.`;
}
