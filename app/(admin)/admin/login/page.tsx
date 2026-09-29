"use client";
import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/lib/store";
import { api } from "@/lib/api";

function AdminLoginContent() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") || "/admin/dashboard";
  const { setAuth, user } = useAuth();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user?.role === "admin") router.replace("/admin/dashboard");
  }, [user, router]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "").trim();
    const password = String(fd.get("password") || "");
    try {
      setBusy(true);
      const { user, token } = await api.login({ email, password });
      if (user.role !== "admin") {
        toast.error("This account is not authorized for the console");
        return;
      }

      setAuth(user, token);
      toast.success("Welcome, Maison");
      router.push(from);
    } catch (err: any) {
      toast.error(err.message || "Invalid credentials");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-noir grid place-items-center px-6" data-testid="admin-login-page">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="w-full max-w-md p-10 bg-[#111] border border-neutral-900 rounded-none">
        <div className="text-center mb-10">
          <span className="font-display text-3xl tracking-[0.3em] gold-text">FLAMORA</span>
          <p className="mt-2 eyebrow text-neutral-500">Admin Console</p>
          <div className="hairline mt-6 mx-auto w-16" />
        </div>
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="eyebrow block mb-2 text-neutral-400">Email</label>
            <input
              name="email"
              type="email"
              required
              defaultValue="admin@flamora.com"
              className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 focus:border-gold focus:outline-none text-sm text-neutral-100"
              data-testid="admin-login-email"
            />
          </div>
          <div>
            <label className="eyebrow block mb-2 text-neutral-400">Password</label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              defaultValue="Admin@1234"
              className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 focus:border-gold focus:outline-none text-sm text-neutral-100"
              data-testid="admin-login-password"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full mt-6 px-8 py-4 bg-gold text-neutral-950 text-[11px] tracking-[0.4em] uppercase font-medium hover:bg-gold-soft transition disabled:opacity-50"
            data-testid="admin-login-submit"
          >
            {busy ? "Signing in…" : "Sign In"}
          </button>
        </form>
        <p className="mt-8 text-[10px] tracking-[0.3em] uppercase text-neutral-600 text-center">
          Default: admin@flamora.com · Admin@1234
        </p>
      </motion.div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-noir" />}>
      <AdminLoginContent />
    </Suspense>
  );
}
