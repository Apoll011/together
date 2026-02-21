// packages/auth/src/components/RequireFeature.tsx

import React from "react";
import { Feature, AppUserMetadata } from "../types";
import { hasFeature } from "../permissions";
import { AppKey } from "@repo/together-apps/types";

interface Props {
  user: AppUserMetadata | null;
  app: AppKey;
  feature: Feature;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function RequireFeature({
  user,
  app,
  feature,
  fallback = null,
  children,
}: Props) {
  if (!hasFeature(user, app, feature)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}