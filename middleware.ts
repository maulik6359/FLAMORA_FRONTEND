import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ADMIN = ["/admin/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  const token = request.cookies.get("flamora_token")?.value;
  const role = request.cookies.get("flamora_role")?.value;
  const isPublic = PUBLIC_ADMIN.some((p) => pathname.startsWith(p));

  if (!token && !isPublic) {
    const url = new URL("/admin/login", request.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }
  if (token && isPublic) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }
  if (token && role !== "admin" && !isPublic) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
