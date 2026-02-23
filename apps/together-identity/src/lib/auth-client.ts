"use client";
import { createAuthClient } from "better-auth/react";
import { twoFactorClient, usernameClient } from "better-auth/client/plugins";
import { oauthProviderClient } from "@better-auth/oauth-provider/client";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_IDENTITY_URL ?? "http://localhost:3001",
  plugins: [twoFactorClient(), usernameClient(), oauthProviderClient()],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
  linkSocial,
  unlinkAccount,
  changePassword,
  requestPasswordReset,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  twoFactor,
} = authClient;
