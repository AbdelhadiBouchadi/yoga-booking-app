import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Create the next-intl middleware
const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes, static files, and UploadThing
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/api/uploadthing") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/_vercel") ||
    pathname.startsWith("/trpc") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Handle admin routes with auth check
  if (pathname.startsWith("/admin") || pathname.includes("/admin")) {
    const sessionCookie = getSessionCookie(request);

    if (!sessionCookie) {
      // Redirect to home page (which will be localized)
      return NextResponse.redirect(new URL("/", request.url));
    }

    // For authenticated admin routes, skip i18n middleware
    return NextResponse.next();
  }

  // Apply i18n middleware for all other routes
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - API routes (/api/*)
    // - Static files (/_next/*, /_vercel/*, files with dots)
    // - tRPC routes (/trpc/*)
    "/((?!api|admin|_next|_vercel|trpc|.*\\..*).*)",
  ],
};
