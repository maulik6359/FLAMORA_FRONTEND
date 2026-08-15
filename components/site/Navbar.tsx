"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import { useCart, useWishlist, useAuth } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { SearchInput } from "@/components/site/SearchInput";

const NAV = [
  { href: "/", label: "Maison" },
  { href: "/shop", label: "Jewellery" },
  { href: "/shop?category=rings", label: "Rings" },
  { href: "/shop?category=necklaces", label: "Necklaces" },
  { href: "/shop?category=watches", label: "Watches" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const pathname = usePathname();
  const cartCount = useCart((s) => s.count());
  const wishlistCount = useWishlist((s) => s.ids.length);
  const user = useAuth((s) => s.user);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-ivory/85 backdrop-blur-xl border-b border-gold/15" : "bg-transparent"
      }`}
      data-testid="site-navbar"
    >
      {/* Desktop & Mobile Main Row */}
      <div className="mx-auto max-w-[1500px] px-6 lg:px-10 h-16 lg:h-20 flex items-center justify-between gap-6 lg:gap-10">
        {/* Left: Mobile menu button + Logo + Desktop Nav links */}
        <div className="flex items-center gap-6 lg:gap-8 shrink-0">
          <button onClick={() => setOpen(true)} className="lg:hidden text-onyx" data-testid="nav-mobile-open">
            <Menu size={22} />
          </button>
          <Link href="/" className="inline-block" data-testid="nav-logo">
            <span className="font-display text-xl lg:text-2xl tracking-[0.25em] gold-text">FLAMORA</span>
            <span className="block text-[7px] tracking-[0.45em] uppercase text-onyx/40 mt-0.5">Maison Depuis 1924</span>
          </Link>
          <nav className="hidden lg:flex gap-6 text-[10px] tracking-[0.25em] uppercase">
            {NAV.slice(1, 5).map((n) => (
              <Link key={n.label} href={n.href} className="text-onyx/70 hover:text-gold transition">
                {n.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Center: Search input (desktop only) */}
        <div className="hidden lg:block w-full max-w-[340px] xl:max-w-[400px]">
          <SearchInput />
        </div>

        {/* Right: Actions icons */}
        <div className="flex items-center gap-4 lg:gap-5 text-onyx/70 shrink-0">
          <Link href="/wishlist" className="hover:text-gold transition relative" data-testid="nav-wishlist">
            <Heart size={18} />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-gold text-onyx text-[9px] font-medium grid place-items-center">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link href="/cart" className="hover:text-gold transition relative" data-testid="nav-cart">
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-gold text-onyx text-[9px] font-medium grid place-items-center">
                {cartCount}
              </span>
            )}
          </Link>
          <Link
            href={user ? "/account" : "/login"}
            className="hover:text-gold transition text-[9px] tracking-[0.25em] uppercase hidden md:block"
            data-testid="nav-account"
          >
            {user ? user.name.split(" ")[0] : "Sign In"}
          </Link>
          <Link href={user ? "/account" : "/login"} className="hover:text-gold transition md:hidden" data-testid="nav-account-mobile">
            <User size={18} />
          </Link>
        </div>
      </div>

      {/* Mobile Search input - visible only on mobile/tablet */}
      <div className="px-6 pb-3 pt-1 lg:hidden">
        <SearchInput />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 bg-emerald-vault text-ivory z-[60] lg:hidden"
          >
            <div className="p-6 flex justify-between items-center border-b border-gold/20">
              <span className="font-display text-2xl tracking-[0.3em] gold-text">FLAMORA</span>
              <button onClick={() => setOpen(false)} data-testid="nav-mobile-close"><X size={24} /></button>
            </div>
            <nav className="p-8 flex flex-col gap-6 text-2xl font-display">
              {NAV.map((n) => (
                <Link key={n.label} href={n.href} onClick={() => setOpen(false)} className="text-ivory/80 hover:text-gold transition">
                  {n.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
