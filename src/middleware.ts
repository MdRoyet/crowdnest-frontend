import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function runs on every request matching the config below.
export function middleware(request: NextRequest) {
  // We will handle actual auth checks inside the dashboard layout
  // because we are using localStorage for our tokens.
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: ["/dashboard/:path*"],
};
