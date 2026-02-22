import { cookies, headers } from "next/headers";
import type {
  TogetherSession,
  IdentitySessionResponse,
} from "./types/index.js";
import { normalizeSession } from "./utils/session.js";
import { getConfig, getIdentityUrl } from "./config.js";

/**
 * Fetches the current session from the identity server during SSR.
 *
 * Use this in Next.js App Router server components and server actions.
 * Forwards the incoming request's Cookie header so the identity server
 * can authenticate the httpOnly session cookie.
 *
 * @example
 * // app/dashboard/page.tsx
 * import { getServerSession } from "@together/auth-client/server";
 *
 * export default async function DashboardPage() {
 *   const session = await getServerSession();
 *   if (!session) redirect("/login");
 *   return <Dashboard user={session.user} />;
 * }
 */
export async function getServerSession(): Promise<TogetherSession | null> {
  try {
    // Forward cookies from the incoming request
    const cookieStore = await cookies();
    const allHeaders = await headers();

    // Reconstruct Cookie header from the server-side cookie store
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    // Preserve forwarded host headers for identity server CORS checks
    const forwardedFor = allHeaders.get("x-forwarded-for") ?? undefined;
    const userAgent = allHeaders.get("user-agent") ?? undefined;

    const res = await fetch(getIdentityUrl("/api/session"), {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
        ...(forwardedFor ? { "X-Forwarded-For": forwardedFor } : {}),
        ...(userAgent ? { "User-Agent": userAgent } : {}),
      },
    });

    if (!res.ok) return null;

    const json = (await res.json()) as
      | IdentitySessionResponse
      | { ok: false };

    if (!json.ok) return null;

    return normalizeSession((json as IdentitySessionResponse).data);
  } catch {
    return null;
  }
}

/**
 * Server-side logout — calls the identity server's sign-out endpoint.
 * Call from a Server Action or Route Handler, then redirect the user.
 *
 * @example
 * // app/actions/auth.ts
 * "use server";
 * import { serverLogout } from "@together/auth-client/server";
 * import { redirect } from "next/navigation";
 *
 * export async function logoutAction() {
 *   await serverLogout();
 *   redirect("/");
 * }
 */
export async function serverLogout(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    await fetch(getIdentityUrl("/api/auth/sign-out"), {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
    });
  } catch {
    // Best-effort
  }
}

/**
 * Asserts that a session exists or throws.
 * Useful in server components where you want to fail fast.
 */
export async function requireServerSession(): Promise<TogetherSession> {
  const session = await getServerSession();
  if (!session) {
    const config = getConfig();
    // In App Router server components you redirect rather than throw for UX
    const { redirect } = await import("next/navigation");
    redirect(`${config.identityBaseUrl}/login`);
  }
  return session as TogetherSession;
}

// Re-export types so consumers can import everything from the server entry
export type { TogetherSession, TogetherUser, GlobalRole, AppRoles } from "./types/index.js";
export { configure, getConfig } from "./config.js";
