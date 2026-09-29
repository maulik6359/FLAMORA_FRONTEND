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
 const rawFrom = searchParams.get("from");
 const redirectTo = rawFrom || "/account";
 const isCheckout = rawFrom === "/checkout" || rawFrom?.startsWith("/checkout");

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
     toast.success(result.user.role === "admin" ? "Admin signed in" : isCheckout ? "Signed in! Returning to checkout…" : "Welcome back");
     router.push(result.user.role === "admin" ? "/admin/dashboard" : redirectTo);
   } catch (error: any) {
     toast.error(error.message || "Invalid email or password.");
   } finally {
     setBusy(false);
   }
 }

 const registerLink = rawFrom ? `/auth/register?from=${encodeURIComponent(rawFrom)}` : "/auth/register";

 return (
   <div className="mx-auto max-w-sm px-4 py-24 md:py-28">
     <p className="eyebrow text-gold-deep">Membership</p>

     <h1 className="mt-3 font-display text-4xl">Sign in</h1>

     {isCheckout ? (
       <div className="mt-4 rounded-md border border-gold-deep/30 bg-gold-soft/40 p-4 text-xs leading-relaxed text-foreground">
         <p className="font-medium text-gold-deep">Checkout Authentication</p>
         <p className="mt-1 text-muted-foreground">Sign in to complete your purchase. Your cart items will be saved.</p>
       </div>
     ) : (
       <p className="mt-3 text-sm text-muted-foreground">Sign in to your FLĀMORÁ account.</p>
     )}

     <form className="mt-8 space-y-7" onSubmit={onSubmit}>
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
         className="w-full bg-ink py-4 text-[11px] uppercase tracking-[0.28em] text-ivory transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
       >
         {busy ? "Signing in…" : isCheckout ? "Sign in to Checkout" : "Continue"}
       </button>
     </form>

     <p className="mt-8 text-xs uppercase tracking-[0.18em] text-muted-foreground">
       New to FLĀMORÁ?{" "}
       <Link href={registerLink} className="link-underline text-foreground font-medium">
         Create account
       </Link>
     </p>

     <Link href="/shop" className="mt-4 inline-block text-xs uppercase tracking-[0.22em] link-underline text-muted-foreground hover:text-foreground">
       Back to shopping
     </Link>
   </div>
 );
}

export default function LoginPage() {
 return (
   <Suspense fallback={<div className="mx-auto max-w-sm px-4 py-28 text-center text-sm text-muted-foreground">Loading…</div>}>
     <LoginForm />
   </Suspense>
 );
}