"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { LayoutDashboard, Package, Layers, ShoppingBag, Users, LogOut, Menu, Building2, Sparkles, Gem, Boxes, Ticket, Warehouse, Star, HelpCircle, MessageSquare, Mail, Bell, Image, LayoutTemplate, Percent, FileText, BookOpen, BarChart3, LineChart, CreditCard, Truck, Receipt, PackageCheck, Settings as SettingsIcon, ScrollText } from "lucide-react";
import { useAuth } from "@/lib/store";

const NAV_GROUPS: { title: string; items: { href: string; label: string; icon: any }[] }[] = [
  {
    title: "Overview",
    items: [{ href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Catalogue",
    items: [
      { href: "/admin/products", label: "Products", icon: Package },
      { href: "/admin/categories", label: "Categories", icon: Layers },
      { href: "/admin/brands", label: "Brands", icon: Building2 },
      { href: "/admin/collections", label: "Collections", icon: Sparkles },
      { href: "/admin/materials", label: "Materials", icon: Boxes },
      { href: "/admin/gemstones", label: "Gemstones", icon: Gem },
    ],
  },
  {
    title: "Commerce",
    items: [
      { href: "/admin/inventory", label: "Inventory", icon: Warehouse },
      { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
      { href: "/admin/customers", label: "Customers", icon: Users },
      { href: "/admin/coupons", label: "Coupons", icon: Ticket },
      { href: "/admin/offers", label: "Offers", icon: Percent },
    ],
  },
  {
    title: "Content",
    items: [
      { href: "/admin/banners", label: "Banners", icon: Image },
      { href: "/admin/homepage", label: "Homepage", icon: LayoutTemplate },
      { href: "/admin/cms", label: "CMS Pages", icon: FileText },
      { href: "/admin/blog", label: "Blog", icon: BookOpen },
      { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
    ],
  },
  {
    title: "Engagement",
    items: [
      { href: "/admin/reviews", label: "Reviews", icon: Star },
      { href: "/admin/contact", label: "Contact", icon: MessageSquare },
      { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
      { href: "/admin/notifications", label: "Notifications", icon: Bell },
    ],
  },
  {
    title: "Metrics",
    items: [
      { href: "/admin/analytics", label: "Analytics", icon: LineChart },
      { href: "/admin/reports", label: "Reports", icon: BarChart3 },
    ],
  },
  {
    title: "Configuration",
    items: [
      { href: "/admin/payment-methods", label: "Payment Methods", icon: CreditCard },
      { href: "/admin/shipping-methods", label: "Shipping Methods", icon: Truck },
      { href: "/admin/taxes", label: "Taxes", icon: Receipt },
      { href: "/admin/delivery-charges", label: "Delivery Charges", icon: PackageCheck },
      { href: "/admin/settings", label: "Settings", icon: SettingsIcon },
      { href: "/admin/audit-logs", label: "Audit Logs", icon: ScrollText },
    ],
  },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, token, clear } = useAuth();
  const isLoginPage = pathname === "/admin/login" || pathname === "/admin";

  useEffect(() => {
    // Hydrate — if middleware allowed us through, Zustand may not yet be rehydrated on the client.
    if (isLoginPage) return;
    if (!user && !token) {
      router.replace("/admin/login");
    }
  }, [user, token, router, isLoginPage]);

  if (isLoginPage) return <>{children}</>;

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-neutral-100 overflow-hidden" data-testid="admin-shell">
      <aside className="w-64 bg-noir border-r border-neutral-900 flex-shrink-0 hidden lg:flex flex-col">
        <div className="p-6 border-b border-neutral-900">
          <Link href="/admin/dashboard" className="block">
            <span className="font-display text-2xl tracking-[0.3em] gold-text">FLAMORA</span>
            <p className="text-[9px] tracking-[0.4em] uppercase text-gold/60 mt-1">Admin · Maison</p>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
          {NAV_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="eyebrow px-3 mb-2 text-neutral-500">{group.title}</p>
              <div className="space-y-1">
                {group.items.map((n) => {
                  const active = pathname === n.href || pathname.startsWith(n.href + "/");
                  const Icon = n.icon;
                  return (
                    <Link
                      key={n.href}
                      href={n.href}
                      className={`flex items-center gap-3 px-3 py-2 text-sm transition ${
                        active ? "bg-gold/10 text-gold border-l-2 border-gold" : "text-neutral-300 hover:bg-neutral-900 hover:text-gold"
                      }`}
                      data-testid={`admin-nav-${n.href.split("/").pop()}`}
                    >
                      <Icon size={15} />
                      {n.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="p-4 border-t border-neutral-900">
          <div className="text-xs text-neutral-500 mb-3">
            <p className="text-neutral-300">{user?.name || "Admin"}</p>
            <p className="truncate">{user?.email}</p>
          </div>
          <button
            onClick={() => { clear(); router.push("/admin/login"); }}
            className="flex items-center gap-2 text-xs text-neutral-500 hover:text-red-400 transition"
            data-testid="admin-logout-btn"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-neutral-900 bg-noir/80 backdrop-blur flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-neutral-400" aria-label="Menu"><Menu size={18} /></button>
            <p className="eyebrow text-neutral-500">Console</p>
          </div>
          <Link href="/" className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 hover:text-gold">
            ← View Store
          </Link>
        </header>
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
