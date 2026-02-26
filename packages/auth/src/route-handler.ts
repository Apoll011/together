/**
 * Next.js App Router route handler helper.
 *
 * Drop this into your app:
 *   app/api/auth/[action]/route.ts
 *
 * @example
 * import { logtoClient } from "@/lib/auth";
 * import { createAuthRouteHandler } from "@repo/auth/route-handler";
 * export const { GET } = createAuthRouteHandler(logtoClient);
 */
import type LogtoClient from "@logto/next";
import type { NextRequest } from "next/server";

export function createAuthRouteHandler(logtoClient: LogtoClient) {
  const GET = async (
    request: NextRequest,
    { params }: { params: Promise<{ action: string }> }
  ) => {
    const { action } = await params;

    switch (action) {
      case "sign-in":
        return logtoClient.handleSignIn()(request);

      case "sign-in-callback":
        return logtoClient.handleSignInCallback()(request);

      case "sign-out":
        return logtoClient.handleSignOut()(request);

      case "sign-out-callback":
        return logtoClient.handleSignOutCallback()(request);

      default:
        return new Response("Not found", { status: 404 });
    }
  };

  return { GET };
}