import Link from "next/link";
import { Instagram, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-emerald-vault text-ivory/80" data-testid="site-footer">
      <div className="mx-auto max-w-[1500px] px-6 lg:px-10 py-24">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <span className="font-display text-3xl tracking-[0.3em] gold-text">FLAMORA</span>
            <p className="text-[9px] tracking-[0.4em] uppercase text-ivory/50 mt-2">Maison de Joaillerie</p>
            <p className="mt-6 text-sm leading-relaxed font-light max-w-xs text-ivory/60">
              A century of quiet obsession. Each piece hand-finished in Paris — signed beneath the band.
            </p>
          </div>
          <div>
            <p className="eyebrow mb-5">Collections</p>
            <ul className="space-y-3 font-light text-sm">
              <li><Link href="/shop?category=rings" className="hover:text-gold">Rings</Link></li>
              <li><Link href="/shop?category=necklaces" className="hover:text-gold">Necklaces</Link></li>
              <li><Link href="/shop?category=earrings" className="hover:text-gold">Earrings</Link></li>
              <li><Link href="/shop?category=bracelets" className="hover:text-gold">Bracelets</Link></li>
              <li><Link href="/shop?category=watches" className="hover:text-gold">Watches</Link></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-5">The Maison</p>
            <ul className="space-y-3 font-light text-sm">
              <li><Link href="/about" className="hover:text-gold">Our Story</Link></li>
              <li><Link href="/about" className="hover:text-gold">Ateliers</Link></li>
              <li><Link href="/about" className="hover:text-gold">Sustainability</Link></li>
              <li><Link href="/about" className="hover:text-gold">Press</Link></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-5">Client Care</p>
            <ul className="space-y-3 font-light text-sm">
              <li><Link href="/account" className="hover:text-gold">Your Account</Link></li>
              <li>Boutique Locator</li>
              <li>Concierge · +33 1 40 20 00 00</li>
              <li>service@flamora.com</li>
            </ul>
            <div className="flex gap-4 mt-6 text-gold">
              <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
              <a href="#" aria-label="YouTube"><Youtube size={18} /></a>
            </div>
          </div>
        </div>
        <div className="hairline mt-16" />
        <div className="mt-6 flex flex-col md:flex-row justify-between text-[10px] tracking-[0.3em] uppercase text-ivory/40">
          <span>© 2026 FLAMORA · Paris · Genève</span>
          <span>Handcrafted with obsession</span>
        </div>
      </div>
    </footer>
  );
}
