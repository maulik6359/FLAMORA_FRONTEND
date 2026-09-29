"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/store";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawFrom = searchParams.get("from");
  const redirectTo = rawFrom || "/account";
  const isCheckout = rawFrom === "/checkout" || rawFrom?.startsWith("/checkout");

  const { setAuth } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    newsletter: true,
    terms: false,
  });
  const [busy, setBusy] = useState(false);

  const updateField = (key: string, value: string | boolean) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim();

    if (!name || !email || !form.password) {
      toast.error("Please complete all required fields.");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    if (form.password !== form.confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    if (!form.terms) {
      toast.error("Please accept the terms to continue.");
      return;
    }

    try {
      setBusy(true);
      const result = await api.register({ name, email, password: form.password });
      setAuth(result.user, result.token);
      toast.success(result.user.role === "admin" ? "Admin registered" : isCheckout ? "Account created! Redirecting to checkout…" : "Account created successfully");
      router.push(result.user.role === "admin" ? "/admin/dashboard" : redirectTo);
    } catch (error: any) {
      toast.error(error.message || "Unable to create your account right now.");
    } finally {
      setBusy(false);
    }
  }

  const loginLink = rawFrom ? `/auth/login?from=${encodeURIComponent(rawFrom)}` : "/auth/login";

  return (
    <div className="mx-auto max-w-md px-4 py-24 md:py-28">
      <p className="eyebrow text-gold-deep">Membership</p>

      <h1 className="mt-3 font-display text-4xl">Create account</h1>

      {isCheckout ? (
        <div className="mt-4 rounded-md border border-gold-deep/30 bg-gold-soft/40 p-4 text-xs leading-relaxed text-foreground">
          <p className="font-medium text-gold-deep">Checkout Registration</p>
          <p className="mt-1 text-muted-foreground">Create an account to complete your purchase. Your bag will be saved.</p>
        </div>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">
          Create your FLĀMORÁ account to track orders, save pieces and receive private collection previews.
        </p>
      )}

      <form className="mt-8 space-y-7" onSubmit={onSubmit}>
        <div>
          <label htmlFor="register-name" className="eyebrow">
            Full name
          </label>
          <input
            id="register-name"
            type="text"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            className="mt-3 w-full border-b border-border bg-transparent py-2.5 text-sm focus:border-gold-deep focus:outline-none"
            required
          />
        </div>

        <Field
          id="register-email"
          label="Email"
          type="email"
          value={form.email}
          onChange={(value) => updateField("email", value)}
        />

        <Field
          id="register-password"
          label="Password"
          type="password"
          value={form.password}
          onChange={(value) => updateField("password", value)}
        />

        <Field
          id="register-confirm"
          label="Confirm password"
          type="password"
          value={form.confirm}
          onChange={(value) => updateField("confirm", value)}
        />

        <label className="flex items-start gap-3 text-xs text-muted-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={form.newsletter}
            onChange={(e) => updateField("newsletter", e.target.checked)}
            className="mt-0.5 size-4 accent-[var(--gold-deep)]"
          />
          <span>Send me new arrivals and private previews.</span>
        </label>

        <label className="flex items-start gap-3 text-xs text-muted-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={form.terms}
            onChange={(e) => updateField("terms", e.target.checked)}
            className="mt-0.5 size-4 accent-[var(--gold-deep)]"
          />
          <span>I agree to the terms of service and privacy policy.</span>
        </label>

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-ink py-4 text-[11px] uppercase tracking-[0.28em] text-ivory transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        >
          {busy ? "Creating account…" : isCheckout ? "Register & Continue to Checkout" : "Create account"}
        </button>
      </form>

      <p className="mt-8 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        Already a member? <Link href={loginLink} className="link-underline text-foreground font-medium">Sign in</Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-4 py-28 text-center text-sm text-muted-foreground">Loading…</div>}>
      <RegisterForm />
    </Suspense>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow">
        {label}
      </label>

      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-3 w-full border-b border-border bg-transparent py-2.5 text-sm focus:border-gold-deep focus:outline-none"
        required
      />
    </div>
  );
}