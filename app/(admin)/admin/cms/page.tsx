"use client";
import { CrudAdmin } from "@/components/admin/CrudAdmin";

export default function CmsPagesAdmin() {
  return (
    <CrudAdmin
      title="CMS Pages"
      eyebrow="Content"
      endpoint="/admin/cms"
      fields={[
        { name: "title", label: "Title", required: true },
        { name: "isPublished", label: "Published", type: "checkbox" },
        { name: "content", label: "Content (HTML)", type: "textarea", required: true, colSpan: 2, placeholder: "<h2>About the Maison</h2><p>…</p>" },
        { name: "seoTitle", label: "SEO Title" },
        { name: "seoDescription", label: "SEO Description", type: "textarea", colSpan: 2 },
      ]}
      columns={[
        { key: "title", label: "Title" },
        { key: "slug", label: "Slug", render: (r) => <span className="font-mono text-xs text-neutral-500">/{r.slug}</span> },
        { key: "isPublished", label: "Status", render: (r) => <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${r.isPublished ? "bg-emerald-900/50 text-emerald-300" : "bg-neutral-900 text-neutral-500"}`}>{r.isPublished ? "Live" : "Draft"}</span> },
        { key: "updatedAt", label: "Updated", render: (r) => new Date(r.updatedAt).toLocaleDateString() },
      ]}
    />
  );
}
