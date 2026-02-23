// ─── Role primitives ──────────────────────────────────────────────────────────

/** Global roles assigned across the entire Together ecosystem. */
export type GlobalRole = string;

/**
 * Per-application role map.
 * Keys are app identifiers (e.g. "together-studio").
 * Values are arrays of role strings for that app.
 */
export type AppRoles = Record<string, string[]>;

// ─── User ─────────────────────────────────────────────────────────────────────

/**
 * The normalized user object exposed by the SDK.
 * Shape intentionally unchanged — components depending on this type require
 * no migration.
 */
export interface TogetherUser {
  readonly userId: string;
  readonly email: string;
  readonly emailVerified: boolean;
  readonly name: string | null;
  readonly username: string | null;
  readonly image: string | null;
  readonly roles: readonly GlobalRole[];
  readonly appRoles: Readonly<AppRoles>;
}

// ─── Session ──────────────────────────────────────────────────────────────────

export interface TogetherSession {
  /**
   * In the OAuth flow this is the access token's `jti` (JWT ID) when present,
   * otherwise the user's `sub` claim. Shape identical to v1 for consumers.
   */
  readonly sessionId: string;
  readonly user: TogetherUser;
  /** ISO-8601 — now reflects access token expiry */
  readonly expiresAt: string;
}

// ─── SDK Config ───────────────────────────────────────────────────────────────

export interface TogetherAuthConfig {
  /**
   * Base URL of the Together Identity Provider.
   * @example "https://identity.together.com"
   */
  identityBaseUrl: string;

  /**
   * OAuth 2.1 client_id issued by the identity server.
   * Register one with `auth.api.createOAuthClient(...)`.
   */
  clientId: string;

  /**
   * The full URL the identity server should redirect to after authorization.
   * Must be registered in `redirect_uris` for this client.
   * @example "https://studio.together.com/auth/callback"
   */
  redirectUri: string;

  /**
   * OAuth scopes to request.
   * @default ["openid", "profile", "email", "offline_access"]
   */
  scopes?: string[];

  /**
   * When true, unauthenticated users are automatically redirected to login.
   * @default true
   */
  autoRedirect?: boolean;

  /**
   * The identifier of this app within the Together ecosystem.
   * Used as the key for `appRoles` lookups.
   * @example "together-studio"
   */
  appName?: string;
}

// ─── Context value ────────────────────────────────────────────────────────────

export interface TogetherAuthContextValue {
  session: TogetherSession | null;
  user: TogetherUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refresh: () => Promise<void>;
  config: Required<TogetherAuthConfig>;
}

// ─── OIDC UserInfo response ───────────────────────────────────────────────────
// Shape returned by /api/auth/oauth2/userinfo (standard claims + custom ones
// added via customUserInfoClaims on the identity server).

export interface OIDCUserInfo {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  // Custom claims added by the identity server
  username?: string;
  roles?: GlobalRole[];
  app_roles?: AppRoles;
  // JWT fields present when userinfo is a signed JWT
  jti?: string;
  exp?: number;
}

// ─── Legacy API types (kept for server.ts normalisation) ─────────────────────

export interface IdentitySessionResponse {
  ok: true;
  data: {
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
  };
}

export interface IdentityErrorResponse {
  ok: false;
  error: string;
  code?: string;
}
