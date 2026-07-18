"use client";
import { useEffect, useState } from "react";
import { Bell, Check } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/store";

export default function NotificationsPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [unread, setUnread] = useState(0);

  async function load() {
    if (!token) return;
    const r = await fetch("/api/admin/notifications", { headers: { Authorization: `Bearer ${token}` } });
    const d = await r.json();
    setItems(d.items || []);
    setUnread(d.unread || 0);
  }
  useEffect(() => { load(); }, [token]);

  async function readAll() {
    if (!token) return;
    await fetch("/api/admin/notifications/read-all", { method: "PATCH", headers: { Authorization: `Bearer ${token}` } });
    toast.success("All marked read");
    load();
  }

  return (
    <div className="space-y-6" data-testid="admin-notifications-page">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow text-neutral-500">◆ Alerts</p>
          <h1 className="mt-2 font-display text-4xl text-neutral-100">Notifications {unread > 0 && <span className="text-gold text-lg">· {unread} unread</span>}</h1>
        </div>
        {unread > 0 && (
          <button onClick={readAll} className="flex items-center gap-2 px-6 py-3 border border-gold/40 text-gold text-[11px] tracking-[0.35em] uppercase hover:bg-gold/10" data-testid="mark-read-all">
            <Check size={14} /> Mark all read
          </button>
        )}
      </div>

      <div className="bg-[#111] border border-neutral-900 divide-y divide-neutral-900">
        {items.map((n) => (
          <div key={n._id} className={`p-5 flex items-start gap-4 ${n.isRead ? "" : "bg-gold/5"}`} data-testid={`notification-${n._id}`}>
            <div className={`h-9 w-9 rounded-full grid place-items-center flex-shrink-0 ${n.type === "order" ? "bg-emerald-900/50 text-emerald-300" : n.type === "review" ? "bg-purple-900/50 text-purple-300" : n.type === "contact" ? "bg-blue-900/50 text-blue-300" : "bg-neutral-900 text-neutral-400"}`}>
              <Bell size={14} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-neutral-100">{n.title}</p>
              {n.message && <p className="mt-1 text-sm text-neutral-500">{n.message}</p>}
              <p className="mt-2 text-[10px] tracking-[0.3em] uppercase text-neutral-600">{n.type} · {new Date(n.createdAt).toLocaleString()}</p>
            </div>
            {!n.isRead && <div className="h-2 w-2 rounded-full bg-gold flex-shrink-0 mt-2" />}
          </div>
        ))}
        {items.length === 0 && <p className="text-center py-16 text-neutral-500 text-sm">No notifications</p>}
      </div>
    </div>
  );
}
