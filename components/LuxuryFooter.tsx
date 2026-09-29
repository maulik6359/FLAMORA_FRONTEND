"use client";

import Link from "next/link";

export default function LuxuryFooter() {
  return (
    <footer className="min-h-[88vh] bg-[linear-gradient(180deg,#050505_0%,#050505_35%,#07110e_100%)] px-[5vw] pb-[4vh] pt-[9vh] text-white">
      <div className="border-b border-white/15 pb-[5vh] text-[9px] tracking-[0.28em] text-white">
        PRIVATE CLIENTS · BESPOKE · WORLDWIDE
      </div>
      <div className="flex items-start justify-between gap-[6vw] border-b border-white/15 py-[7vh] max-md:block">
        <div className="font-serif text-[clamp(64px,9vw,148px)] leading-[0.8] tracking-[-0.04em]">
          FLĀMORÁ
          <br />& CO.
        </div>
        <div className="max-w-[440px] text-[13px] leading-[1.8] text-white max-md:mt-8">
          A modern fine-jewellery house exploring light, proportion and personal
          expression through objects designed to live beyond the moment.
        </div>
      </div>

      <div className="grid grid-cols-[.9fr_1.4fr_1fr] gap-[6vw] border-b border-white/15 py-[6vh] max-md:grid-cols-1">
        <div>
          <div className="mb-6 text-[9px] tracking-[0.28em] text-white">
            FOLLOW THE HOUSE
          </div>
          <a
            href="#"
            className="block font-serif text-[clamp(28px,2.5vw,44px)] transition hover:translate-x-2 hover:opacity-60"
          >
            I. Instagram
          </a>
          <a
            href="#"
            className="mt-3 block font-serif text-[clamp(28px,2.5vw,44px)] transition hover:translate-x-2 hover:opacity-60"
          >
            II. Pinterest
          </a>
        </div>
        <div>
          <div className="mb-6 text-[9px] tracking-[0.28em] text-white">
            PRIVATE CLIENT ENQUIRIES
          </div>
          <div className="text-xs leading-8 text-white">
            HOUSE: FLĀMORÁ & CO.
            <br />
            LOCATION: INDIA
            <br />
            APPOINTMENTS: PRIVATE VIEWING / WORLDWIDE
            <br />
            EMAIL: PRIVATE CLIENT ENQUIRIES
            <p className="mt-5 max-w-[520px] leading-[1.8] text-white">
              For bespoke commissions, private appointments and collection
              enquiries, contact the house.
            </p>
          </div>
        </div>
        <div>
          <div className="mb-6 text-[9px] tracking-[0.28em] text-white">
            THE HOUSE
          </div>
          <div className="flex flex-col gap-3">
            <Link
              href="/contact"
              className="flex justify-between border border-white/35 px-5 py-[18px] text-left text-[9px] tracking-[0.24em] transition hover:bg-white hover:text-black"
            >
              <span>CONTACT THE HOUSE</span>
              <span>↗</span>
            </Link>
            <Link
              href="/collections"
              className="flex justify-between border border-white/35 px-5 py-[18px] text-[9px] tracking-[0.24em] transition hover:bg-white hover:text-black"
            >
              <span>DISCOVER COLLECTIONS</span>
              <span>↗</span>
            </Link>

            <Link
              href="/contact?type=appointment"
              className="flex justify-between border border-white/35 px-5 py-[18px] text-[9px] tracking-[0.24em] transition hover:bg-white hover:text-black"
            >
              <span>PRIVATE APPOINTMENT</span>
              <span>↗</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between gap-6 pt-[4vh] text-[8px] tracking-[0.22em] text-white max-md:flex-col max-md:items-start">
        <span>© FLĀMORÁ & CO. · ALL RIGHTS RESERVED</span>
        <span>PRIVACY · TERMS · CRAFTED FOR FLĀMORÁ</span>
      </div>
    </footer>
  );
}
