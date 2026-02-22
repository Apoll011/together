export type GlobalRole = "user" | "admin" | "superadmin";

export type AppRoles = Record<string, string[]>;

export interface TogetherUser {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string | null;
  username: string | null;
  displayUsername: string | null;
  image: string | null;
  roles: GlobalRole[];
  appRoles: AppRoles;
  twoFactorEnabled: boolean;
  usernameChangedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TogetherSessionPayload {
  sessionId: string;
  userId: string;
  email: string;
  emailVerified: boolean;
  name: string | null;
  username: string | null;
  image: string | null;
  roles: GlobalRole[];
  appRoles: AppRoles;
  expiresAt: string;
}

export interface ApiSuccess<T = unknown> {
  ok: true;
  data: T;
}

export interface ApiError {
  ok: false;
  error: string;
  code?: string;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;
