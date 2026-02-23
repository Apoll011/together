import type {
  TogetherSession,
  TogetherUser,
  IdentitySessionResponse,
} from "../types/index.ts";
import { getIdentityUrl } from "../config.ts";

// ─── Response normalizer ──────────────────────────────────────────────────────

export function normalizeSession(
  data: IdentitySessionResponse["data"]
): TogetherSession {
  const user: TogetherUser = {
    userId: data.userId,
    email: data.email,
    emailVerified: data.emailVerified,
    name: data.name,
    username: data.username,
    image: data.image,
    roles: data.roles,
    appRoles: data.appRoles,
  };

  return {
    sessionId: data.sessionId,
    user,
    expiresAt: data.expiresAt,
  };
}

// ─── Client-side fetch (uses browser cookie) ─────────────────────────────────

/**
 * Fetches the current session from the identity server.
 * Uses `credentials: "include"` so the httpOnly session cookie is forwarded.
 * Returns `null` if the user is not authenticated or the request fails.
 */
export async function fetchSession(): Promise<TogetherSession | null> {
  try {
    const res = await fetch(getIdentityUrl("/api/session"), {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      // Don't cache — always get fresh session state
      cache: "no-store",
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

// ─── Logout ───────────────────────────────────────────────────────────────────

/**
 * Signs the user out by calling the identity server's sign-out endpoint.
 * The identity server will clear the httpOnly cookie.
 */
export async function logout(): Promise<void> {
  try {
    await fetch(getIdentityUrl("/api/auth/sign-out"), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    // Best-effort — even if request fails, let the caller handle redirect
  }
}

// ─── Redirect ─────────────────────────────────────────────────────────────────

/**
 * Redirects the browser to the identity server's login page,
 * with a `redirect` parameter pointing back to the current URL.
 */
export function redirectToLogin(identityBaseUrl: string, returnUrl?: string): void {
  if (typeof window === "undefined") return;

  const base = identityBaseUrl.replace(/\/$/, "");
  const redirect = returnUrl ?? window.location.href;
  window.location.href = `${base}/login?redirect=${encodeURIComponent(redirect)}`;
}
