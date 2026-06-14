import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  const authRoutes = ["/sign-in", "/sign-up", "/verify"];

  // Logged in user trying to access auth pages
  if (
    token &&
    authRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  // Not logged in user trying to access dashboard
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(
      new URL("/", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/sign-in",
    "/sign-up",
    "/verify/:path*",
    "/dashboard/:path*",
  ],
};