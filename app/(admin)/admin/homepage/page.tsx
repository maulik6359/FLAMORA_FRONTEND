"use client";
import { CrudAdmin } from "@/components/admin/CrudAdmin";

export default function HomepageSectionsPage() {
  return (
    <CrudAdmin
      title="Homepage Sections"
      eyebrow="Storefront"
      endpoint="/admin/homepage-sections"
      fields={[
        { name: "title", label: "Title", required: true },
        { name: "type", label: "Type", type: "select", required: true, options: [
          { value: "featured_products", label: "Featured Products" },
          { value: "new_arrivals", label: "New Arrivals" },
          { value: "best_sellers", label: "Best Sellers" },
          { value: "collections", label: "Collections" },
          { value: "testimonials", label: "Testimonials" },
          { value: "brand_showcase", label: "Brand Showcase" },
        ] },
        { name: "sortOrder", label: "Sort Order", type: "number" },
        { name: "isActive", label: "Active", type: "checkbox" },
      ]}
      columns={[
        { key: "title", label: "Title" },
        { key: "type", label: "Type", render: (r) => <span className="text-neutral-400 text-xs">{r.type?.replace(/_/g, " ")}</span> },
        { key: "sortOrder", label: "Order", align: "right" },
        { key: "isActive", label: "Status", render: (r) => <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${r.isActive ? "bg-emerald-900/50 text-emerald-300" : "bg-neutral-900 text-neutral-500"}`}>{r.isActive ? "Live" : "Off"}</span> },
      ]}
    />
  );
}
