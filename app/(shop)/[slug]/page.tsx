import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { type Faq, getCmsPage, getFaqs, getPublicSettings, slugify, withHeadingIds } from "@/lib/content";

// Client-care and legal pages linked from the footer. Their text comes from
// Admin → CMS Pages (same slug); related FAQs are shown under it. Until a page is
// published, it still renders (with its FAQs and a way to contact the house)
// rather than a 404. Any other published CMS page is served here too.
const INFO_PAGES: Record<string, { title: string; intro: string; faqCategories?: string[] }> = {
  "shipping-returns": {
    title: "Shipping & Returns",
    intro: "Delivery times, costs and how to return or exchange a piece.",
    faqCategories: ["Shipping", "Returns"],
  },
  "jewellery-care": {
    title: "Jewellery Care",
    intro: "How to keep your pieces luminous for generations.",
    faqCategories: ["Care"],
  },
  "size-guide": {
    title: "Size Guide",
    intro: "Finding the right fit for rings, bracelets and necklaces.",
    faqCategories: ["Sizing"],
  },
  "privacy-policy": { title: "Privacy Policy", intro: "How we collect, use and protect your information." },
  "terms-of-service": { title: "Terms & Conditions", intro: "The terms that apply when you shop with FLĀMORÁ." },
  accessibility: { title: "Accessibility", intro: "Our commitment to a boutique everyone can use." },
  "cookie-policy": { title: "Cookie Policy", intro: "The cookies we use and the choices you have." },
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getCmsPage(slug);
  const info = INFO_PAGES[slug];
  const title = page?.title ?? info?.title;
  if (!title) return {};
  return {
    title: page?.seoTitle ? { absolute: page.seoTitle } : title,
    description: page?.seoDescription ?? info?.intro,
  };
}

export default async function InfoPage({ params }: Props) {
  const { slug } = await params;
  const info = INFO_PAGES[slug];
  const [page, allFaqs, settings] = await Promise.all([
    getCmsPage(slug),
    info?.faqCategories ? getFaqs() : Promise.resolve([] as Faq[]),
    getPublicSettings(),
  ]);
  if (!page && !info) notFound();

  const email: string = settings.store_email || "flamoraandco@gmail.com";
  const faqGroups = (info?.faqCategories ?? [])
    .map((category) => ({ category, items: allFaqs.filter((f) => f.category === category) }))
    .filter((g) => g.items.length > 0);

  return (
    <main>
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1600px] px-4 py-20 md:px-8 md:py-24">
          <div className="max-w-4xl">
            <p className="eyebrow text-gold-deep">FLĀMORÁ Client Care</p>
            <h1 className="mt-5 font-display text-[clamp(2.75rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.03em]">
              {page?.title ?? info.title}
            </h1>
            {info?.intro && (
              <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">{info.intro}</p>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-4 py-16 md:px-8 md:py-24">
        <div className="max-w-3xl">
          {page?.content ? (
            // Written by the store's admins in Admin → CMS Pages.
            <div className="cms-content" dangerouslySetInnerHTML={{ __html: withHeadingIds(page.content) }} />
          ) : (
            faqGroups.length === 0 && (
              <p className="text-base leading-8 text-muted-foreground">
                We are finalising this page. In the meantime, our client care team will gladly answer any question —
                write to{" "}
                <a href={`mailto:${email}`} className="border-b border-gold-deep text-foreground">
                  {email}
                </a>
                .
              </p>
            )
          )}

          {faqGroups.map((group) => (
            // The CMS text's own headings take the plain ids (#shipping, #returns) when it exists.
            <div
              key={group.category}
              id={page?.content ? `faq-${slugify(group.category)}` : slugify(group.category)}
              className="mt-14 scroll-mt-36 first:mt-0"
            >
              <h2 className="font-display text-3xl md:text-4xl">
                {page?.content ? `${group.category} questions` : group.category}
              </h2>
              <div className="mt-6 divide-y divide-border border-y border-border">
                {group.items.map((faq) => (
                  <details key={faq._id} className="group py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-base font-medium marker:hidden">
                      {faq.question}
                      <span aria-hidden="true" className="text-xl text-gold-deep transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-4 max-w-2xl text-[15px] leading-7 text-muted-foreground">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-16 flex flex-wrap gap-4 border-t border-border pt-10">
            <Link
              href="/contact"
              className="bg-ink px-9 py-4 text-[11px] uppercase tracking-[0.28em] text-ivory transition-opacity hover:opacity-90"
            >
              Contact Client Care
            </Link>
            <Link
              href="/shop"
              className="border border-border px-9 py-4 text-[11px] uppercase tracking-[0.28em] transition-colors hover:border-gold-deep"
            >
              Shop Jewellery
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
