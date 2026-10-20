import Link from "next/link";

import { Wordmark } from "@/components/brand/Wordmark";
import { getPublicSettings } from "@/lib/content";
import { fetchStoreCurrency } from "@/lib/currency";

const footerColumns = [
  {
    title: "Client Care",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Shipping & Delivery", href: "/shipping-returns#shipping" },
      { label: "Returns & Exchanges", href: "/shipping-returns#returns" },
      { label: "Jewellery Care", href: "/jewellery-care" },
      { label: "Size Guide", href: "/size-guide" },
    ],
  },
  {
    title: "The House",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Craftsmanship", href: "/about#craftsmanship" },
      { label: "Our Collections", href: "/collections" },
      { label: "Private Appointment", href: "/contact?type=appointment" },
      { label: "Journal", href: "/journal" },
    ],
  },
  {
    // Pages served by app/(shop)/[slug] from Admin → CMS Pages
    title: "Legal",
    links: [
      { label: "Terms & Conditions", href: "/terms-of-service" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Accessibility", href: "/accessibility" },
      { label: "Cookie Policy", href: "/cookie-policy" },
    ],
  },
];

export async function Footer() {
  const currentYear = new Date().getFullYear();
  const [settings, currency] = await Promise.all([getPublicSettings(), fetchStoreCurrency()]);
  const socials = [
    { label: "Instagram", href: settings.social_instagram || "https://instagram.com" },
    { label: "Pinterest", href: settings.social_pinterest || "https://pinterest.com" },
  ];

  return (
    <footer className="border-t border-black/10 bg-white text-[#171715]">
      {/* Main footer */}
      <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 lg:px-16 lg:py-28">
        <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-[1.15fr_repeat(3,1fr)] lg:gap-20">
          {/* Brand */}
          <div>
            <Link
              href="/"
              aria-label="FLĀMORÁ home"
              className="inline-block text-[#0B3629]"
            >
              <Wordmark className="text-[clamp(25px,2.2vw,38px)] tracking-[0.16em]" />
            </Link>

            <p className="mt-7 max-w-[320px] text-[13px] leading-[1.9] text-black/60">
              A modern fine-jewellery house creating timeless objects through
              exceptional stones, considered proportions and meticulous
              craftsmanship.
            </p>

            <div className="mt-8 flex flex-col gap-3 text-[11px] uppercase tracking-[0.18em]">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="w-fit border-b border-transparent pb-1 transition hover:border-[#0B3629] hover:text-[#0B3629]"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          {/* Footer columns */}
          {footerColumns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="text-[13px] font-medium tracking-[0.04em] text-black">
                {column.title}
              </h3>

              <ul className="mt-8 space-y-5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="inline-block text-[13px] tracking-[0.03em] text-black/65 transition duration-300 hover:translate-x-1 hover:text-[#0B3629]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* Brand-green separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#0B3629]/40 to-transparent" />

      {/* Bottom footer */}
      <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-5 py-7 md:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-16">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-[9px] uppercase tracking-[0.2em] text-black/50">
          <span>© {currentYear} FLĀMORÁ & CO.</span>

          <span className="hidden h-3 w-px bg-black/20 sm:block" />

          <span>Fine Jewellery House</span>

          <span className="hidden h-3 w-px bg-black/20 sm:block" />

          <span>Worldwide</span>
        </div>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          {/* Currency: the shop prices and charges in one currency (Admin → Settings → Store) */}
          <p className="flex h-11 items-center border border-black/15 px-4 text-[10px] uppercase tracking-[0.18em] text-black/65">
            Prices in {currency}
          </p>

          {/* Payment methods */}
          <div
            className="flex items-center gap-2"
            aria-label="Accepted payment methods"
          >
            {["VISA", "MC", "AMEX", "PAY"].map((payment) => (
              <span
                key={payment}
                className="grid h-9 min-w-12 place-items-center border border-black/15 px-2 text-[8px] tracking-[0.14em] text-black/50"
              >
                {payment}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Final brand strip */}
      <div className="bg-[#0B3629] px-5 py-3 text-center text-[8px] uppercase tracking-[0.3em] text-[#F4EFE4]">
        Private clients · Bespoke commissions · Worldwide appointments
      </div>
    </footer>
  );
}