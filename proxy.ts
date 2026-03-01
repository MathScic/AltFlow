import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = getSessionCookie(request);

  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register");

  const isDashboard = pathname.startsWith("/dashboard");
  const isAdmin = pathname.startsWith("/admin");

  // Redirige vers login si pas de session
  if ((isDashboard || isAdmin) && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirige vers dashboard si déjà connecté
  if (isAuthPage && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Vérifie le rôle admin côté serveur
  if (isAdmin) {
    const fullSession = await auth.api.getSession({
      headers: request.headers,
    })
    if (!fullSession || fullSession.user.role !== 'admin') {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register"],
};