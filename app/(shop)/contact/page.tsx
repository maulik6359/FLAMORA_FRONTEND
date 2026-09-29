"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    setSent(true);

    toast.success("Message sent", {
      description:
        "Thank you for contacting FLĀMORÁ. We’ll be in touch shortly.",
    });

    event.currentTarget.reset();

    setTimeout(() => {
      setSent(false);
    }, 3000);
  };

  return (
    <main>
      {/* HERO */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1600px] px-4 py-20 md:px-8 md:py-28">
          <div className="max-w-4xl">
            <p className="eyebrow text-gold-deep">
              FLĀMORÁ Client Services
            </p>

            <h1 className="mt-5 font-display text-[clamp(3rem,7vw,6.5rem)] leading-[0.95] tracking-[-0.03em]">
              We would love
              <span className="block italic text-gold-deep">
                to hear from you.
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
              Whether you are searching for the perfect piece,
              planning a private appointment or considering a
              bespoke commission, our team is here to assist you.
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT + FORM */}
      <section className="mx-auto max-w-[1600px] px-4 py-20 md:px-8 md:py-28">
        <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          {/* LEFT */}
          <div>
            <p className="eyebrow">
              Visit the Atelier
            </p>

            <h2 className="mt-5 max-w-lg font-display text-[clamp(2.3rem,4vw,4rem)] leading-[1.05]">
              A more personal way
              <span className="block italic text-gold-deep">
                to discover FLĀMORÁ.
              </span>
            </h2>

            <p className="mt-7 max-w-lg text-sm leading-7 text-muted-foreground">
              Visit our Melbourne atelier for a private
              one-to-one consultation. Discover our collections,
              explore stone options, discuss sizing or begin a
              bespoke jewellery commission.
            </p>

            {/* CONTACT DETAILS */}
            <div className="mt-12 divide-y divide-border border-y border-border">
              <div className="grid grid-cols-[45px_1fr] gap-4 py-6">
                <MapPin
                  className="mt-1 size-5 text-gold-deep"
                  strokeWidth={1.3}
                />

                <div>
                  <p className="eyebrow">
                    Melbourne Atelier
                  </p>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    4-5, 2nd Floor, Saurashtra Diamond Estate, Near Savani Diamond co-op Society
                    <br />
                    Surat 394101
                    <br />
                    India
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-[45px_1fr] gap-4 py-6">
                <Mail
                  className="mt-1 size-5 text-gold-deep"
                  strokeWidth={1.3}
                />

                <div>
                  <p className="eyebrow">
                    Email
                  </p>

                  <a
                    href="flamoraandco@gmail.com "
                    className="mt-2 inline-block text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    flamoraandco@gmail.com 
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-[45px_1fr] gap-4 py-6">
                <Phone
                  className="mt-1 size-5 text-gold-deep"
                  strokeWidth={1.3}
                />

                <div>
                  <p className="eyebrow">
                    Telephone
                  </p>

                  <a
                    href="tel:+91 91040 68060"
                    className="mt-2 inline-block text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    +91 91040 68060
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-[45px_1fr] gap-4 py-6">
                <CalendarDays
                  className="mt-1 size-5 text-gold-deep"
                  strokeWidth={1.3}
                />

                <div>
                  <p className="eyebrow">
                    Appointments
                  </p>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Tuesday – Saturday
                    <br />
                    10:00 AM – 5:00 PM
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-7 text-xs leading-6 text-muted-foreground">
              Private consultations are available by appointment
              to ensure our team can dedicate uninterrupted time
              to your visit.
            </p>
          </div>

          {/* FORM */}
          <div className="border border-border bg-silk/20 p-6 sm:p-10 lg:p-12">
            <p className="eyebrow text-gold-deep">
              Send an enquiry
            </p>

            <h2 className="mt-4 font-display text-3xl md:text-4xl">
              How can we help?
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-7 text-muted-foreground">
              Share a few details below and our client services
              team will get back to you as soon as possible.
            </p>

            <form
              className="mt-10 space-y-7"
              onSubmit={handleSubmit}
            >
              <div className="grid gap-7 sm:grid-cols-2">
                <FormField
                  id="contact-first-name"
                  label="First name"
                  autoComplete="given-name"
                />

                <FormField
                  id="contact-last-name"
                  label="Last name"
                  autoComplete="family-name"
                />
              </div>

              <FormField
                id="contact-email"
                label="Email"
                type="email"
                autoComplete="email"
              />

              <FormField
                id="contact-phone"
                label="Telephone"
                type="tel"
                autoComplete="tel"
                required={false}
              />

              {/* ENQUIRY TYPE */}
              <div>
                <label
                  htmlFor="contact-enquiry"
                  className="eyebrow"
                >
                  Enquiry
                </label>

                <select
                  id="contact-enquiry"
                  defaultValue=""
                  required
                  className="mt-3 w-full border-b border-border bg-transparent py-3 text-sm text-foreground focus:border-gold-deep focus:outline-none"
                >
                  <option value="" disabled>
                    Select an enquiry
                  </option>

                  <option value="appointment">
                    Private appointment
                  </option>

                  <option value="product">
                    Product enquiry
                  </option>

                  <option value="bespoke">
                    Bespoke commission
                  </option>

                  <option value="sizing">
                    Sizing & alterations
                  </option>

                  <option value="order">
                    Order assistance
                  </option>

                  <option value="other">
                    Other
                  </option>
                </select>
              </div>

              {/* MESSAGE */}
              <div>
                <label
                  htmlFor="contact-message"
                  className="eyebrow"
                >
                  Message
                </label>

                <textarea
                  id="contact-message"
                  name="message"
                  rows={6}
                  required
                  placeholder="Tell us how we can assist you..."
                  className="mt-3 w-full resize-none border-b border-border bg-transparent py-3 text-sm leading-7 placeholder:text-muted-foreground/50 focus:border-gold-deep focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={sent}
                className="group flex w-full items-center justify-center gap-3 bg-ink py-4 text-[11px] uppercase tracking-[0.28em] text-ivory transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {sent ? (
                  "Message sent"
                ) : (
                  <>
                    Send enquiry

                    <ArrowRight
                      className="size-4 transition-transform group-hover:translate-x-1"
                      strokeWidth={1.3}
                    />
                  </>
                )}
              </button>

              <p className="text-center text-[11px] leading-5 text-muted-foreground">
                By submitting this form you agree that FLĀMORÁ
                may contact you regarding your enquiry.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* APPOINTMENT BANNER */}
      <section className="bg-ink text-ivory">
        <div className="mx-auto max-w-[1600px] px-4 py-20 md:px-8 md:py-24">
          <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="eyebrow text-gold">
                Private Consultation
              </p>

              <h2 className="mt-5 max-w-3xl font-display text-[clamp(2.3rem,5vw,4.5rem)] leading-[1.02]">
                Discover jewellery
                <span className="block italic text-gold">
                  at your own pace.
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-sm leading-7 text-ivory/65">
                Our private appointments allow time to explore
                stones, try pieces and discuss the details that
                matter to you.
              </p>
            </div>

            <a
              href="mailto:flamoraandco@gmail.com?subject=Private Atelier Appointment"
              className="group flex w-fit items-center gap-4 border border-ivory/40 px-8 py-4 text-[11px] uppercase tracking-[0.25em] transition-colors hover:bg-ivory hover:text-ink"
            >
              Request Appointment

              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-1"
                strokeWidth={1.3}
              />
            </a>
          </div>
        </div>
      </section>

      {/* BACK TO SHOP */}
      <section className="px-4 py-16 text-center md:px-8">
        <p className="text-sm text-muted-foreground">
          Prefer to explore online?
        </p>

        <Link
          href="/shop"
          className="mt-4 inline-block font-display text-2xl link-underline"
        >
          Discover the collection
        </Link>
      </section>
    </main>
  );
}



function FormField({
  id,
  label,
  type = "text",
  autoComplete,
  required = true,
}) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow">
        {label}
      </label>

      <input
        id={id}
        name={id}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="mt-3 w-full border-b border-border bg-transparent py-3 text-sm focus:border-gold-deep focus:outline-none"
      />
    </div>
  );
}