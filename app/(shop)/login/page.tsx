"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/lib/store";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") || "/account";
  const { setAuth } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "").trim();
    const password = String(fd.get("password") || "");
    const name = String(fd.get("name") || "").trim();
    try {
      setBusy(true);
      const result = mode === "login"
        ? await api.login({ email, password })
        : await api.register({ name, email, password });
      setAuth(result.user, result.token);
      toast.success(mode === "login" ? "Welcome back" : "Welcome to the Maison");
      // If admin, route to admin dashboard
      if (result.user.role === "admin") router.push("/admin/dashboard");
      else router.push(from);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 bg-ivory grid place-items-center" data-testid="auth-page">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="w-full max-w-md glass-card p-10">
        <div className="text-center mb-8">
          <p className="eyebrow">◆ Maison Privée</p>
          <h1 className="mt-4 font-display text-4xl text-emerald-vault">{mode === "login" ? "Welcome Back" : "Create Account"}</h1>
          <div className="hairline mt-4 w-16 mx-auto" />
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="eyebrow block mb-2">Name</label>
              <input name="name" required className="w-full px-4 py-3 bg-ivory border border-gold/30 focus:border-gold focus:outline-none text-sm" data-testid="auth-name" />
            </div>
          )}
          <div>
            <label className="eyebrow block mb-2">Email</label>
            <input name="email" type="email" required className="w-full px-4 py-3 bg-ivory border border-gold/30 focus:border-gold focus:outline-none text-sm" data-testid="auth-email" />
          </div>
          <div>
            <label className="eyebrow block mb-2">Password</label>
            <input name="password" type="password" minLength={6} required className="w-full px-4 py-3 bg-ivory border border-gold/30 focus:border-gold focus:outline-none text-sm" data-testid="auth-password" />
          </div>
          <button type="submit" disabled={busy} className="w-full mt-6 px-8 py-4 bg-emerald-vault text-ivory text-[11px] tracking-[0.4em] uppercase hover:bg-emerald transition disabled:opacity-50" data-testid="auth-submit">
            {busy ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="mt-6 w-full text-center text-[10px] tracking-[0.35em] uppercase text-gold hover:text-emerald transition"
          data-testid="auth-toggle-mode"
        >
          {mode === "login" ? "New to the Maison? Create an account" : "Already a client? Sign in"}
        </button>

        <div className="mt-8 pt-6 border-t border-gold/20 text-center">
          <Link href="/admin/login" className="text-[10px] tracking-[0.3em] uppercase text-onyx/50 hover:text-gold">
            Maison Staff · Admin Login →
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
