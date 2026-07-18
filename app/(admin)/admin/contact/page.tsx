"use client";
import { useEffect, useState } from "react";
import { Mail, Archive } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/store";

export default function ContactPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<any | null>(null);
  const [reply, setReply] = useState("");

  async function load() {
    if (!token) return;
    const q = statusFilter ? `?status=${statusFilter}` : "";
    const res = await fetch(`/api/admin/contact-messages${q}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setItems(data.items || []);
  }
  useEffect(() => { load(); }, [token, statusFilter]);

  async function sendReply() {
    if (!selected || !token) return;
    const res = await fetch(`/api/admin/contact-messages/${selected._id}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ message: reply }),
    });
    if (!res.ok) return toast.error("Failed to send reply");
    toast.success("Reply sent (mocked delivery)");
    setSelected(null);
    setReply("");
    load();
  }

  return (
    <div className="space-y-6" data-testid="admin-contact-page">
      <div>
        <p className="eyebrow text-neutral-500">◆ Concierge</p>
        <h1 className="mt-2 font-display text-4xl text-neutral-100">Contact Messages</h1>
      </div>

      <div className="flex gap-2">
        {["", "unread", "read", "replied", "archived"].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 text-[10px] tracking-[0.3em] uppercase border ${statusFilter === s ? "bg-gold text-neutral-950 border-gold" : "border-neutral-800 text-neutral-400 hover:border-gold"}`}
            data-testid={`filter-${s || "all"}`}>{s || "All"}</button>
        ))}
      </div>

      <div className="bg-[#111] border border-neutral-900 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 border-b border-neutral-900">
              <th className="text-left py-4 px-4">From</th>
              <th className="text-left py-4">Subject</th>
              <th className="text-left py-4">Message</th>
              <th className="text-left py-4">Status</th>
              <th className="text-right py-4 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((m) => (
              <tr key={m._id} className="border-b border-neutral-900 hover:bg-neutral-900/40" data-testid={`contact-${m._id}`}>
                <td className="py-3 px-4">
                  <p className="text-neutral-100">{m.name || "—"}</p>
                  <p className="text-xs text-neutral-500">{m.email}</p>
                </td>
                <td className="py-3 text-neutral-300">{m.subject || "—"}</td>
                <td className="py-3 text-neutral-400 text-xs max-w-md truncate">{m.message}</td>
                <td className="py-3"><span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${m.status === "replied" ? "bg-emerald-900/50 text-emerald-300" : m.status === "unread" ? "bg-amber-900/40 text-amber-300" : "bg-neutral-900 text-neutral-400"}`}>{m.status}</span></td>
                <td className="py-3 pr-4 text-right">
                  <button onClick={() => setSelected(m)} className="p-2 text-neutral-400 hover:text-gold" data-testid={`reply-${m._id}`}><Mail size={14} /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={5} className="text-center py-16 text-neutral-500 text-sm">No messages</td></tr>}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-sm p-6">
          <div className="w-full max-w-lg bg-[#111] border border-neutral-900 p-8 space-y-4">
            <div>
              <p className="eyebrow text-neutral-500">Reply to {selected.name || selected.email}</p>
              <h2 className="mt-1 font-display text-2xl text-neutral-100">{selected.subject || "Message"}</h2>
            </div>
            <div className="bg-neutral-950 p-4 border border-neutral-800 text-sm text-neutral-400 max-h-40 overflow-y-auto">{selected.message}</div>
            <textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={5} placeholder="Your response…" className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 focus:border-gold outline-none text-sm text-neutral-100" data-testid="reply-textarea" />
            <div className="flex gap-3">
              <button onClick={sendReply} className="px-6 py-2.5 bg-gold text-neutral-950 text-[11px] tracking-[0.35em] uppercase font-medium" data-testid="reply-send">Send Reply</button>
              <button onClick={() => setSelected(null)} className="px-6 py-2.5 border border-neutral-800 text-neutral-400 text-[11px] tracking-[0.35em] uppercase">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
