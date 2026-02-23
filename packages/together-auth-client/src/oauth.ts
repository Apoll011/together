// ─── PKCE helpers ─────────────────────────────────────────────────────────────

function base64UrlEncode(arr: Uint8Array): string {
  return btoa(String.fromCharCode(...arr))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

export interface PKCEPair {
  codeVerifier: string;
  codeChallenge: string;
}

export async function generatePKCE(): Promise<PKCEPair> {
  const raw = new Uint8Array(32);
  crypto.getRandomValues(raw);
  const codeVerifier = base64UrlEncode(raw);

  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(codeVerifier)
  );
  const codeChallenge = base64UrlEncode(new Uint8Array(digest));

  return { codeVerifier, codeChallenge };
}

export function generateState(): string {
  const raw = new Uint8Array(16);
  crypto.getRandomValues(raw);
  return base64UrlEncode(raw);
}

// ─── Authorization URL ────────────────────────────────────────────────────────

export interface BuildAuthUrlOptions {
  identityBaseUrl: string;
  clientId: string;
  redirectUri: string;
  scopes: string[];
  state: string;
  codeChallenge: string;
}

export function buildAuthorizationUrl(opts: BuildAuthUrlOptions): string {
  const url = new URL(
    `${opts.identityBaseUrl.replace(/\/$/, "")}/api/auth/oauth2/authorize`
  );
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", opts.clientId);
  url.searchParams.set("redirect_uri", opts.redirectUri);
  url.searchParams.set("scope", opts.scopes.join(" "));
  url.searchParams.set("state", opts.state);
  url.searchParams.set("code_challenge", opts.codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");
  return url.toString();
}

// ─── Token response ───────────────────────────────────────────────────────────

export interface TokenResponse {
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
  refresh_token?: string;
  id_token?: string;
  scope: string;
}

// ─── Code exchange ────────────────────────────────────────────────────────────

export async function exchangeCodeForTokens(opts: {
  identityBaseUrl: string;
  clientId: string;
  redirectUri: string;
  code: string;
  codeVerifier: string;
}): Promise<TokenResponse> {
  const res = await fetch(
    `${opts.identityBaseUrl.replace(/\/$/, "")}/api/auth/oauth2/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: opts.clientId,
        redirect_uri: opts.redirectUri,
        code: opts.code,
        code_verifier: opts.codeVerifier,
      }),
    }
  );

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Token exchange failed (${res.status}): ${body}`);
  }

  return res.json() as Promise<TokenResponse>;
}

// ─── Refresh token ────────────────────────────────────────────────────────────

export async function refreshAccessToken(opts: {
  identityBaseUrl: string;
  clientId: string;
  refreshToken: string;
}): Promise<TokenResponse> {
  const res = await fetch(
    `${opts.identityBaseUrl.replace(/\/$/, "")}/api/auth/oauth2/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: opts.clientId,
        refresh_token: opts.refreshToken,
      }),
    }
  );

  if (!res.ok) throw new Error(`Token refresh failed (${res.status})`);
  return res.json() as Promise<TokenResponse>;
}

// ─── Logout (end-session) ─────────────────────────────────────────────────────

export function buildLogoutUrl(opts: {
  identityBaseUrl: string;
  idToken?: string;
  postLogoutRedirectUri?: string;
}): string {
  const url = new URL(
    `${opts.identityBaseUrl.replace(/\/$/, "")}/api/auth/oauth2/end-session`
  );
  if (opts.idToken) url.searchParams.set("id_token_hint", opts.idToken);
  if (opts.postLogoutRedirectUri)
    url.searchParams.set(
      "post_logout_redirect_uri",
      opts.postLogoutRedirectUri
    );
  return url.toString();
}
