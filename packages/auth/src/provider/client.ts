"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import type { UserResource } from "@clerk/types";
import { normalizeMetadata } from "../normalize";
import type { AppUserMetadata } from "../types";

export interface UseAppUserResult {
  user: UserResource | null;
  metadata?: AppUserMetadata;
  isLoaded: boolean;
}

export function useAppUser(): UseAppUserResult {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return { user: null, isLoaded: false };
  }

  if (!user) {
    return { user: null, isLoaded: true };
  }

  return {
    user,
    metadata: normalizeMetadata(user.publicMetadata),
    isLoaded: true,
  };
}

export function isSignIn(): boolean {
    const { isSignedIn } = useAuth();

    return isSignedIn ?? false;
}