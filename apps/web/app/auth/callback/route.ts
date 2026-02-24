/**
 * CLIENT APP — app/auth/callback/route.ts
 *
 * Add this file to any Next.js app that uses @together/auth-client.
 * The identity server redirects here after the user logs in.
 * This handler exchanges the code for tokens and sets httpOnly cookies.
 *
 * Environment variables needed in the client app:
 *   IDENTITY_URL              = https://identity.together.com
 *   TOGETHER_CLIENT_ID        = <client_id from createOAuthClient>
 *   TOGETHER_CLIENT_SECRET    = <client_secret from createOAuthClient>  (confidential clients)
 *   TOGETHER_REDIRECT_URI     = https://myapp.together.com/auth/callback
 */
import { createCallbackHandler } from "@together/auth-sdk/server";

export const GET = createCallbackHandler({
  identityBaseUrl: process.env.IDENTITY_URL!,
  clientId: process.env.TOGETHER_CLIENT_ID!,
  clientSecret: process.env.TOGETHER_CLIENT_SECRET,
  redirectUri: process.env.TOGETHER_REDIRECT_URI!,
  successRedirect: "/",
  errorRedirect: "/?error=oauth",
});