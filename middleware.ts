import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ADMIN = ["/admin/login"];
const API = `${process.env.API_INTERNAL_URL || "http://127.0.0.1:8001"}/api`;

// The admin console is gated on what the backend says about the token, not on the
// client-writable flamora_role cookie. (The admin APIs check the token themselves too.)
async function adminStatus(token: string | undefined): Promise<"admin" | "customer" | "invalid"> {
  if (!token) return "invalid";
  try {
    const res = await fetch(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
    if (!res.ok) return "invalid";
    const { user } = await res.json();
    return user?.role === "admin" ? "admin" : "customer";
  } catch {
    return "invalid"; // backend unreachable: fail closed
  }
}

function toLogin(request: NextRequest, pathname: string) {
  const url = new URL("/admin/login", request.url);
  if (pathname !== "/admin/login") url.searchParams.set("from", pathname);
  const res = NextResponse.redirect(url);
  // Drop a stale session so the login page doesn't bounce straight back.
  res.cookies.delete("flamora_token");
  res.cookies.delete("flamora_role");
  return res;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  const token = request.cookies.get("flamora_token")?.value;
  const isPublic = PUBLIC_ADMIN.some((p) => pathname.startsWith(p));

  if (isPublic) {
    // Already signed in as an admin: skip the login form.
    if (token && (await adminStatus(token)) === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.next();
  }

  const status = await adminStatus(token);
  if (status === "invalid") return toLogin(request, pathname);
  if (status === "customer") return NextResponse.redirect(new URL("/", request.url));
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
