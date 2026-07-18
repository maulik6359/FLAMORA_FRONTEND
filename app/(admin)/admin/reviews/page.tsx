"use client";
import { CrudAdmin } from "@/components/admin/CrudAdmin";
import { useAuth } from "@/lib/store";
import { toast } from "sonner";
import { Check, X, Star } from "lucide-react";

export default function ReviewsPage() {
  const { token } = useAuth();

  async function updateStatus(id: string, action: "approve" | "reject", refresh: () => void) {
    if (!token) return;
    await fetch(`/api/admin/reviews/${id}/${action}`, { method: "PATCH", headers: { Authorization: `Bearer ${token}` } });
    toast.success(`Review ${action}d`);
    refresh();
  }

  return (
    <CrudAdmin
      title="Reviews"
      eyebrow="Client Voices"
      endpoint="/admin/reviews"
      fields={[
        { name: "customerName", label: "Reviewer Name" },
        { name: "rating", label: "Rating (1-5)", type: "number", required: true },
        { name: "title", label: "Title", colSpan: 2 },
        { name: "comment", label: "Comment", type: "textarea", colSpan: 2 },
        { name: "status", label: "Status", type: "select", options: [
          { value: "pending", label: "Pending" },
          { value: "approved", label: "Approved" },
          { value: "rejected", label: "Rejected" },
          { value: "flagged", label: "Flagged" },
        ] },
        { name: "adminReply", label: "Admin Reply", type: "textarea", colSpan: 2 },
      ]}
      columns={[
        { key: "customerName", label: "Reviewer", render: (r) => r.customerName || r.customerEmail || "—" },
        { key: "rating", label: "Rating", render: (r) => (
          <div className="flex text-gold">{Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={12} fill={i < r.rating ? "currentColor" : "none"} className={i < r.rating ? "" : "text-neutral-700"} />
          ))}</div>
        ) },
        { key: "comment", label: "Comment", render: (r) => <span className="text-neutral-400 text-xs">{r.comment?.slice(0, 60) || "—"}</span> },
        { key: "status", label: "Status", render: (r) => <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${
          r.status === "approved" ? "bg-emerald-900/50 text-emerald-300" :
          r.status === "rejected" ? "bg-red-900/50 text-red-300" :
          r.status === "flagged" ? "bg-purple-900/50 text-purple-300" :
          "bg-amber-900/40 text-amber-300"
        }`}>{r.status}</span> },
      ]}
      extraActions={(row, refresh) => (
        <>
          <button onClick={() => updateStatus(row._id, "approve", refresh)} className="p-2 text-neutral-400 hover:text-emerald-400" title="Approve" data-testid={`review-approve-${row._id}`}><Check size={14} /></button>
          <button onClick={() => updateStatus(row._id, "reject", refresh)} className="p-2 text-neutral-400 hover:text-red-400" title="Reject" data-testid={`review-reject-${row._id}`}><X size={14} /></button>
        </>
      )}
    />
  );
}
