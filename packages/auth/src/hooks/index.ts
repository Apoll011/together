"use client";

import { useLogto } from "@logto/next/client";
import { useCallback, useEffect, useState } from "react";
import type { AuthUser } from "../types";

// ─── useAuth ──────────────────────────────────────────────────────────────────

/**
 * Core auth hook. Returns user state + sign in / sign out helpers.
 *
 * @example
 * const { user, isAuthenticated, signIn, signOut } = useAuth();
 */
export function useAuth() {
  const {
    isAuthenticated,
    isLoading,
    error,
    fetchUserInfo,
    signIn,
    signOut,
  } = useLogto();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [userLoading, setUserLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setUser(null);
      return;
    }
    setUserLoading(true);
    fetchUserInfo()
      .then((info) => setUser((info as AuthUser) ?? null))
      .catch(() => setUser(null))
      .finally(() => setUserLoading(false));
  }, [isAuthenticated, fetchUserInfo]);

  const handleSignIn = useCallback(
    (redirectUri = "/") =>
      signIn(`${window.location.origin}/api/auth/sign-in-callback`),
    [signIn]
  );

  const handleSignOut = useCallback(
    () =>
      signOut(`${window.location.origin}/api/auth/sign-out-callback`),
    [signOut]
  );

  return {
    user,
    isAuthenticated: isAuthenticated ?? false,
    isLoading: isLoading || userLoading,
    error: error ?? null,
    signIn: handleSignIn,
    signOut: handleSignOut,
  };
}

// ─── useUser ──────────────────────────────────────────────────────────────────

/** Convenience hook — returns just the user object */
export function useUser(): AuthUser | null {
  const { user } = useAuth();
  return user;
}

// ─── useRoles ────────────────────────────────────────────────────────────────

/**
 * Returns the user's roles from the ID token claims.
 * Requires the `roles` scope.
 */
export function useRoles(): string[] {
  const { fetchUserInfo } = useLogto();
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    fetchUserInfo()
      .then((info) => {
        const r = (info as Record<string, unknown>)?.["roles"];
        setRoles(Array.isArray(r) ? (r as string[]) : []);
      })
      .catch(() => setRoles([]));
  }, [fetchUserInfo]);

  return roles;
}

/** Returns true if the user has ALL of the given roles */
export function useHasAllRoles(roles: string[]): boolean {
  const userRoles = useRoles();
  return roles.every((r) => userRoles.includes(r));
}

/** Returns true if the user has ANY of the given roles */
export function useHasAnyRole(roles: string[]): boolean {
  const userRoles = useRoles();
  return roles.some((r) => userRoles.includes(r));
}

// ─── useScopes ───────────────────────────────────────────────────────────────

/** Returns the scopes/permissions granted to the current user */
export function useScopes(): string[] {
  const { getIdTokenClaims } = useLogto();
  const [scopes, setScopes] = useState<string[]>([]);

  useEffect(() => {
    getIdTokenClaims()
      .then((claims) => {
        const s = (claims as Record<string, unknown>)?.["scope"];
        if (typeof s === "string") setScopes(s.split(" "));
        else setScopes([]);
      })
      .catch(() => setScopes([]));
  }, [getIdTokenClaims]);

  return scopes;
}

export function useHasAllScopes(required: string[]): boolean {
  const scopes = useScopes();
  return required.every((s) => scopes.includes(s));
}

export function useHasAnyScope(required: string[]): boolean {
  const scopes = useScopes();
  return required.some((s) => scopes.includes(s));
}

// ─── useAccessToken ───────────────────────────────────────────────────────────

/** Fetches an access token for the given resource API indicator */
export function useAccessToken(resource?: string) {
  const { getAccessToken } = useLogto();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getAccessToken(resource)
      .then((t) => setToken(t ?? null))
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, [getAccessToken, resource]);

  return { token, loading };
}