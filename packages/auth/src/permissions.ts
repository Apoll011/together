// packages/auth/src/permissions.ts

import { AppKey } from "@repo/together-apps/types";
import {
  AppRole,
  Feature,
  AppUserMetadata,
  UserMainRole,
} from "./types";

export function hasMainRole(
  user: AppUserMetadata | null,
  role: UserMainRole
) {
  if (!user) return role === "guest";
  return user.role.main.includes(role);
}

export function hasAppRole(
  user: AppUserMetadata | null,
  app: AppKey,
  role: AppRole
) {
  if (!user) return false;
  return user.role.apps[app]?.includes(role) ?? false;
}

export function hasFeature(
  user: AppUserMetadata | null,
  app: AppKey,
  feature: Feature
) {
  if (!user) return false;
  return user.role.features[app]?.includes(feature) ?? false;
}

export function canAccessRoute(options: {
  user: AppUserMetadata | null;
  app: AppKey;
  requiredRole?: AppRole;
  requiredFeature?: Feature;
}) {
  const { user, app, requiredRole, requiredFeature } = options;

  if (!requiredRole && !requiredFeature) {
    return true;
  }

  if (!user) return false;

  if (requiredRole && !hasAppRole(user, app, requiredRole)) {
    return false;
  }

  if (requiredFeature && !hasFeature(user, app, requiredFeature)) {
    return false;
  }

  return true;
}