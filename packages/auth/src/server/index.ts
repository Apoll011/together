/**
 * Server-only auth utilities.
 * Import from "@repo/auth/server" — never from client components.
 */
import { getAuthClient } from "../config";
import type { AuthUser } from "../types";

// ─── Context helpers ──────────────────────────────────────────────────────────

/** Get the full Logto context (user, isAuthenticated, scopes, etc.) */
export async function getAuthContext() {
  const client = getAuthClient();
  return client.getLogtoContext();
}

/** Get the current user, or null if not authenticated */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const ctx = await getAuthContext();
  if (!ctx.isAuthenticated || !ctx.userInfo) return null;
  return ctx.userInfo as AuthUser;
}

/** Returns true if there is a valid session */
export async function isAuthenticated(): Promise<boolean> {
  const ctx = await getAuthContext();
  return ctx.isAuthenticated;
}

// ─── Role & Permission checks ─────────────────────────────────────────────────

/**
 * Returns the user's roles from the ID token claims.
 * Requires the `roles` scope.
 */
export async function getUserRoles(): Promise<string[]> {
  const ctx = await getAuthContext();
  const claims = ctx.claims as Record<string, unknown> | undefined;
  const roles = claims?.["roles"];
  if (!Array.isArray(roles)) return [];
  return roles as string[];
}

/** Returns true if the user has ALL of the given roles */
export async function hasAllRoles(roles: string[]): Promise<boolean> {
  const userRoles = await getUserRoles();
  return roles.every((r) => userRoles.includes(r));
}

/** Returns true if the user has ANY of the given roles */
export async function hasAnyRole(roles: string[]): Promise<boolean> {
  const userRoles = await getUserRoles();
  return roles.some((r) => userRoles.includes(r));
}

/** Returns true if the user has ALL of the given scopes */
export async function hasAllScopes(scopes: string[]): Promise<boolean> {
  const ctx = await getAuthContext();
  const grantedScopes = ctx.scopes ?? [];
  return scopes.every((s) => grantedScopes.includes(s));
}

/** Returns true if the user has ANY of the given scopes */
export async function hasAnyScope(scopes: string[]): Promise<boolean> {
  const ctx = await getAuthContext();
  const grantedScopes = ctx.scopes ?? [];
  return scopes.some((s) => grantedScopes.includes(s));
}

// ─── Access token ─────────────────────────────────────────────────────────────

/**
 * Get an access token for a given API resource.
 * Pass the API Indicator string from the Logto console.
 */
export async function getAccessToken(resource?: string): Promise<string | null> {
  try {
    const client = getAuthClient();
    return await client.getAccessToken(resource);
  } catch {
    return null;
  }
}

// ─── Guard helpers (for use in Server Actions / route handlers) ───────────────

/**
 * Throws a redirect response to /api/auth/sign-in if the user is not authenticated.
 * Use at the top of Server Actions or page.tsx server components.
 *
 * @example
 * import { requireAuth } from "@repo/auth/server";
 * export default async function DashboardPage() {
 *   const user = await requireAuth();
 *   // user is guaranteed to be non-null here
 * }
 */
export async function requireAuth(): Promise<AuthUser> {
  const { redirect } = await import("next/navigation");
  const user = await getCurrentUser();
  if (!user) redirect("/api/auth/sign-in");
  return user;
}

/** Throws if user doesn't have ALL of the required roles */
export async function requireRoles(roles: string[]): Promise<AuthUser> {
  const { notFound } = await import("next/navigation");
  const user = await requireAuth();
  const ok = await hasAllRoles(roles);
  if (!ok) notFound();
  return user;
}