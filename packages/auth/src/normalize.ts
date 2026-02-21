// packages/auth/src/normalize.ts

import { AppUserMetadata } from "./types";

export function normalizeMetadata(
  raw: any
): AppUserMetadata {
  return {
    role: raw?.role ?? { main: ["user"], apps: {} },
    onboardingComplete: Boolean(raw?.onboardingComplete),
    togetherInterests: Array.isArray(raw?.togetherInterests)
      ? raw.togetherInterests
      : []
  };
}