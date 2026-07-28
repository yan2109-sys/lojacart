import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.ADMIN_SECRET || "fivem-loja-admin-secret");

const PUBLIC_PATHS = ["/painel/login", "/painel/registro", "/api/admin/login", "/api/painel/registro"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const dest = pathname.replace(/^\/admin/, "/painel");
    return NextResponse.redirect(new URL(dest, request.url));
  }

  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p))) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/painel") || pathname.startsWith("/api/admin")) {
    const token = request.cookies.get("admin_token")?.value;
    if (!token) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/painel/login", request.url));
    }
    try {
      jwtVerify(token, SECRET);
      return NextResponse.next();
    } catch {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/painel/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/painel/:path*", "/api/admin/:path*"],
};
