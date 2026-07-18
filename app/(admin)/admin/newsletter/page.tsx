"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/store";

export default function NewsletterPage() {
  const { token } = useAuth();
  const [tab, setTab] = useState<"subscribers" | "campaign" | "history">("subscribers");
  const [subs, setSubs] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);

  async function loadSubs() {
    if (!token) return;
    const r = await fetch("/api/admin/newsletter/subscribers?limit=200", { headers: { Authorization: `Bearer ${token}` } });
    const d = await r.json();
    setSubs(d.items || []);
  }
  async function loadCampaigns() {
    if (!token) return;
    const r = await fetch("/api/admin/newsletter/campaigns", { headers: { Authorization: `Bearer ${token}` } });
    const d = await r.json();
    setCampaigns(d.items || []);
  }
  useEffect(() => { loadSubs(); loadCampaigns(); }, [token]);

  async function send(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) return;
    const fd = new FormData(e.currentTarget);
    try {
      setBusy(true);
      const r = await fetch("/api/admin/newsletter/campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ subject: fd.get("subject"), htmlContent: fd.get("htmlContent"), segment: fd.get("segment") }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message);
      toast.success(`Sent to ${d.recipientCount} subscribers (MOCKED delivery)`);
      (e.currentTarget as HTMLFormElement).reset();
      loadCampaigns();
    } catch (err: any) { toast.error(err.message); } finally { setBusy(false); }
  }

  return (
    <div className="space-y-6" data-testid="admin-newsletter-page">
      <div>
        <p className="eyebrow text-neutral-500">◆ Correspondance</p>
        <h1 className="mt-2 font-display text-4xl text-neutral-100">Newsletter</h1>
      </div>

      <div className="flex gap-2">
        {(["subscribers", "campaign", "history"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-[10px] tracking-[0.3em] uppercase border ${tab === t ? "bg-gold text-neutral-950 border-gold" : "border-neutral-800 text-neutral-400 hover:border-gold"}`}
            data-testid={`newsletter-tab-${t}`}>
            {t === "subscribers" ? `Subscribers (${subs.length})` : t === "campaign" ? "Send Campaign" : `History (${campaigns.length})`}
          </button>
        ))}
      </div>

      {tab === "subscribers" && (
        <div className="bg-[#111] border border-neutral-900 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 border-b border-neutral-900">
                <th className="text-left py-4 px-4">Email</th>
                <th className="text-left py-4">Name</th>
                <th className="text-left py-4">Status</th>
                <th className="text-right py-4 pr-4">Joined</th>
              </tr>
            </thead>
            <tbody>
              {subs.map((s) => (
                <tr key={s._id} className="border-b border-neutral-900" data-testid={`subscriber-${s._id}`}>
                  <td className="py-3 px-4 text-neutral-100">{s.email}</td>
                  <td className="py-3 text-neutral-400">{s.name || "—"}</td>
                  <td className="py-3"><span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-emerald-900/50 text-emerald-300">{s.status}</span></td>
                  <td className="py-3 pr-4 text-right text-neutral-500 text-xs">{new Date(s.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {subs.length === 0 && <tr><td colSpan={4} className="text-center py-16 text-neutral-500 text-sm">No subscribers yet</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {tab === "campaign" && (
        <form onSubmit={send} className="bg-[#111] border border-neutral-900 p-6 space-y-4 max-w-2xl" data-testid="campaign-form">
          <div>
            <label className="eyebrow block mb-2 text-neutral-400">Subject *</label>
            <input name="subject" required placeholder="New Arrivals — Summer 2026" className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 focus:border-gold outline-none text-sm text-neutral-100" data-testid="campaign-subject" />
          </div>
          <div>
            <label className="eyebrow block mb-2 text-neutral-400">Content (HTML) *</label>
            <textarea name="htmlContent" required rows={10} placeholder="<h1>Bonjour</h1><p>Introducing our summer collection…</p>" className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 focus:border-gold outline-none text-sm text-neutral-100 font-mono" data-testid="campaign-content" />
          </div>
          <div>
            <label className="eyebrow block mb-2 text-neutral-400">Segment</label>
            <select name="segment" defaultValue="all" className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 focus:border-gold outline-none text-sm text-neutral-100">
              <option value="all">All Subscribers</option>
            </select>
          </div>
          <p className="text-[10px] tracking-[0.25em] uppercase text-amber-400">◆ MOCKED — Real email delivery (SendGrid/Resend) belongs in Phase 4</p>
          <button type="submit" disabled={busy} className="px-6 py-3 bg-gold text-neutral-950 text-[11px] tracking-[0.35em] uppercase font-medium disabled:opacity-50" data-testid="campaign-send">{busy ? "Sending…" : "Send Campaign"}</button>
        </form>
      )}

      {tab === "history" && (
        <div className="bg-[#111] border border-neutral-900 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 border-b border-neutral-900">
                <th className="text-left py-4 px-4">Subject</th>
                <th className="text-left py-4">Segment</th>
                <th className="text-right py-4">Recipients</th>
                <th className="text-right py-4 pr-4">Sent</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c._id} className="border-b border-neutral-900" data-testid={`campaign-${c._id}`}>
                  <td className="py-3 px-4 text-neutral-100">{c.subject}</td>
                  <td className="py-3 text-neutral-400">{c.segment}</td>
                  <td className="py-3 text-right text-gold">{c.recipientCount ?? 0}</td>
                  <td className="py-3 pr-4 text-right text-neutral-500 text-xs">{c.sentAt ? new Date(c.sentAt).toLocaleString() : "—"}</td>
                </tr>
              ))}
              {campaigns.length === 0 && <tr><td colSpan={4} className="text-center py-16 text-neutral-500 text-sm">No campaigns yet</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
