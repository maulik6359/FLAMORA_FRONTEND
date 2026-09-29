"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/store";

function LoginForm() {
 const router = useRouter();
 const searchParams = useSearchParams();
 const redirectTo = searchParams.get("from") || "/account";
 const { setAuth } = useAuth();
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [busy, setBusy] = useState(false);

 async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
   e.preventDefault();
   const trimmedEmail = email.trim();
   if (!trimmedEmail || !password) {
     toast.error("Please enter your email and password.");
     return;
   }

   try {
     setBusy(true);
     const result = await api.login({ email: trimmedEmail, password });
     setAuth(result.user, result.token);
     toast.success(result.user.role === "admin" ? "Admin signed in" : "Welcome back");
     router.push(result.user.role === "admin" ? "/admin/dashboard" : redirectTo);
   } catch (error: any) {
     toast.error(error.message || "Invalid email or password.");
   } finally {
     setBusy(false);
   }
 }

 return (
   <div className="mx-auto max-w-sm px-4 py-28">
     <p className="eyebrow">Membership</p>

     <h1 className="mt-3 font-display text-4xl">Sign in</h1>

     <p className="mt-3 text-sm text-muted-foreground">Sign in to your FLĀMORÁ account.</p>

     <form className="mt-10 space-y-7" onSubmit={onSubmit}>
       <div>
         <label htmlFor="login-email" className="eyebrow">
           Email
          </label>

          <input
           id="login-email"
           type="email"
           autoComplete="email"
           value={email}
           onChange={(e) => setEmail(e.target.value)}
            className="mt-3 w-full border-b border-border bg-transparent py-2.5 text-sm focus:border-gold-deep focus:outline-none"
           required
         />
       </div>

       <div>
         <label htmlFor="login-password" className="eyebrow">
           Password
         </label>

         <input
           id="login-password"
           type="password"
           autoComplete="current-password"
           value={password}
           onChange={(e) => setPassword(e.target.value)}
           className="mt-3 w-full border-b border-border bg-transparent py-2.5 text-sm focus:border-gold-deep focus:outline-none"
           minLength={6}
           required
         />
       </div>

       <button
         type="submit"
         disabled={busy}
         className="w-full bg-ink py-4 text-[11px] uppercase tracking-[0.28em] text-ivory transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
       >
         {busy ? "Signing in…" : "Continue"}
       </button>
     </form>

     <p className="mt-8 text-xs uppercase tracking-[0.18em] text-muted-foreground">
       New to FLĀMORÁ?{" "}
       <Link href="/auth/register" className="link-underline text-foreground">
         Create account
       </Link>
     </p>

     <Link href="/shop" className="mt-4 inline-block text-xs uppercase tracking-[0.22em] link-underline">
       Back to shopping
     </Link>
   </div>
 );
}

export default function LoginPage() {
 return (
   <Suspense fallback={<div className="mx-auto max-w-sm px-4 py-28">Loading…</div>}>
     <LoginForm />
   </Suspense>
 );
}