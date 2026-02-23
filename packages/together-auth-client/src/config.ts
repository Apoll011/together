import type { TogetherAuthConfig } from "./types/index.ts";

const DEFAULT_SCOPES = ["openid", "profile", "email", "offline_access"];

type ResolvedConfig = Required<TogetherAuthConfig>;

let _config: ResolvedConfig | null = null;

export function configure(config: TogetherAuthConfig): void {
  _config = {
    identityBaseUrl: config.identityBaseUrl.replace(/\/$/, ""),
    clientId: config.clientId,
    redirectUri: config.redirectUri,
    scopes: config.scopes ?? DEFAULT_SCOPES,
    autoRedirect: config.autoRedirect ?? true,
    appName: config.appName ?? "",
  };
}

export function getConfig(): ResolvedConfig {
  if (!_config) {
    throw new Error(
      "[@together/auth-client] SDK not configured. " +
        "Wrap your app with <TogetherAuthProvider config={...}>."
    );
  }
  return _config;
}

export function getIdentityUrl(path: string): string {
  const base = getConfig().identityBaseUrl;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
