// packages/auth/src/guards.ts

import { AppRole, Feature, AppUserMetadata } from "./types";
import { canAccessRoute } from "./permissions";
import { AppKey } from "@repo/together-apps/types";

export function guardRoute({
  user,
  app,
  requiredRole,
  requiredFeature,
}: {
  user: AppUserMetadata | null;
  app: AppKey;
  requiredRole?: AppRole;
  requiredFeature?: Feature;
}) {
  const allowed = canAccessRoute({
    user,
    app,
    requiredRole,
    requiredFeature,
  });

  if (!allowed) {
    return {
      allowed: false,
      redirect: user ? "/unauthorized" : "/sign-in",
    };
  }

  return { allowed: true };
}