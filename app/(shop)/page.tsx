import { Hero } from "@/components/site/Hero";
import { ProductCard } from "@/components/site/ProductCard";
import Link from "next/link";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

async function fetchFeatured() {
  try {
    const r = await fetch("http://127.0.0.1:8001/api/products?featured=true&limit=4", { cache: "no-store" });
    if (!r.ok) return [];
    return (await r.json()).items || [];
  } catch {
    return [];
  }
}

async function fetchCategories() {
  try {
    const r = await fetch("http://127.0.0.1:8001/api/categories", { cache: "no-store" });
    if (!r.ok) return [];
    return (await r.json()).categories || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [featured, categories] = await Promise.all([fetchFeatured(), fetchCategories()]);

  return (
    <>
      <Hero />

      {/* FEATURED COLLECTION */}
      <section className="relative py-32 md:py-44 px-6 lg:px-10 bg-ivory" data-testid="featured-section">
        <div className="mx-auto max-w-[1500px]">
          <div className="text-center mb-20">
            <p className="eyebrow">◆ Chapitre I · Joaillerie</p>
            <h2 className="mt-6 font-display text-[clamp(2.2rem,5vw,4rem)] leading-tight text-emerald-vault">
              Treasures of the <em className="gold-text not-italic">Vault</em>
            </h2>
            <div className="hairline mt-6 mx-auto w-24" />
            <p className="mt-8 max-w-xl mx-auto text-onyx/60 font-light">
              A curated selection from our master jewellers — each stone chosen by hand, set by candlelight.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featured.map((p: any, i: number) => (
              <ProductCard key={p._id} product={p} index={i} />
            ))}
          </div>
          <div className="mt-16 text-center">
            <Link
              href="/shop"
              className="inline-block px-10 py-4 border border-gold text-onyx hover:bg-gold hover:text-emerald-vault transition text-[11px] tracking-[0.4em] uppercase"
              data-testid="view-all-btn"
            >
              Enter the Collection
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="relative py-32 px-6 lg:px-10 bg-cream" data-testid="categories-section">
        <div className="mx-auto max-w-[1500px]">
          <div className="text-center mb-20">
            <p className="eyebrow">◆ Explore the Ateliers</p>
            <h2 className="mt-6 font-display text-[clamp(2rem,4.5vw,3.6rem)] text-emerald-vault">
              The <em className="gold-text not-italic">Collections</em>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((c: any) => (
              <Link
                key={c._id}
                href={`/shop?category=${c.slug}`}
                className="group relative aspect-[3/4] overflow-hidden bg-emerald-vault gold-border"
                data-testid={`category-${c.slug}`}
              >
                {c.image && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={c.image} alt={c.name} className="h-full w-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-110 transition-all duration-[1400ms]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-vault via-emerald-vault/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-center">
                  <p className="font-display text-2xl text-ivory group-hover:text-gold transition">{c.name}</p>
                  <p className="mt-1 text-[9px] tracking-[0.35em] uppercase text-gold/70">Discover →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* MAISON STORY */}
      <section className="relative py-32 md:py-44 px-6 lg:px-10 bg-emerald-vault text-ivory overflow-hidden" data-testid="maison-story">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(201,169,97,0.12),transparent_70%)]" />
        <div className="relative mx-auto max-w-[1200px] grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-5 relative aspect-[3/4]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85"
              alt="Atelier"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 ring-1 ring-gold/30" />
            <div className="absolute -bottom-6 -right-6 hidden md:block glass-card p-6 max-w-[200px]">
              <p className="font-display italic text-gold text-3xl leading-none">est.</p>
              <p className="font-display text-ivory text-5xl mt-1">1924</p>
              <p className="mt-2 text-[10px] tracking-[0.3em] uppercase text-ivory/60">Paris · Genève</p>
            </div>
          </div>
          <div className="lg:col-span-7">
            <p className="eyebrow">◆ The Maison</p>
            <h2 className="mt-6 font-display text-[clamp(2.2rem,4.5vw,3.6rem)] leading-[1.1]">
              A century of <em className="gold-text not-italic">quiet</em> obsession.
            </h2>
            <div className="hairline mt-6 w-24" />
            <div className="mt-8 space-y-5 text-ivory/70 leading-relaxed font-light max-w-xl">
              <p>Founded in the discreet ateliers of Place Vendôme, FLAMORA has shaped gemstones for four generations of collectors, royalty, and the quietly extraordinary.</p>
              <p>Every piece begins with a single stone — chosen by hand, set by candlelight, signed beneath the band. The maison's mark is not loud. It is inherited.</p>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              {[{ n: "100", l: "Years" }, { n: "1 of 1", l: "Pieces" }, { n: "18kt", l: "Gold" }].map((s) => (
                <div key={s.l}>
                  <p className="font-display text-3xl gold-text">{s.n}</p>
                  <p className="mt-1 text-[10px] tracking-[0.3em] uppercase text-ivory/50">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-24 px-6 bg-cream" data-testid="newsletter-section">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">◆ Correspondance Privée</p>
          <h2 className="mt-6 font-display text-4xl md:text-5xl text-emerald-vault">Join the <em className="gold-text not-italic">List</em></h2>
          <p className="mt-4 text-onyx/60 font-light">Receive private invitations, new arrivals, and the maison journal — twice a month, never more.</p>
          <form className="mt-10 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your.email@example.com"
              className="flex-1 px-5 py-4 bg-ivory border border-gold/30 focus:border-gold focus:outline-none text-sm"
              data-testid="newsletter-email"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-emerald-vault text-ivory text-[11px] tracking-[0.4em] uppercase hover:bg-emerald transition"
              data-testid="newsletter-submit"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
