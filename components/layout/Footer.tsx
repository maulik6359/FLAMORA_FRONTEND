import Link from "next/link";

import { Wordmark } from "@/components/brand/Wordmark";

const footerColumns = [
  {
    title: "Client Care",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Shipping & Delivery", href: "/shipping" },
      { label: "Returns & Exchanges", href: "/returns" },
      { label: "Jewellery Care", href: "/about" },
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
    title: "Legal",
    links: [
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Accessibility", href: "/accessibility" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

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
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer noopener"
                className="w-fit border-b border-transparent pb-1 transition hover:border-[#0B3629] hover:text-[#0B3629]"
              >
                Instagram
              </a>

              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer noopener"
                className="w-fit border-b border-transparent pb-1 transition hover:border-[#0B3629] hover:text-[#0B3629]"
              >
                Pinterest
              </a>
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
          {/* Currency */}
          <div className="relative">
            <label htmlFor="footer-currency" className="sr-only">
              Select region and currency
            </label>

            <select
              id="footer-currency"
              defaultValue="AU"
              className="h-11 min-w-[190px] appearance-none border border-black/15 bg-white px-4 pr-10 text-[10px] uppercase tracking-[0.18em] text-black/65 outline-none transition hover:border-[#0B3629] focus:border-[#0B3629]"
            >
              <option value="IN">India · INR</option>
              <option value="AU">Australia · AUD</option>
              <option value="NZ">New Zealand · NZD</option>
              <option value="UK">United Kingdom · GBP</option>
              <option value="US">United States · USD</option>
            </select>

            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs">
              ↓
            </span>
          </div>

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