"use client";
import { useEffect, useState, Fragment } from "react";
import { ScrollText, Filter, RefreshCw } from "lucide-react";
import { useAuth } from "@/lib/store";

type AuditRow = {
  _id: string;
  action: "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT";
  module: string;
  targetId?: string;
  adminUser?: { name?: string; email?: string };
  ipAddress?: string;
  createdAt: string;
  changes?: any;
};

const ACTION_COLOURS: Record<string, string> = {
  CREATE: "bg-emerald-900/60 text-emerald-300",
  UPDATE: "bg-amber-900/60 text-amber-300",
  DELETE: "bg-red-900/60 text-red-300",
  LOGIN: "bg-blue-900/60 text-blue-300",
  LOGOUT: "bg-neutral-900 text-neutral-400",
};

export default function AuditLogsPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<AuditRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [module, setModule] = useState("");
  const [action, setAction] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  async function load() {
    if (!token) return;
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      if (module) qs.set("module", module);
      if (action) qs.set("action", action);
      qs.set("limit", "100");
      const res = await fetch(`/api/admin/audit-logs?${qs.toString()}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setItems(data.items || []);
      setTotal(data.total || 0);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, [token, module, action]);

  return (
    <div className="space-y-6" data-testid="audit-logs-page">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="eyebrow text-neutral-500">◆ Console · Forensics</p>
          <h1 className="mt-2 font-display text-4xl text-neutral-100">Audit Logs</h1>
          <p className="text-sm text-neutral-500 mt-2 max-w-2xl">
            An immutable trail of every mutation performed in the admin console — who, what, when.
          </p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 px-4 py-2 border border-neutral-800 text-neutral-300 hover:border-gold hover:text-gold text-[10px] tracking-[0.35em] uppercase transition"
          data-testid="audit-refresh-btn"
        >
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 bg-[#111] border border-neutral-900 p-4">
        <Filter size={14} className="text-neutral-500" />
        <input
          value={module}
          onChange={(e) => setModule(e.target.value)}
          placeholder="Filter by module (e.g. products, settings)"
          className="flex-1 min-w-[220px] px-3 py-2 bg-neutral-950 border border-neutral-800 focus:border-gold outline-none text-sm text-neutral-100"
          data-testid="audit-filter-module"
        />
        <select
          value={action}
          onChange={(e) => setAction(e.target.value)}
          className="px-3 py-2 bg-neutral-950 border border-neutral-800 focus:border-gold outline-none text-sm text-neutral-100"
          data-testid="audit-filter-action"
        >
          <option value="">All actions</option>
          <option value="CREATE">CREATE</option>
          <option value="UPDATE">UPDATE</option>
          <option value="DELETE">DELETE</option>
          <option value="LOGIN">LOGIN</option>
          <option value="LOGOUT">LOGOUT</option>
        </select>
        <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-500">{total} entries</span>
      </div>

      <div className="bg-[#111] border border-neutral-900 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 border-b border-neutral-900">
              <th className="py-4 px-4 text-left">When</th>
              <th className="py-4 px-4 text-left">Actor</th>
              <th className="py-4 px-4 text-left">Action</th>
              <th className="py-4 px-4 text-left">Module</th>
              <th className="py-4 px-4 text-left">Target</th>
              <th className="py-4 px-4 text-left">IP</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => {
              const open = expanded === row._id;
              return (
                <Fragment key={row._id}>
                  <tr
                    className="border-b border-neutral-900 hover:bg-neutral-900/40 cursor-pointer"
                    onClick={() => setExpanded(open ? null : row._id)}
                    data-testid={`audit-row-${row._id}`}
                  >
                    <td className="py-3 px-4 text-neutral-300 whitespace-nowrap text-xs">
                      {new Date(row.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-neutral-300">
                      <div className="text-neutral-200">{row.adminUser?.name || "—"}</div>
                      <div className="text-[10px] text-neutral-500">{row.adminUser?.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${ACTION_COLOURS[row.action] || "bg-neutral-900 text-neutral-400"}`}>
                        {row.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-neutral-300 text-xs">{row.module}</td>
                    <td className="py-3 px-4 text-neutral-500 text-xs font-mono">{row.targetId ? row.targetId.slice(-8) : "—"}</td>
                    <td className="py-3 px-4 text-neutral-500 text-xs">{row.ipAddress || "—"}</td>
                  </tr>
                  {open && row.changes && (
                    <tr className="bg-neutral-950/60 border-b border-neutral-900">
                      <td colSpan={6} className="px-6 py-4">
                        <p className="eyebrow text-neutral-500 mb-2">◆ Change payload</p>
                        <pre className="text-[11px] text-neutral-300 bg-black/60 p-3 overflow-x-auto max-h-64 border border-neutral-900">
                          {JSON.stringify(row.changes, null, 2)}
                        </pre>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-16 text-neutral-500 text-sm">
                  <ScrollText size={22} className="mx-auto mb-3 opacity-50" />
                  No audit entries yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
