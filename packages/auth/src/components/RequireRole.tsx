// packages/auth/src/components/RequireRole.tsx

import React from "react";
import { AppRole, AppUserMetadata } from "../types";
import { hasAppRole } from "../permissions";
import { AppKey } from "@repo/together-apps/types";

interface Props {
  user: AppUserMetadata | null;
  app: AppKey;
  role: AppRole;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function RequireRole({
  user,
  app,
  role,
  fallback = null,
  children,
}: Props) {
  if (!hasAppRole(user, app, role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}