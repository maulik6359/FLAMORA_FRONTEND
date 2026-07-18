"use client";
import { CrudAdmin } from "@/components/admin/CrudAdmin";

export default function FaqsPage() {
  return (
    <CrudAdmin
      title="FAQs"
      eyebrow="Client Care"
      endpoint="/admin/faqs"
      fields={[
        { name: "question", label: "Question", required: true, colSpan: 2 },
        { name: "answer", label: "Answer", type: "textarea", required: true, colSpan: 2 },
        { name: "category", label: "Category", placeholder: "Shipping" },
        { name: "sortOrder", label: "Sort Order", type: "number" },
        { name: "isActive", label: "Active", type: "checkbox" },
      ]}
      columns={[
        { key: "question", label: "Question" },
        { key: "category", label: "Category", render: (r) => <span className="text-neutral-400 text-xs">{r.category}</span> },
        { key: "sortOrder", label: "Order", align: "right" },
        { key: "isActive", label: "Status", render: (r) => <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${r.isActive ? "bg-emerald-900/50 text-emerald-300" : "bg-neutral-900 text-neutral-500"}`}>{r.isActive ? "Active" : "Off"}</span> },
      ]}
    />
  );
}
