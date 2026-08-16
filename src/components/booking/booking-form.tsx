"use client";

import { FormEvent, useMemo, useState } from "react";
import { bookingWhatsappMessage, siteConfig, whatsappUrl } from "@/lib/config";

type FormState = {
  customerName: string;
  phone: string;
  email: string;
  preferredContact: "WhatsApp" | "Phone" | "Email";
  bookingType: "Advance Booking" | "As Soon As Possible";
  journeyType: "One Way" | "Return Journey";
  pickupAddress: string;
  pickupArea: string;
  destinationAddress: string;
  destinationArea: string;
  pickupDate: string;
  pickupTime: string;
  passengers: string;
  largeLuggage: string;
  smallLuggage: string;
  flightNumber: string;
  airport: string;
  airportDirection: "Arrival" | "Departure";
  returnDate: string;
  returnTime: string;
  returnPickup: string;
  returnDestination: string;
  specialRequirements: string;
  website: string;
};

const initialState: FormState = {
  customerName: "",
  phone: "",
  email: "",
  preferredContact: "WhatsApp",
  bookingType: "Advance Booking",
  journeyType: "One Way",
  pickupAddress: "",
  pickupArea: "",
  destinationAddress: "",
  destinationArea: "",
  pickupDate: "",
  pickupTime: "",
  passengers: "1",
  largeLuggage: "0",
  smallLuggage: "0",
  flightNumber: "",
  airport: "",
  airportDirection: "Arrival",
  returnDate: "",
  returnTime: "",
  returnPickup: "",
  returnDestination: "",
  specialRequirements: "",
  website: "",
};

type SubmissionSuccess = {
  bookingReference: string;
};

export function BookingForm() {
  const [values, setValues] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<SubmissionSuccess | null>(null);

  const isReturn = useMemo(() => values.journeyType === "Return Journey", [values.journeyType]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to submit your booking request.");
      }

      setSuccess({ bookingReference: payload.bookingReference });
      setValues(initialState);
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Booking request failed.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-none border-2 border-[#f2c230] bg-[#fffdf4] p-6">
        <h2 className="text-2xl font-black text-[#0f1d3a]">Booking Request Received</h2>
        <p className="mt-3 text-sm text-[#0f1d3a]">
          Thank you. Your taxi request has been received.
        </p>
        <p className="mt-2 text-sm text-[#0f1d3a]">
          We will contact you shortly by WhatsApp or phone to discuss your fare and confirm your booking.
        </p>
        <p className="mt-4 text-sm font-bold text-[#0f1d3a]">Booking Reference: {success.bookingReference}</p>
        <p className="mt-1 text-base font-bold text-[#0f1d3a]">{siteConfig.phoneDisplay}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href={whatsappUrl(bookingWhatsappMessage(success.bookingReference))} target="_blank" rel="noreferrer" className="bg-[#f2c230] px-4 py-2 text-sm font-extrabold text-[#0f1d3a]">
            WhatsApp Us
          </a>
          <a href={siteConfig.phoneTel} className="border border-[#0f1d3a] px-4 py-2 text-sm font-extrabold text-[#0f1d3a]">
            Call Us
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <input
        type="text"
        name="website"
        value={values.website}
        onChange={(event) => setValues((prev) => ({ ...prev, website: event.target.value }))}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <section className="grid gap-4 md:grid-cols-2">
        <h3 className="col-span-full text-lg font-black text-[#0f1d3a]">Customer Information</h3>
        <Field label="Full Name *">
          <input required value={values.customerName} onChange={(event) => setValues((prev) => ({ ...prev, customerName: event.target.value }))} className="input" />
        </Field>
        <Field label="Mobile Number *">
          <input required value={values.phone} onChange={(event) => setValues((prev) => ({ ...prev, phone: event.target.value }))} className="input" />
        </Field>
        <Field label="Email Address">
          <input type="email" value={values.email} onChange={(event) => setValues((prev) => ({ ...prev, email: event.target.value }))} className="input" />
        </Field>
        <Field label="Preferred Contact Method">
          <select value={values.preferredContact} onChange={(event) => setValues((prev) => ({ ...prev, preferredContact: event.target.value as FormState["preferredContact"] }))} className="input">
            <option>WhatsApp</option>
            <option>Phone</option>
            <option>Email</option>
          </select>
        </Field>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <h3 className="col-span-full text-lg font-black text-[#0f1d3a]">Journey Details</h3>
        <Field label="Booking Type">
          <select value={values.bookingType} onChange={(event) => setValues((prev) => ({ ...prev, bookingType: event.target.value as FormState["bookingType"] }))} className="input">
            <option>Advance Booking</option>
            <option>As Soon As Possible</option>
          </select>
        </Field>
        <Field label="Journey Type">
          <select value={values.journeyType} onChange={(event) => setValues((prev) => ({ ...prev, journeyType: event.target.value as FormState["journeyType"] }))} className="input">
            <option>One Way</option>
            <option>Return Journey</option>
          </select>
        </Field>
        <Field label="Pickup Address *">
          <input required value={values.pickupAddress} onChange={(event) => setValues((prev) => ({ ...prev, pickupAddress: event.target.value }))} className="input" />
        </Field>
        <Field label="Pickup Area / Town">
          <input value={values.pickupArea} onChange={(event) => setValues((prev) => ({ ...prev, pickupArea: event.target.value }))} className="input" />
        </Field>
        <Field label="Destination Address *">
          <input required value={values.destinationAddress} onChange={(event) => setValues((prev) => ({ ...prev, destinationAddress: event.target.value }))} className="input" />
        </Field>
        <Field label="Destination Area / Town">
          <input value={values.destinationArea} onChange={(event) => setValues((prev) => ({ ...prev, destinationArea: event.target.value }))} className="input" />
        </Field>
        <Field label="Pickup Date *">
          <input type="date" required value={values.pickupDate} onChange={(event) => setValues((prev) => ({ ...prev, pickupDate: event.target.value }))} className="input" />
        </Field>
        <Field label="Pickup Time *">
          <input type="time" required value={values.pickupTime} onChange={(event) => setValues((prev) => ({ ...prev, pickupTime: event.target.value }))} className="input" />
        </Field>
        <Field label="Number of Passengers *">
          <select value={values.passengers} onChange={(event) => setValues((prev) => ({ ...prev, passengers: event.target.value }))} className="input">
            {[1, 2, 3, 4, 5, 6].map((count) => (
              <option key={count} value={count}>{count}</option>
            ))}
          </select>
        </Field>
        <Field label="Large Bags">
          <input type="number" min={0} max={20} value={values.largeLuggage} onChange={(event) => setValues((prev) => ({ ...prev, largeLuggage: event.target.value }))} className="input" />
        </Field>
        <Field label="Small Bags">
          <input type="number" min={0} max={20} value={values.smallLuggage} onChange={(event) => setValues((prev) => ({ ...prev, smallLuggage: event.target.value }))} className="input" />
        </Field>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <h3 className="col-span-full text-lg font-black text-[#0f1d3a]">Airport Information (Optional)</h3>
        <Field label="Flight Number">
          <input value={values.flightNumber} onChange={(event) => setValues((prev) => ({ ...prev, flightNumber: event.target.value }))} className="input" />
        </Field>
        <Field label="Airport">
          <input value={values.airport} onChange={(event) => setValues((prev) => ({ ...prev, airport: event.target.value }))} className="input" />
        </Field>
        <Field label="Arrival / Departure">
          <select value={values.airportDirection} onChange={(event) => setValues((prev) => ({ ...prev, airportDirection: event.target.value as FormState["airportDirection"] }))} className="input">
            <option>Arrival</option>
            <option>Departure</option>
          </select>
        </Field>
      </section>

      {isReturn && (
        <section className="grid gap-4 md:grid-cols-2">
          <h3 className="col-span-full text-lg font-black text-[#0f1d3a]">Return Journey</h3>
          <Field label="Return Date">
            <input type="date" value={values.returnDate} onChange={(event) => setValues((prev) => ({ ...prev, returnDate: event.target.value }))} className="input" />
          </Field>
          <Field label="Return Time">
            <input type="time" value={values.returnTime} onChange={(event) => setValues((prev) => ({ ...prev, returnTime: event.target.value }))} className="input" />
          </Field>
          <Field label="Return Pickup Address">
            <input value={values.returnPickup} onChange={(event) => setValues((prev) => ({ ...prev, returnPickup: event.target.value }))} className="input" />
          </Field>
          <Field label="Return Destination">
            <input value={values.returnDestination} onChange={(event) => setValues((prev) => ({ ...prev, returnDestination: event.target.value }))} className="input" />
          </Field>
        </section>
      )}

      <Field label="Any special requirements?">
        <textarea value={values.specialRequirements} onChange={(event) => setValues((prev) => ({ ...prev, specialRequirements: event.target.value }))} className="input min-h-28" />
      </Field>

      <p className="border-l-4 border-[#f2c230] bg-[#fffdf4] px-3 py-2 text-sm text-[#0f1d3a]">
        Please note: Submitting a booking request does not automatically confirm your taxi. We will contact you to discuss the fare and confirm availability.
      </p>

      {values.bookingType === "As Soon As Possible" && (
        <p className="text-sm font-semibold text-[#0f1d3a]">
          For immediate taxi requests, please call or WhatsApp us to confirm availability.
        </p>
      )}

      {error && <p className="text-sm font-semibold text-red-700">{error}</p>}

      <button type="submit" disabled={isSubmitting} className="w-full bg-[#f2c230] px-4 py-3 text-sm font-black text-[#0f1d3a] disabled:opacity-50">
        {isSubmitting ? "Submitting..." : "Submit Booking Request"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2 text-sm font-semibold text-[#0f1d3a]">
      {label}
      {children}
    </label>
  );
}
