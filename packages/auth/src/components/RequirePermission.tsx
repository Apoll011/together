// packages/auth/src/components/RequirePermission.tsx

import React from "react";
import {
  AppRole,
  Feature,
  AppUserMetadata,
} from "../types";
import { canAccessRoute } from "../permissions";
import { AppKey } from "@repo/together-apps/types";

interface Props {
  user: AppUserMetadata | null;
  app: AppKey;
  role?: AppRole;
  feature?: Feature;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function RequirePermission({
  user,
  app,
  role,
  feature,
  fallback = null,
  children,
}: Props) {
  const allowed = canAccessRoute({
    user,
    app,
    requiredRole: role,
    requiredFeature: feature,
  });

  if (!allowed) return <>{fallback}</>;

  return <>{children}</>;
}