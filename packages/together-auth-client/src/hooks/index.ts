"use client";

import { useTogetherAuthContext } from "../context/TogetherAuthProvider.js";
import type {
  TogetherSession,
  TogetherUser,
  GlobalRole,
} from "../types/index.js";

// ─── useSession ───────────────────────────────────────────────────────────────

export interface UseSessionReturn {
  session: TogetherSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refresh: () => Promise<void>;
}

/**
 * Returns the raw session object and loading state.
 */
export function useSession(): UseSessionReturn {
  const { session, isLoading, isAuthenticated, refresh } =
    useTogetherAuthContext();
  return { session, isLoading, isAuthenticated, refresh };
}

// ─── useTogetherAccount ───────────────────────────────────────────────────────

export interface UseTogetherAccountReturn {
  user: TogetherUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refresh: () => Promise<void>;
}

/**
 * Primary hook — returns the current user and auth state.
 */
export function useTogetherAccount(): UseTogetherAccountReturn {
  const { user, isLoading, isAuthenticated, refresh } =
    useTogetherAuthContext();
  return { user, isLoading, isAuthenticated, refresh };
}

// ─── useRoles ─────────────────────────────────────────────────────────────────

export interface UseRolesReturn {
  /** Global roles assigned to the current user */
  roles: readonly GlobalRole[];
  /** Per-app roles map */
  appRoles: Readonly<Record<string, string[]>>;
  /** Returns true if the user has the given global role */
  hasRole: (role: string) => boolean;
  /** Returns true if the user has the given role within the given app */
  hasAppRole: (app: string, role: string) => boolean;
}

/**
 * Returns the current user's roles and role-checking helpers.
 */
export function useRoles(): UseRolesReturn {
  const { user } = useTogetherAuthContext();

  const roles: readonly GlobalRole[] = user?.roles ?? [];
  const appRoles: Readonly<Record<string, string[]>> = user?.appRoles ?? {};

  function hasRole(role: string): boolean {
    return roles.includes(role);
  }

  function hasAppRole(app: string, role: string): boolean {
    return (appRoles[app] ?? []).includes(role);
  }

  return { roles, appRoles, hasRole, hasAppRole };
}

// ─── useHasRole ───────────────────────────────────────────────────────────────

/**
 * Returns true if the current user has the given global role.
 * Returns false while loading.
 *
 * @example
 * const isAdmin = useHasRole("admin");
 */
export function useHasRole(role: string): boolean {
  const { user } = useTogetherAuthContext();
  return user?.roles.includes(role) ?? false;
}

// ─── useHasAppRole ────────────────────────────────────────────────────────────

/**
 * Returns true if the current user has the given role within the given app.
 * Returns false while loading.
 *
 * @example
 * const canEdit = useHasAppRole("together-studio", "editor");
 */
export function useHasAppRole(app: string, role: string): boolean {
  const { user } = useTogetherAuthContext();
  return (user?.appRoles[app] ?? []).includes(role);
}
