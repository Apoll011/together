import { AppKey } from "@repo/together-apps/types";

export type UserMainRole =
  | "guest"
  | "user"
  | "moderator"
  | "admin"
  | "superadmin";

export type AppRole =
  | "member"
  | "editor"
  | "manager"
  | "owner";

export type Feature =
  | "create-post"
  | "edit-post"
  | "delete-post"
  | "manage-users"
  | "access-admin-panel"
  | "analytics";

export type AppRolesMap = Partial<Record<AppKey, AppRole[]>>;

export type AppFeaturesMap = Partial<Record<AppKey, Feature[]>>;

export interface Role {
  main: UserMainRole[];
  apps: AppRolesMap;
  features: AppFeaturesMap;
}

export interface AppUserMetadata {
  role: Role;
  onboardingComplete: boolean;
  togetherInterests: string[];
}