import { getConfig, getIdentityUrl } from "../config.js";
import { fetchSession, redirectToLogin as _redirectToLogin, logout as _logout } from "./session.js";
import type { TogetherSession } from "../types/index.js";

export { fetchSession };

/**
 * Redirects the current browser window to the identity server's login page.
 * Includes `?redirect=<currentUrl>` so the identity server can send the user back.
 *
 * @param returnUrl - Override the return URL. Defaults to `window.location.href`.
 */
export function redirectToLogin(returnUrl?: string): void {
  const config = getConfig();
  _redirectToLogin(config.identityBaseUrl, returnUrl);
}

/**
 * Signs the current user out by calling the identity server's sign-out endpoint.
 * After this resolves the session cookie will be cleared by the server.
 *
 * @param redirectUrl - Where to send the user after logout. Defaults to the
 *   identity server's base URL.
 */
export async function logout(redirectUrl?: string): Promise<void> {
  await _logout();
  if (typeof window !== "undefined") {
    const config = getConfig();
    window.location.href = redirectUrl ?? config.identityBaseUrl;
  }
}

/**
 * Re-fetches the session from the identity server.
 * Useful for post-action refreshes outside of React context.
 */
export async function refreshSession(): Promise<TogetherSession | null> {
  return fetchSession();
}

/**
 * Returns the full identity server URL for a given path segment.
 * Useful for building links to identity server pages (e.g. account settings).
 *
 * @example
 * getIdentityPageUrl("/account/security")
 * // → "https://identity.together.com/account/security"
 */
export function getIdentityPageUrl(path: string): string {
  return getIdentityUrl(path);
}
