import LogtoClient from "@logto/next";
import type { AuthSdkConfig } from "./types";

// Default scopes Logto needs for the features in this SDK
const DEFAULT_SCOPES = [
  "openid",
  "profile",
  "email",
  "phone",
  "custom_data",
  "roles",
  "urn:logto:scope:organizations",
];

let _client: LogtoClient | null = null;

/**
 * Call this once at app startup (e.g. in lib/auth.ts) to configure the SDK.
 *
 * @example
 * // lib/auth.ts
 * import { createAuthClient } from "@repo/auth/config";
 * export const { logtoClient, authConfig } = createAuthClient({
 *   endpoint: process.env.LOGTO_ENDPOINT!,
 *   appId: process.env.LOGTO_APP_ID!,
 *   appSecret: process.env.LOGTO_APP_SECRET!,
 * });
 */
export function createAuthClient(config: AuthSdkConfig) {
  const baseUrl =
    config.baseUrl ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000";

  const cookieSecret =
    config.cookieSecret ??
    process.env.LOGTO_COOKIE_SECRET ??
    "CHANGE_ME_32_CHAR_COOKIE_SECRET!";

  const scopes = Array.from(
    new Set([...DEFAULT_SCOPES, ...(config.scopes ?? [])])
  );

  const logtoClient = new LogtoClient({
    endpoint: config.endpoint,
    appId: config.appId,
    appSecret: config.appSecret,
    baseUrl,
    cookieSecret,
    cookieSecure: process.env.NODE_ENV === "production",
    scopes,
    resources: config.resources,
  });

  _client = logtoClient;

  return { logtoClient, authConfig: { ...config, baseUrl, scopes } };
}

/** Returns the already-configured Logto client. Throws if not yet initialised. */
export function getAuthClient(): LogtoClient {
  if (!_client) {
    throw new Error(
      "[auth-sdk] No Logto client configured. Call createAuthClient() in lib/auth.ts first."
    );
  }
  return _client;
}