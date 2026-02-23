import type {
  TogetherSession,
  TogetherUser,
  OIDCUserInfo,
} from "../types/index.ts";
import { getIdentityUrl, getConfig } from "../config.ts";
import {
  getStoredTokens,
  isTokenExpired,
  storeTokens,
  clearTokens,
} from "../token-store.ts";
import { refreshAccessToken } from "../oauth.ts";

// ─── Normalizer ───────────────────────────────────────────────────────────────

export function normalizeUserInfo(
  info: OIDCUserInfo,
  tokenExpiresAt: number
): TogetherSession {
  const user: TogetherUser = {
    userId: info.sub,
    email: info.email ?? "",
    emailVerified: info.email_verified ?? false,
    name: info.name ?? null,
    username: info.username ?? null,
    image: info.picture ?? null,
    roles: info.roles ?? ["user"],
    appRoles: info.app_roles ?? {},
  };

  return {
    // Prefer JWT ID for uniqueness; fall back to sub (user ID)
    sessionId: info.jti ?? info.sub,
    user,
    expiresAt: new Date(tokenExpiresAt).toISOString(),
  };
}

// ─── Token refresh helper ─────────────────────────────────────────────────────

async function tryRefresh(): Promise<string | null> {
  const stored = getStoredTokens();
  if (!stored?.refreshToken) return null;

  try {
    const config = getConfig();
    const tokens = await refreshAccessToken({
      identityBaseUrl: config.identityBaseUrl,
      clientId: config.clientId,
      refreshToken: stored.refreshToken,
    });

    const expiresAt = Date.now() + tokens.expires_in * 1000;
    storeTokens({
      accessToken: tokens.access_token,
      expiresAt,
      refreshToken: tokens.refresh_token ?? stored.refreshToken,
      idToken: tokens.id_token ?? stored.idToken,
    });

    return tokens.access_token;
  } catch {
    clearTokens();
    return null;
  }
}

// ─── fetchSession ─────────────────────────────────────────────────────────────

/**
 * Fetches the current session by calling /oauth2/userinfo with a Bearer token.
 * Auto-refreshes the access token when expired (if a refresh_token is stored).
 * Returns null when unauthenticated.
 */
export async function fetchSession(): Promise<TogetherSession | null> {
  let stored = getStoredTokens();
  if (!stored) return null;

  // Refresh if expired
  if (isTokenExpired(stored)) {
    const newToken = await tryRefresh();
    if (!newToken) return null;
    stored = getStoredTokens()!;
  }

  try {
    const res = await fetch(getIdentityUrl("/api/auth/oauth2/userinfo"), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${stored.accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 401) clearTokens();
      return null;
    }

    const info = (await res.json()) as OIDCUserInfo;
    return normalizeUserInfo(info, stored.expiresAt);
  } catch {
    return null;
  }
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logout(): Promise<void> {
  // Best-effort revocation of the access token
  const stored = getStoredTokens();
  clearTokens();

  if (!stored) return;

  try {
    await fetch(getIdentityUrl("/api/auth/oauth2/revoke"), {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        token: stored.accessToken,
        token_type_hint: "access_token",
      }),
    });
  } catch {
    // Best-effort — caller handles redirect
  }
}

// ─── Login redirect (kept for backward-compat import surface) ────────────────

export function redirectToLogin(
  identityBaseUrl: string,
  returnUrl?: string
): void {
  if (typeof window === "undefined") return;
  const base = identityBaseUrl.replace(/\/$/, "");
  const redirect = returnUrl ?? window.location.href;
  window.location.href = `${base}/login?redirect=${encodeURIComponent(redirect)}`;
}
