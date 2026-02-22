import type { TogetherAuthConfig } from "./types/index.ts";

const DEFAULT_CONFIG: Required<TogetherAuthConfig> = {
  identityBaseUrl: "",
  autoRedirect: true,
  appName: "",
};

let _config: Required<TogetherAuthConfig> = { ...DEFAULT_CONFIG };
let _initialized = false;

/**
 * Initialize the SDK configuration.
 * Must be called before any SDK utilities are used — typically in your
 * app's root layout or `instrumentation.ts`.
 */
export function configure(config: TogetherAuthConfig): void {
  if (!config.identityBaseUrl) {
    throw new Error(
      "[@together/auth-client] `identityBaseUrl` is required in configure()"
    );
  }
  _config = {
    ...DEFAULT_CONFIG,
    ...config,
  };
  _initialized = true;
}

export function getConfig(): Required<TogetherAuthConfig> {
  if (!_initialized) {
    // Attempt env fallback for Next.js environments
    const envUrl =
      typeof process !== "undefined"
        ? (process.env["NEXT_PUBLIC_IDENTITY_URL"] ?? "")
        : "";

    if (envUrl) {
      _config = { ...DEFAULT_CONFIG, identityBaseUrl: envUrl };
      _initialized = true;
    } else {
      throw new Error(
        "[@together/auth-client] SDK not configured. Call configure() with identityBaseUrl, " +
          "or set NEXT_PUBLIC_IDENTITY_URL."
      );
    }
  }
  return _config;
}

export function getIdentityUrl(path: string): string {
  const base = getConfig().identityBaseUrl.replace(/\/$/, "");
  return `${base}${path}`;
}
