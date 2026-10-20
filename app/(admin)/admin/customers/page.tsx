"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/store";

export default function AdminCustomersPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<any[]>([]);

  function load() {
    if (!token) return;
    fetch("/api/admin/customers?limit=50", { headers: { Authorization: `Bearer ${token}` } })
      .then(async (r) => {
        const d = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(d.message || `HTTP ${r.status}`);
        setItems(d.items || []);
      })
      .catch((err) => toast.error(err.message || "Could not load customers"));
  }
  useEffect(load, [token]);

  // Blocking also signs the customer out everywhere (the API revokes their tokens).
  async function update(c: any, data: { isBlocked?: boolean; role?: "admin" }, done: string) {
    if (!token) return;
    if (data.role === "admin" && !confirm(`Give ${c.email} full admin access?`)) return;
    try {
      await api.admin.updateCustomer(c._id, data, token);
      toast.success(done);
      load();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  return (
    <div className="space-y-6" data-testid="admin-customers-page">
      <div>
        <p className="eyebrow text-neutral-500">◆ Clientèle</p>
        <h1 className="mt-2 font-display text-4xl text-neutral-100">Customers</h1>
      </div>
      <div className="bg-[#111] border border-neutral-900 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 border-b border-neutral-900">
              <th className="text-left py-4 px-6">Name</th>
              <th className="text-left py-4">Email</th>
              <th className="text-left py-4">Role</th>
              <th className="text-left py-4">Status</th>
              <th className="text-right py-4">Joined</th>
              <th className="text-right py-4 pr-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c._id} className="border-b border-neutral-900 hover:bg-neutral-900/40" data-testid={`admin-customer-${c._id}`}>
                <td className="py-3 px-6 text-neutral-100">{c.name}</td>
                <td className="py-3 text-neutral-400">{c.email}</td>
                <td className="py-3"><span className="px-2 py-0.5 text-[10px] uppercase tracking-wider bg-neutral-900 text-neutral-300">{c.role}</span></td>
                <td className="py-3">
                  <span className={`text-[10px] uppercase tracking-wider ${c.isBlocked ? "text-red-400" : "text-emerald-400"}`}>{c.isBlocked ? "Blocked" : "Active"}</span>
                </td>
                <td className="py-3 text-right text-neutral-500 text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                <td className="py-3 pr-6 text-right space-x-4 whitespace-nowrap">
                  <button type="button" onClick={() => update(c, { isBlocked: !c.isBlocked }, c.isBlocked ? "Customer unblocked" : "Customer blocked")} className="text-[10px] uppercase tracking-[0.2em] text-gold hover:underline" data-testid={`toggle-block-${c._id}`}>
                    {c.isBlocked ? "Unblock" : "Block"}
                  </button>
                  <button type="button" onClick={() => update(c, { role: "admin" }, "Customer is now an admin")} className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 hover:text-gold">
                    Make admin
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={6} className="text-center py-16 text-neutral-500 text-sm">No customers yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
