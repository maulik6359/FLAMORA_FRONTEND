"use client";

import { useEffect, useState } from "react";
import { CrudAdmin } from "@/components/admin/CrudAdmin";
import { useAuth } from "@/lib/store";
import { ShieldCheck, AlertTriangle, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "sonner";

export default function PaymentMethodsPage() {
  const { token } = useAuth();
  const [razorpayStatus, setRazorpayStatus] = useState<{
    exists: boolean;
    isActive: boolean;
    name?: string;
    hasCredentials?: boolean;
  }>({ exists: false, isActive: false, hasCredentials: true });

  const fetchRazorpayStatus = async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/admin/payment-methods?all=true", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const rzp = (data.items || []).find((m: any) => m.provider === "razorpay");
      if (rzp) {
        setRazorpayStatus({
          exists: true,
          isActive: rzp.isActive,
          name: rzp.name,
          hasCredentials: true, // test credentials configured on backend
        });
      } else {
        setRazorpayStatus({ exists: false, isActive: false });
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchRazorpayStatus();
  }, [token]);

  const toggleMethodActive = async (row: any, refresh: () => void) => {
    if (!token) return;
    try {
      const newStatus = !row.isActive;
      const res = await fetch(`/api/admin/payment-methods/${row._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: newStatus }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update status");
      }

      toast.success(
        `${row.name} is now ${newStatus ? "ENABLED" : "DISABLED"} for checkout.`
      );
      refresh();
      fetchRazorpayStatus();
    } catch (err: any) {
      toast.error(err.message || "Error updating status");
    }
  };

  return (
    <div className="space-y-6">
      {/* Razorpay Gateway Overview Status Banner */}
      <div className="rounded-lg border border-neutral-800 bg-[#141414] p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-md ${
                razorpayStatus.isActive
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
              }`}
            >
              {razorpayStatus.isActive ? (
                <ShieldCheck className="size-6" />
              ) : (
                <AlertTriangle className="size-6" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg text-neutral-100">
                  Razorpay Integration Status
                </h2>
                <span
                  className={`text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded font-semibold ${
                    razorpayStatus.isActive
                      ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                      : "bg-neutral-900 text-neutral-400 border border-neutral-800"
                  }`}
                >
                  {razorpayStatus.isActive ? "Active on Checkout" : "Disabled"}
                </span>
              </div>

              <p className="mt-1 text-xs text-neutral-400">
                {razorpayStatus.isActive
                  ? "Customers can pay using UPI, Credit/Debit cards, NetBanking, and Wallets via Razorpay."
                  : "Razorpay payment option is hidden from checkout. Toggle below to enable customer payments."}
              </p>
            </div>
          </div>

          <div className="text-right text-xs text-neutral-400 border-t md:border-t-0 md:border-l border-neutral-800 pt-3 md:pt-0 md:pl-6">
            <p className="font-mono text-[11px] text-neutral-300">
              Provider: <span className="text-gold">razorpay</span>
            </p>
            <p className="mt-1 font-mono text-[11px] text-neutral-400">
              API Environment: <span className="text-emerald-400">Test / Live Mode</span>
            </p>
          </div>
        </div>
      </div>

      <CrudAdmin
        title="Payment Methods"
        eyebrow="Ledger · Settlements"
        endpoint="/payment-methods"
        fields={[
          {
            name: "name",
            label: "Display name",
            required: true,
            placeholder: "Razorpay (UPI / Cards / NetBanking)",
            colSpan: 2,
          },
          {
            name: "provider",
            label: "Provider key",
            required: true,
            placeholder: "razorpay, cod, stripe…",
          },
          {
            name: "type",
            label: "Type",
            type: "select",
            required: true,
            options: [
              { value: "card", label: "Card / Multi-gateway" },
              { value: "wallet", label: "Wallet" },
              { value: "cod", label: "Cash on Delivery" },
              { value: "bank_transfer", label: "Bank Transfer" },
              { value: "crypto", label: "Crypto" },
            ],
          },
          {
            name: "description",
            label: "Checkout Subtitle / Instructions",
            type: "textarea",
            placeholder: "Pay securely via UPI, Credit/Debit Cards, NetBanking or Mobile Wallets",
            colSpan: 2,
          },
          { name: "sortOrder", label: "Sort order (1 = first)", type: "number" },
          { name: "isActive", label: "Active on Storefront", type: "checkbox" },
        ]}
        columns={[
          { key: "name", label: "Method Name" },
          {
            key: "provider",
            label: "Provider",
            render: (r) => (
              <span className="font-mono text-xs text-gold">{r.provider}</span>
            ),
          },
          {
            key: "type",
            label: "Type",
            render: (r) => (
              <span className="text-[10px] uppercase tracking-wider text-neutral-400">
                {r.type}
              </span>
            ),
          },
          { key: "sortOrder", label: "Order", align: "right" },
          {
            key: "isActive",
            label: "Status",
            render: (r) => (
              <span
                className={`text-[10px] uppercase tracking-wider px-2 py-0.5 font-medium rounded ${
                  r.isActive
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                    : "bg-neutral-900 text-neutral-500 border border-neutral-800"
                }`}
              >
                {r.isActive ? "Live" : "Disabled"}
              </span>
            ),
          },
        ]}
        extraActions={(row, refresh) => (
          <button
            type="button"
            onClick={() => toggleMethodActive(row, refresh)}
            title={row.isActive ? "Click to Disable" : "Click to Enable"}
            className={`p-1.5 rounded transition ${
              row.isActive
                ? "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/50"
                : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800"
            }`}
            data-testid={`toggle-status-${row._id}`}
          >
            {row.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
          </button>
        )}
      />
    </div>
  );
}
