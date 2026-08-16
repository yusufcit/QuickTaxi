import { z } from "zod";
import { irelandPhoneRegex } from "@/lib/config";

const today = new Date();
today.setHours(0, 0, 0, 0);

export const bookingRequestSchema = z
  .object({
    customerName: z.string().trim().min(2, "Please enter your full name."),
    phone: z
      .string()
      .trim()
      .min(10, "Please enter your mobile number.")
      .refine((value) => irelandPhoneRegex.test(value.replace(/\s+/g, "")), {
        message: "Please enter a valid Irish mobile number.",
      }),
    email: z
      .string()
      .trim()
      .optional()
      .transform((value) => value || "")
      .refine((value) => value.length === 0 || z.string().email().safeParse(value).success, {
        message: "Please enter a valid email address.",
      }),
    preferredContact: z.enum(["WhatsApp", "Phone", "Email"]),
    bookingType: z.enum(["Advance Booking", "As Soon As Possible"]),
    journeyType: z.enum(["One Way", "Return Journey"]),
    pickupAddress: z.string().trim().min(5, "Please enter pickup address."),
    pickupArea: z.string().trim().optional(),
    destinationAddress: z.string().trim().min(5, "Please enter destination address."),
    destinationArea: z.string().trim().optional(),
    pickupDate: z.string().min(1, "Please select pickup date."),
    pickupTime: z.string().min(1, "Please select pickup time."),
    passengers: z.coerce.number().int().min(1).max(6),
    largeLuggage: z.coerce.number().int().min(0).max(20).default(0),
    smallLuggage: z.coerce.number().int().min(0).max(20).default(0),
    flightNumber: z.string().trim().optional(),
    airport: z.string().trim().optional(),
    airportDirection: z.enum(["Arrival", "Departure"]).optional(),
    returnDate: z.string().optional(),
    returnTime: z.string().optional(),
    returnPickup: z.string().trim().optional(),
    returnDestination: z.string().trim().optional(),
    specialRequirements: z.string().trim().max(1200).optional(),
    website: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const pickupDate = new Date(data.pickupDate);
    pickupDate.setHours(0, 0, 0, 0);

    if (Number.isNaN(pickupDate.getTime()) || pickupDate < today) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["pickupDate"],
        message: "Pickup date cannot be in the past.",
      });
    }

    if (data.journeyType === "Return Journey") {
      if (!data.returnDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["returnDate"],
          message: "Please provide return date.",
        });
      }
      if (!data.returnTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["returnTime"],
          message: "Please provide return time.",
        });
      }
    }

    if (data.preferredContact === "Email" && !data.email) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["email"],
        message: "Email is required if you choose email contact.",
      });
    }
  });

export type BookingRequestInput = z.infer<typeof bookingRequestSchema>;

export function sanitizePhone(raw: string): string {
  return raw.replace(/\s+/g, "");
}
