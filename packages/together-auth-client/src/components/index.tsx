"use client";

import { useEffect, type ReactNode } from "react";
import { useTogetherAuthContext } from "../context/TogetherAuthProvider.tsx";
import { redirectToLogin } from "../utils/session.ts";

// ─── Shared helpers ───────────────────────────────────────────────────────────

function useRedirectIfUnauthenticated(autoRedirect: boolean): {
  ready: boolean;
  authenticated: boolean;
} {
  const { isLoading, isAuthenticated, config } = useTogetherAuthContext();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && autoRedirect) {
      redirectToLogin(config.identityBaseUrl);
    }
  }, [isLoading, isAuthenticated, autoRedirect, config.identityBaseUrl]);

  return { ready: !isLoading, authenticated: isAuthenticated };
}

// ─── <SignedIn> ───────────────────────────────────────────────────────────────

export interface SignedInProps {
  children: ReactNode;
  /** Rendered while session is loading (optional) */
  fallback?: ReactNode;
}

/**
 * Renders children only when the user is authenticated.
 * Does NOT redirect — use <RequireAuth> for that.
 */
export function SignedIn({ children, fallback = null }: SignedInProps) {
  const { isLoading, isAuthenticated } = useTogetherAuthContext();

  if (isLoading) return <>{fallback}</>;
  if (!isAuthenticated) return null;
  return <>{children}</>;
}

// ─── <SignedOut> ──────────────────────────────────────────────────────────────

export interface SignedOutProps {
  children: ReactNode;
  /** Rendered while session is loading (optional) */
  fallback?: ReactNode;
}

/**
 * Renders children only when the user is NOT authenticated.
 */
export function SignedOut({ children, fallback = null }: SignedOutProps) {
  const { isLoading, isAuthenticated } = useTogetherAuthContext();

  if (isLoading) return <>{fallback}</>;
  if (isAuthenticated) return null;
  return <>{children}</>;
}

// ─── <RequireAuth> ────────────────────────────────────────────────────────────

export interface RequireAuthProps {
  children: ReactNode;
  /** Rendered while session is resolving */
  loading?: ReactNode;
  /**
   * Override the auto-redirect behaviour for this specific gate.
   * Falls back to the provider-level `autoRedirect` config.
   */
  redirect?: boolean;
}

/**
 * Renders children only when authenticated.
 * Redirects to the identity server's login page if unauthenticated
 * (respecting the provider's `autoRedirect` config, or the `redirect` prop).
 */
export function RequireAuth({
  children,
  loading = null,
  redirect,
}: RequireAuthProps) {
  const { config } = useTogetherAuthContext();
  const shouldRedirect = redirect ?? config.autoRedirect;
  const { ready, authenticated } = useRedirectIfUnauthenticated(shouldRedirect);

  if (!ready) return <>{loading}</>;
  if (!authenticated) return null;
  return <>{children}</>;
}

// ─── <RequireRole> ────────────────────────────────────────────────────────────

export interface RequireRoleProps {
  role: string;
  children: ReactNode;
  /** Rendered while session is resolving */
  loading?: ReactNode;
  /** Rendered when authenticated but missing the role */
  unauthorized?: ReactNode;
}

/**
 * Renders children only when the authenticated user has the given global role.
 * Redirects to login if unauthenticated.
 */
export function RequireRole({
  role,
  children,
  loading = null,
  unauthorized = null,
}: RequireRoleProps) {
  const { isLoading, isAuthenticated, user, config } =
    useTogetherAuthContext();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && config.autoRedirect) {
      redirectToLogin(config.identityBaseUrl);
    }
  }, [isLoading, isAuthenticated, config]);

  if (isLoading) return <>{loading}</>;
  if (!isAuthenticated) return null;

  const hasRole = user?.roles.includes(role) ?? false;
  if (!hasRole) return <>{unauthorized}</>;

  return <>{children}</>;
}

// ─── <RequireAppRole> ─────────────────────────────────────────────────────────

export interface RequireAppRoleProps {
  /** App identifier (key in appRoles) */
  app: string;
  role: string;
  children: ReactNode;
  loading?: ReactNode;
  unauthorized?: ReactNode;
}

/**
 * Renders children only when the authenticated user has the given role
 * within the specified app's appRoles.
 * Redirects to login if unauthenticated.
 */
export function RequireAppRole({
  app,
  role,
  children,
  loading = null,
  unauthorized = null,
}: RequireAppRoleProps) {
  const { isLoading, isAuthenticated, user, config } =
    useTogetherAuthContext();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && config.autoRedirect) {
      redirectToLogin(config.identityBaseUrl);
    }
  }, [isLoading, isAuthenticated, config]);

  if (isLoading) return <>{loading}</>;
  if (!isAuthenticated) return null;

  const hasRole = (user?.appRoles[app] ?? []).includes(role);
  if (!hasRole) return <>{unauthorized}</>;

  return <>{children}</>;
}
