"use client";
import { CrudAdmin } from "@/components/admin/CrudAdmin";

export default function BannersPage() {
  return (
    <CrudAdmin
      title="Banners"
      eyebrow="Storefront"
      endpoint="/admin/banners"
      fields={[
        { name: "title", label: "Title", required: true },
        { name: "type", label: "Type", type: "select", required: true, options: [
          { value: "homepage_hero", label: "Homepage Hero" },
          { value: "slider", label: "Slider" },
          { value: "popup", label: "Popup" },
          { value: "sidebar", label: "Sidebar" },
          { value: "promotional", label: "Promotional" },
        ] },
        { name: "image", label: "Desktop Image URL", type: "url", colSpan: 2 },
        { name: "mobileImage", label: "Mobile Image URL", type: "url", colSpan: 2 },
        { name: "linkUrl", label: "Link URL", type: "url", colSpan: 2 },
        { name: "altText", label: "Alt Text", colSpan: 2 },
        { name: "sortOrder", label: "Sort Order", type: "number" },
        { name: "startDate", label: "Start Date", type: "date" },
        { name: "endDate", label: "End Date", type: "date" },
        { name: "isActive", label: "Active", type: "checkbox" },
      ]}
      columns={[
        { key: "image", label: "Preview", render: (r) => r.image ? <img src={r.image} alt="" className="h-10 w-24 object-cover" /> : "—" },
        { key: "title", label: "Title" },
        { key: "type", label: "Type", render: (r) => <span className="text-neutral-400 text-xs">{r.type?.replace(/_/g, " ")}</span> },
        { key: "sortOrder", label: "Order", align: "right" },
        { key: "isActive", label: "Status", render: (r) => <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${r.isActive ? "bg-emerald-900/50 text-emerald-300" : "bg-neutral-900 text-neutral-500"}`}>{r.isActive ? "Live" : "Off"}</span> },
      ]}
    />
  );
}
