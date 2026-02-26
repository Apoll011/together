"use client";

import { Spin } from "antd";
import type { ReactNode } from "react";
import { useAuth } from "../hooks";

// ─── Shared loading wrapper ───────────────────────────────────────────────────

function AuthGateLoading({ loading, children }: { loading: boolean; children: ReactNode }) {
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 16 }}>
        <Spin size="small" />
      </div>
    );
  }
  return <>{children}</>;
}

// ─── <Authenticated> ─────────────────────────────────────────────────────────

export interface AuthenticatedProps {
  children: ReactNode;
  /** Rendered when the user is NOT authenticated. Defaults to null. */
  fallback?: ReactNode;
  /** If true, shows a loading spinner while auth state is being resolved */
  showLoadingSpinner?: boolean;
}

/**
 * Renders children only when the user IS authenticated.
 *
 * @example
 * <Authenticated>
 *   <DashboardLink />
 * </Authenticated>
 *
 * <Authenticated fallback={<SignInButton />}>
 *   <UserMenu />
 * </Authenticated>
 */
export function Authenticated({ children, fallback = null, showLoadingSpinner = false }: AuthenticatedProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (showLoadingSpinner && isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 16 }}>
        <Spin size="small" />
      </div>
    );
  }

  return <>{isAuthenticated ? children : fallback}</>;
}

// ─── <Unauthenticated> ───────────────────────────────────────────────────────

export interface UnauthenticatedProps {
  children: ReactNode;
  /** Rendered when the user IS authenticated. Defaults to null. */
  fallback?: ReactNode;
  showLoadingSpinner?: boolean;
}

/**
 * Renders children only when the user is NOT authenticated.
 *
 * @example
 * <Unauthenticated>
 *   <SignInButton type="primary" />
 * </Unauthenticated>
 */
export function Unauthenticated({ children, fallback = null, showLoadingSpinner = false }: UnauthenticatedProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (showLoadingSpinner && isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 16 }}>
        <Spin size="small" />
      </div>
    );
  }

  return <>{!isAuthenticated ? children : fallback}</>;
}
