import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import type {
  TogetherSession,
} from "./types/index.ts";
import { normalizeUserInfo } from "./utils/session.ts";
import { getConfig, configure, getIdentityUrl } from "./config.ts";
import type { OIDCUserInfo, TogetherAuthConfig } from "./types/index.ts";

// ─── Cookie name used by the server-side callback handler ─────────────────────
const ACCESS_TOKEN_COOKIE = "__together_access_token__";
const REFRESH_TOKEN_COOKIE = "__together_refresh_token__";
const ID_TOKEN_COOKIE = "__together_id_token__";
const TOKEN_EXPIRY_COOKIE = "__together_token_expiry__";

// ─── Callback route handler ───────────────────────────────────────────────────

/**
 * Place this in your client app at the route matching `redirectUri`.
 *
 * @example
 * // app/auth/callback/route.ts
 * import { createCallbackHandler } from "@together/auth-client/server";
 *
 * export const GET = createCallbackHandler({
 *   identityBaseUrl: process.env.IDENTITY_URL!,
 *   clientId: process.env.TOGETHER_CLIENT_ID!,
 *   redirectUri: process.env.TOGETHER_REDIRECT_URI!,
 *   clientSecret: process.env.TOGETHER_CLIENT_SECRET!,  // omit for public clients
 * });
 */
export function createCallbackHandler(opts: {
  identityBaseUrl: string;
  clientId: string;
  redirectUri: string;
  /** Required for confidential clients, omit for public clients using PKCE */
  clientSecret?: string;
  /** Where to send the user after successful login. @default "/" */
  successRedirect?: string;
  /** Where to send the user on error. @default "/" */
  errorRedirect?: string;
  /** Cookie max-age in seconds. @default 60 * 60 * 24 * 30 (30 days) */
  maxAge?: number;
}) {
  return async function GET(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const error = url.searchParams.get("error");
    const returnTo = url.searchParams.get("return_to") ?? opts.successRedirect ?? "/";

    if (error || !code) {
      console.error("[@together/auth-client] OAuth callback error:", error);
      return Response.redirect(
        new URL(opts.errorRedirect ?? "/", url.origin).toString()
      );
    }

    // Note: state/PKCE verification is handled client-side via the Provider.
    // For pure SSR flows (no React Provider), you'd verify state from a cookie here.

    try {
      const body = new URLSearchParams({
        grant_type: "authorization_code",
        client_id: opts.clientId,
        redirect_uri: opts.redirectUri,
        code,
      });
      if (opts.clientSecret) body.set("client_secret", opts.clientSecret);

      const tokenRes = await fetch(
        `${opts.identityBaseUrl.replace(/\/$/, "")}/api/auth/oauth2/token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body,
        }
      );

      if (!tokenRes.ok) {
        console.error("[@together/auth-client] Token exchange failed:", await tokenRes.text());
        return Response.redirect(new URL(opts.errorRedirect ?? "/", url.origin).toString());
      }

      const tokens = (await tokenRes.json()) as {
        access_token: string;
        expires_in: number;
        refresh_token?: string;
        id_token?: string;
      };

      const maxAge = opts.maxAge ?? 60 * 60 * 24 * 30;
      const expiresAt = Date.now() + tokens.expires_in * 1000;
      const cookieOpts = [
        `Path=/`,
        `HttpOnly`,
        `SameSite=Lax`,
        `Max-Age=${maxAge}`,
        process.env.NODE_ENV === "production" ? "Secure" : "",
      ]
        .filter(Boolean)
        .join("; ");

      const setCookies: string[] = [
        `${ACCESS_TOKEN_COOKIE}=${tokens.access_token}; ${cookieOpts}`,
        `${TOKEN_EXPIRY_COOKIE}=${expiresAt}; ${cookieOpts}`,
      ];
      if (tokens.refresh_token)
        setCookies.push(`${REFRESH_TOKEN_COOKIE}=${tokens.refresh_token}; ${cookieOpts}`);
      if (tokens.id_token)
        setCookies.push(`${ID_TOKEN_COOKIE}=${tokens.id_token}; ${cookieOpts}`);

      return new Response(null, {
        status: 302,
        headers: {
          Location: returnTo.startsWith("http") ? returnTo : new URL(returnTo, url.origin).toString(),
          "Set-Cookie": setCookies.join(", "),
        },
      });
    } catch (err) {
      console.error("[@together/auth-client] Callback handler threw:", err);
      return Response.redirect(new URL(opts.errorRedirect ?? "/", url.origin).toString());
    }
  };
}

// ─── Server session fetch ─────────────────────────────────────────────────────

/**
 * Reads the access token from the httpOnly cookie set by `createCallbackHandler`,
 * then hits /oauth2/userinfo to return a fully-typed `TogetherSession`.
 *
 * Use in App Router server components, layouts, and server actions.
 *
 * @example
 * import { getServerSession } from "@together/auth-client/server";
 * const session = await getServerSession({ identityBaseUrl: "..." });
 */
export async function getServerSession(opts: {
  identityBaseUrl: string;
}): Promise<TogetherSession | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
    const expiryStr = cookieStore.get(TOKEN_EXPIRY_COOKIE)?.value;

    if (!accessToken) return null;

    // Quick expiry check (no network) — leave 30s buffer
    if (expiryStr) {
      const expiresAt = parseInt(expiryStr, 10);
      if (Date.now() >= expiresAt - 30_000) {
        // Token is expired — attempt refresh
        const refreshed = await serverRefresh(opts.identityBaseUrl, cookieStore);
        if (!refreshed) return null;
        return fetchUserInfo(opts.identityBaseUrl, refreshed.accessToken, refreshed.expiresAt);
      }
    }

    return fetchUserInfo(
      opts.identityBaseUrl,
      accessToken,
      expiryStr ? parseInt(expiryStr, 10) : Date.now() + 3600_000
    );
  } catch {
    return null;
  }
}

async function fetchUserInfo(
  identityBaseUrl: string,
  accessToken: string,
  expiresAt: number
): Promise<TogetherSession | null> {
  const res = await fetch(
    `${identityBaseUrl.replace(/\/$/, "")}/api/auth/oauth2/userinfo`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );
  if (!res.ok) return null;
  const info = (await res.json()) as OIDCUserInfo;
  return normalizeUserInfo(info, expiresAt);
}

async function serverRefresh(
  identityBaseUrl: string,
  cookieStore: Awaited<ReturnType<typeof cookies>>
): Promise<{ accessToken: string; expiresAt: number } | null> {
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
  // Note: server-side refresh without clientId requires the cookie to be set.
  // Developers who need this should use createCallbackHandler which stores clientId env.
  if (!refreshToken) return null;

  // We can't easily mutate Set-Cookie in a server component fetch response here.
  // For full server-side refresh support, use a Route Handler middleware pattern.
  // This basic implementation just checks if refresh_token exists.
  return null; // Signal to re-auth
}

// ─── requireServerSession ─────────────────────────────────────────────────────

/**
 * Assert a valid session exists or redirect to login.
 * 
 * @example
 * // app/dashboard/page.tsx
 * const session = await requireServerSession({
 *   identityBaseUrl: process.env.IDENTITY_URL!,
 *   loginUrl: process.env.TOGETHER_LOGIN_URL!,
 * });
 */
export async function requireServerSession(opts: {
  identityBaseUrl: string;
  loginUrl?: string;
}): Promise<TogetherSession> {
  const session = await getServerSession(opts);
  if (!session) {
    const returnUrl = encodeURIComponent(
      (await headers()).get("x-forwarded-url") ?? opts.identityBaseUrl
    );
    const loginUrl = opts.loginUrl ?? `${opts.identityBaseUrl}/login`;
    redirect(`${loginUrl}?redirect=${returnUrl}`);
  }
  return session;
}

// ─── serverLogout ─────────────────────────────────────────────────────────────

/**
 * Server-side logout. Revokes the access token and clears auth cookies.
 * Call from a Route Handler or Server Action, then redirect.
 *
 * @example
 * // app/actions/auth.ts
 * "use server";
 * import { serverLogout } from "@together/auth-client/server";
 * import { redirect } from "next/navigation";
 *
 * export async function logoutAction() {
 *   await serverLogout({ identityBaseUrl: process.env.IDENTITY_URL! });
 *   redirect("/");
 * }
 */
export async function serverLogout(opts: {
  identityBaseUrl: string;
}): Promise<void> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

    if (accessToken) {
      await fetch(
        `${opts.identityBaseUrl.replace(/\/$/, "")}/api/auth/oauth2/revoke`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            token: accessToken,
            token_type_hint: "access_token",
          }),
          cache: "no-store",
        }
      ).catch(() => {});
    }
  } finally {
    // Clear cookies via response headers — caller must use Route Handler for this
    // to work. In a server action, call redirect() after this and set-cookie via
    // the cookies() API.
    const cookieStore = await cookies();
    const clearOpts = {
      maxAge: 0,
      path: "/",
    } as const;
    cookieStore.delete(ACCESS_TOKEN_COOKIE);
    cookieStore.delete(REFRESH_TOKEN_COOKIE);
    cookieStore.delete(ID_TOKEN_COOKIE);
    cookieStore.delete(TOKEN_EXPIRY_COOKIE);
  }
}

// ─── Re-exports ───────────────────────────────────────────────────────────────

export type {
  TogetherSession,
  TogetherUser,
  GlobalRole,
  AppRoles,
} from "./types/index.ts";
export { configure, getConfig } from "./config.ts";
