"use client";

import { useTogetherAuthContext } from "../context/TogetherAuthProvider.tsx";
import type {
  TogetherSession,
  TogetherUser,
  GlobalRole,
} from "../types/index.ts";

// ─── useSession ───────────────────────────────────────────────────────────────

export interface UseSessionReturn {
  session: TogetherSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refresh: () => Promise<void>;
}

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

export function useTogetherAccount(): UseTogetherAccountReturn {
  const { user, isLoading, isAuthenticated, refresh } =
    useTogetherAuthContext();
  return { user, isLoading, isAuthenticated, refresh };
}

// ─── useRoles ─────────────────────────────────────────────────────────────────

export interface UseRolesReturn {
  roles: readonly GlobalRole[];
  appRoles: Readonly<Record<string, string[]>>;
  hasRole: (role: string) => boolean;
  hasAppRole: (app: string, role: string) => boolean;
}

export function useRoles(): UseRolesReturn {
  const { user } = useTogetherAuthContext();

  const roles: readonly GlobalRole[] = user?.roles ?? [];
  const appRoles: Readonly<Record<string, string[]>> = user?.appRoles ?? {};

  return {
    roles,
    appRoles,
    hasRole: (role) => roles.includes(role),
    hasAppRole: (app, role) => (appRoles[app] ?? []).includes(role),
  };
}

// ─── useHasRole ───────────────────────────────────────────────────────────────

export function useHasRole(role: string): boolean {
  const { user } = useTogetherAuthContext();
  return user?.roles.includes(role) ?? false;
}

// ─── useHasAppRole ────────────────────────────────────────────────────────────

export function useHasAppRole(app: string, role: string): boolean {
  const { user } = useTogetherAuthContext();
  return (user?.appRoles[app] ?? []).includes(role);
}
