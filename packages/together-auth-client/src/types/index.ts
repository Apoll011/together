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
 * Maps directly to the TogetherSessionPayload from the identity server.
 * Do not add fields that are not present in that payload.
 */
export interface TogetherUser {
  /** Stable unique identifier */
  readonly userId: string;
  readonly email: string;
  readonly emailVerified: boolean;
  readonly name: string | null;
  readonly username: string | null;
  readonly image: string | null;
  /** Global roles (e.g. "user", "admin") */
  readonly roles: readonly GlobalRole[];
  /** Per-app roles keyed by app identifier */
  readonly appRoles: Readonly<AppRoles>;
}

// ─── Session ──────────────────────────────────────────────────────────────────

export interface TogetherSession {
  readonly sessionId: string;
  readonly user: TogetherUser;
  /** ISO-8601 expiry timestamp */
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
   * When true, unauthenticated users are automatically redirected to the
   * identity server's login page (with `?redirect=<current_url>`).
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
  /** Manually trigger a session re-fetch */
  refresh: () => Promise<void>;
  config: Required<TogetherAuthConfig>;
}

// ─── API response shape (mirrors identity server) ────────────────────────────

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

export type IdentityApiResponse<T = IdentitySessionResponse> =
  | T
  | IdentityErrorResponse;
