import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/account/:path*",
    "/login",
    "/register",
    "/api/auth/sign-in/email",
    "/api/auth/sign-up/email",
    "/api/auth/forget-password",
    "/api/auth/send-verification-email",
  ],
};
