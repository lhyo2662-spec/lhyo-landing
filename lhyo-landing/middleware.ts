import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";

  // Si alguien o Google entra por lhyogroup.vercel.app, redirigir permanentemente (301) a www.lhyogroup.com y desindexar el subdominio vercel.app
  if (host.includes("vercel.app")) {
    const targetUrl = new URL(request.nextUrl.pathname + request.nextUrl.search, "https://www.lhyogroup.com");
    const response = NextResponse.redirect(targetUrl, 301);
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg).*)"],
};
