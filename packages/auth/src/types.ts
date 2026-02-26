// ─── Domain Types ────────────────────────────────────────────────────────────

export interface AuthUser {
  /** Logto subject / user ID */
  sub: string;
  name?: string;
  username?: string;
  email?: string;
  emailVerified?: boolean;
  phoneNumber?: string;
  picture?: string;
  /** Custom data stored on the Logto user */
  customData?: Record<string, unknown>;
  /** Raw claims from the ID token */
  [key: string]: unknown;
}

export interface AuthOrganization {
  id: string;
  name: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  error: Error | null;
}

// ─── SDK Config ───────────────────────────────────────────────────────────────

export interface AuthSdkConfig {
  /** Your Logto endpoint, e.g. https://your-tenant.logto.app */
  endpoint: string;
  /** App ID from the Logto console */
  appId: string;
  /** App Secret from the Logto console */
  appSecret: string;
  /**
   * Base URL of your Next.js app, e.g. https://app.example.com
   * Defaults to NEXT_PUBLIC_APP_URL or http://localhost:3000
   */
  baseUrl?: string;
  /**
   * Cookie encryption key — must be 32+ chars.
   * Defaults to process.env.LOGTO_COOKIE_SECRET
   */
  cookieSecret?: string;
  /** Logto scopes to request. Defaults include openid, profile, email, roles */
  scopes?: string[];
  /** Logto resources (API identifiers) to request access tokens for */
  resources?: string[];
}

// ─── Gate Props ───────────────────────────────────────────────────────────────

export interface RoleGateProps {
  /** Required role name(s). User must have ALL by default */
  roles: string | string[];
  /** If true, user must only have ONE of the listed roles */
  any?: boolean;
  children: React.ReactNode;
  /** Rendered when the gate blocks. Defaults to null */
  fallback?: React.ReactNode;
}

export interface PermissionGateProps {
  /** Required permission/scope(s). User must have ALL by default */
  permissions: string | string[];
  /** If true, user must only have ONE of the listed permissions */
  any?: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}