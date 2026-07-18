"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/store";

export default function AdminCustomersPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (!token) return;
    fetch("/api/admin/customers?limit=50", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setItems(d.items || []));
  }, [token]);

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
              <th className="text-right py-4 pr-6">Joined</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c._id} className="border-b border-neutral-900 hover:bg-neutral-900/40" data-testid={`admin-customer-${c._id}`}>
                <td className="py-3 px-6 text-neutral-100">{c.name}</td>
                <td className="py-3 text-neutral-400">{c.email}</td>
                <td className="py-3"><span className="px-2 py-0.5 text-[10px] uppercase tracking-wider bg-neutral-900 text-neutral-300">{c.role}</span></td>
                <td className="py-3 pr-6 text-right text-neutral-500 text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={4} className="text-center py-16 text-neutral-500 text-sm">No customers yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
