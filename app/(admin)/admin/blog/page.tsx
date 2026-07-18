"use client";
import { CrudAdmin } from "@/components/admin/CrudAdmin";

export default function BlogPage() {
  return (
    <CrudAdmin
      title="Blog"
      eyebrow="Le Journal"
      endpoint="/admin/blogs"
      fields={[
        { name: "title", label: "Title", required: true, colSpan: 2 },
        { name: "excerpt", label: "Excerpt", type: "textarea", colSpan: 2 },
        { name: "content", label: "Content (HTML)", type: "textarea", required: true, colSpan: 2, placeholder: "<p>Your content…</p>" },
        { name: "featuredImage", label: "Featured Image URL", type: "url", colSpan: 2 },
        { name: "status", label: "Status", type: "select", options: [
          { value: "draft", label: "Draft" },
          { value: "published", label: "Published" },
        ] },
        { name: "seoTitle", label: "SEO Title" },
        { name: "seoDescription", label: "SEO Description", type: "textarea", colSpan: 2 },
      ]}
      columns={[
        { key: "featuredImage", label: "Image", render: (r) => r.featuredImage ? <img src={r.featuredImage} alt="" className="h-10 w-16 object-cover" /> : "—" },
        { key: "title", label: "Title" },
        { key: "status", label: "Status", render: (r) => <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${r.status === "published" ? "bg-emerald-900/50 text-emerald-300" : "bg-amber-900/40 text-amber-300"}`}>{r.status}</span> },
        { key: "publishedAt", label: "Published", render: (r) => r.publishedAt ? new Date(r.publishedAt).toLocaleDateString() : "—" },
      ]}
    />
  );
}
