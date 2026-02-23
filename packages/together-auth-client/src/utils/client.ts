import { getConfig } from "../config.ts";
import { fetchSession, logout as _logout } from "./session.ts";
import { clearTokens, getStoredTokens } from "../token-store.ts";
import {
  generatePKCE,
  generateState,
  buildAuthorizationUrl,
  buildLogoutUrl,
} from "../oauth.ts";
import { savePKCE, saveState } from "../token-store.ts";
import type { TogetherSession } from "../types/index.ts";

export { fetchSession };

// ─── Login ────────────────────────────────────────────────────────────────────

/**
 * Initiates the OAuth 2.1 + PKCE authorization flow.
 * Saves state and code_verifier to sessionStorage, then redirects the browser.
 *
 * @param returnUrl - Override the post-login destination. Defaults to current URL.
 */
export async function redirectToLogin(returnUrl?: string): Promise<void> {
  if (typeof window === "undefined") return;

  const config = getConfig();
  const { codeVerifier, codeChallenge } = await generatePKCE();
  const state = generateState();

  savePKCE(codeVerifier);
  saveState(state);

  // Append the desired return URL as a custom param if different from redirectUri
  const redirectUri =
    returnUrl && returnUrl !== config.redirectUri
      ? (() => {
          const u = new URL(config.redirectUri);
          u.searchParams.set("return_to", returnUrl);
          return u.toString();
        })()
      : config.redirectUri;

  window.location.href = buildAuthorizationUrl({
    identityBaseUrl: config.identityBaseUrl,
    clientId: config.clientId,
    redirectUri,
    scopes: config.scopes,
    state,
    codeChallenge,
  });
}

// ─── Logout ───────────────────────────────────────────────────────────────────

/**
 * Revokes the current access token, clears local token store, and redirects.
 *
 * @param redirectUrl - Post-logout destination. Defaults to identity base URL.
 */
export async function logout(redirectUrl?: string): Promise<void> {
  const stored = getStoredTokens();
  await _logout(); // revokes access token, clears store

  if (typeof window !== "undefined") {
    const config = getConfig();
    // Use OIDC end-session endpoint if we have an id_token
    if (stored?.idToken) {
      window.location.href = buildLogoutUrl({
        identityBaseUrl: config.identityBaseUrl,
        idToken: stored.idToken,
        postLogoutRedirectUri: redirectUrl ?? config.identityBaseUrl,
      });
    } else {
      window.location.href = redirectUrl ?? config.identityBaseUrl;
    }
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Re-fetches the session outside of React context.
 */
export async function refreshSession(): Promise<TogetherSession | null> {
  return fetchSession();
}

/**
 * Returns the full identity server URL for a given path segment.
 *
 * @example
 * getIdentityPageUrl("/account/security")
 * // → "https://identity.together.com/account/security"
 */
export function getIdentityPageUrl(path: string): string {
  const config = getConfig();
  return `${config.identityBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
