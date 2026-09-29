"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

import { Wordmark } from "@/components/brand/Wordmark";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { AnnouncementBar } from "./AnnouncementBar";

type NavLink = {
  label: string;
  href: string;
  children?: NavLink[];
};

const primaryLinks: NavLink[] = [
  { label: "New In", href: "/shop?sort=newest" },
  {
    label: "Jewellery",
    href: "/shop",
    children: [
      { label: "Rings", href: "/shop?category=rings" },
      { label: "Necklaces", href: "/shop?category=necklaces" },
      { label: "Earrings", href: "/shop?category=earrings" },
      { label: "Bracelets", href: "/shop?category=bracelets" },
    ],
  },
  { label: "Collections", href: "/collections" },
];

const secondaryLinks: NavLink[] = [
  { label: "Client Care", href: "/contact" },
  { label: "The House", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const cartItems = useCartStore((state) => state.items);
  const openCart = useCartStore((state) => state.openCart);
  const wishlistIds = useWishlistStore((state) => state.ids);

  const cartCount = useMemo(
    () =>
      hydrated
        ? cartItems.reduce((total, item) => total + item.quantity, 0)
        : 0,
    [cartItems, hydrated],
  );
  const wishlistCount = hydrated ? wishlistIds.length : 0;

  useEffect(() => setMobileOpen(false), [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    const route = href.split("?")[0];
    return route === "/" ? pathname === "/" : pathname.startsWith(route);
  };

  return (
    <>
    
      <header className="sticky top-0 z-40 border-b border-black/10 bg-[#fbfaf7]/95 text-[#181614] backdrop-blur-xl">
        

        <nav
          aria-label="Primary navigation"
          className="relative mx-auto grid h-[78px] max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center px-4 md:px-38 lg:h-[90px]"
        >
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
            className="grid size-10 place-items-center justify-self-start lg:hidden"
          >
            <Menu className="size-5" strokeWidth={1.25} />
          </button>

          <ul className="hidden items-center gap-7 justify-self-start lg:flex xl:gap-9">
            {primaryLinks.map((link) => (
              <li
                key={link.label}
                className="relative"
                onMouseEnter={() =>
                  link.children && setOpenDropdown(link.label)
                }
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={link.href}
                  className={cn(
                    "flex h-[90px] items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] transition-opacity hover:opacity-55",
                    isActive(link.href) && "font-medium",
                  )}
                >
                  {link.label}
                  {link.children && (
                    <ChevronDown className="size-3" strokeWidth={1.2} />
                  )}
                </Link>

                {link.children && (
                  <AnimatePresence>
                    {openDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 top-full w-64 border border-black/10 bg-[#fbfaf7] p-6 shadow-[0_18px_50px_rgba(0,0,0,.08)]"
                      >
                        <div className="flex flex-col gap-4">
                          {link.children.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              className="font-serif text-xl transition-opacity hover:opacity-50"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </li>
            ))}
          </ul>

          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2"
          >
            <span className="font-serif text-[clamp(28px,2.7vw,48px)] tracking-[-0.045em]">FLĀMORÁ & CO</span>
            {/* <Wordmark className="text-[clamp(20px,2.1vw,34px)] tracking-[0.16em]" /> */}
          </Link>

          <div className="col-start-3 flex items-center justify-self-end gap-0.5 sm:gap-1 lg:gap-2">
            <div className="mr-3 hidden items-center gap-7 xl:flex">
              {secondaryLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[11px] uppercase tracking-[0.16em] transition-opacity hover:opacity-55"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <ActionLink href="/search" label="Search">
              <Search />
            </ActionLink>
            <ActionLink href="/auth/login" label="Account" hiddenOnMobile>
              <User />
            </ActionLink>
            <ActionLink
              href="/wishlist"
              label={`Wishlist, ${wishlistCount} items`}
              hiddenOnMobile
            >
              <Heart fill={wishlistCount ? "currentColor" : "none"} />
              {!!wishlistCount && <Badge value={wishlistCount} />}
            </ActionLink>
            <button
              type="button"
              onClick={() => {
                openCart();
              }}
              aria-label={`Shopping bag, ${cartCount} items`}
              className="relative grid size-10 place-items-center transition-opacity hover:opacity-55"
            >
              <ShoppingBag className="size-5" strokeWidth={1.2} />
              {!!cartCount && <Badge value={cartCount} />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              aria-label="Close menu"
              className="absolute inset-0 bg-black/35 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-0 left-0 flex w-[88%] max-w-md flex-col overflow-y-auto bg-[#fbfaf7] p-7 text-[#181614]"
            >
              <div className="flex items-center justify-between border-b border-black/10 pb-6">
                <Wordmark className="text-xl" />
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setMobileOpen(false)}
                  className="grid size-10 place-items-center"
                >
                  <X className="size-5" strokeWidth={1.2} />
                </button>
              </div>

              <div className="flex flex-col py-7">
                {[...primaryLinks, ...secondaryLinks].map((link, index) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + index * 0.04 }}
                  >
                    <Link
                      href={link.href}
                      className="block border-b border-black/10 py-4 font-serif text-[clamp(28px,9vw,42px)] leading-none"
                    >
                      {link.label}
                    </Link>
                    {link.children && (
                      <div className="grid grid-cols-2 gap-x-4 border-b border-black/10 py-4">
                        {link.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className="py-2 text-[10px] uppercase tracking-[0.2em]"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto flex gap-5 border-t border-black/10 pt-6 text-[10px] uppercase tracking-[0.2em]">
                <Link href="/auth/login">Account</Link>
                <Link href="/wishlist">Wishlist ({wishlistCount})</Link>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ActionLink({
  href,
  label,
  hiddenOnMobile = false,
  children,
}: {
  href: string;
  label: string;
  hiddenOnMobile?: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        "relative grid size-10 place-items-center transition-opacity hover:opacity-55 [&>svg]:size-5 [&>svg]:stroke-[1.2]",
        hiddenOnMobile && "hidden sm:grid",
      )}
    >
      {children}
    </Link>
  );
}

function Badge({ value }: { value: number }) {
  return (
    <span className="absolute right-0 top-0 grid min-h-4 min-w-4 place-items-center rounded-full bg-[#b89662] px-1 text-[8px] leading-none text-white">
      {value > 99 ? "99+" : value}
    </span>
  );
}
