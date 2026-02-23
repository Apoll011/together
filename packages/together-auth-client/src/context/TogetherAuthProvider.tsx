"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  TogetherAuthConfig,
  TogetherAuthContextValue,
  TogetherSession,
} from "../types/index.js";
import { configure, getConfig } from "../config.ts";
import { fetchSession } from "../utils/session.ts";
import {
  generatePKCE,
  generateState,
  buildAuthorizationUrl,
  exchangeCodeForTokens,
} from "../oauth.ts";
import {
  savePKCE,
  loadPKCE,
  clearPKCE,
  saveState,
  loadState,
  clearState,
  storeTokens,
  getStoredTokens,
} from "../token-store.ts";

// ─── Context ──────────────────────────────────────────────────────────────────

const TogetherAuthContext = createContext<TogetherAuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export interface TogetherAuthProviderProps {
  children: ReactNode;
  config: TogetherAuthConfig;
  /**
   * Optionally pass a pre-fetched session from a server component to skip
   * the client-side fetch on first render.
   */
  initialSession?: TogetherSession | null;
}

export function TogetherAuthProvider({
  children,
  config,
  initialSession = null,
}: TogetherAuthProviderProps) {
  configure(config);
  const resolvedConfig = getConfig();

  const [session, setSession] = useState<TogetherSession | null>(initialSession);
  const [isLoading, setIsLoading] = useState(initialSession === null);
  const isMounted = useRef(false);

  // ── Manual refresh ──────────────────────────────────────────────────────────

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const next = await fetchSession();
    if (isMounted.current) {
      setSession(next);
      setIsLoading(false);
    }
  }, []);

  // ── OAuth callback handler ──────────────────────────────────────────────────

  const handleOAuthCallback = useCallback(
    async (code: string, returnedState: string): Promise<boolean> => {
      const savedState = loadState();
      const codeVerifier = loadPKCE();
      clearState();
      clearPKCE();

      if (!savedState || returnedState !== savedState || !codeVerifier) {
        console.error(
          "[@together/auth-client] OAuth state mismatch or missing PKCE verifier."
        );
        return false;
      }

      try {
        const tokens = await exchangeCodeForTokens({
          identityBaseUrl: resolvedConfig.identityBaseUrl,
          clientId: resolvedConfig.clientId,
          redirectUri: resolvedConfig.redirectUri,
          code,
          codeVerifier,
        });

        storeTokens({
          accessToken: tokens.access_token,
          expiresAt: Date.now() + tokens.expires_in * 1000,
          refreshToken: tokens.refresh_token,
          idToken: tokens.id_token,
        });

        // Strip OAuth params from URL without triggering a navigation
        const clean = new URL(window.location.href);
        clean.searchParams.delete("code");
        clean.searchParams.delete("state");
        clean.searchParams.delete("iss");
        window.history.replaceState({}, "", clean.toString());

        return true;
      } catch (err) {
        console.error("[@together/auth-client] Token exchange failed:", err);
        return false;
      }
    },
    [resolvedConfig]
  );

  // ── OAuth redirect initiation ───────────────────────────────────────────────

  const redirectToLogin = useCallback(async () => {
    const { codeVerifier, codeChallenge } = await generatePKCE();
    const state = generateState();
    savePKCE(codeVerifier);
    saveState(state);

    const url = buildAuthorizationUrl({
      identityBaseUrl: resolvedConfig.identityBaseUrl,
      clientId: resolvedConfig.clientId,
      redirectUri: resolvedConfig.redirectUri,
      scopes: resolvedConfig.scopes,
      state,
      codeChallenge,
    });

    window.location.href = url;
  }, [resolvedConfig]);

  // ── Boot sequence ───────────────────────────────────────────────────────────

  useEffect(() => {
    isMounted.current = true;

    async function boot() {
      setIsLoading(true);

      // 1. If SSR gave us a session, use it immediately
      if (initialSession !== null) {
        setIsLoading(false);
        return;
      }

      // 2. Check for OAuth callback params in the URL
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const state = params.get("state");

      if (code && state) {
        const ok = await handleOAuthCallback(code, state);
        if (!ok) {
          setIsLoading(false);
          return;
        }
      }

      // 3. Try to load session from stored tokens
      if (getStoredTokens()) {
        const next = await fetchSession();
        if (isMounted.current) {
          setSession(next);
          if (!next && resolvedConfig.autoRedirect) {
            await redirectToLogin();
            return;
          }
          setIsLoading(false);
          return;
        }
      }

      // 4. No tokens at all — redirect to login if autoRedirect
      if (resolvedConfig.autoRedirect) {
        await redirectToLogin();
        // Don't clear isLoading — page is navigating away
        return;
      }

      if (isMounted.current) setIsLoading(false);
    }

    void boot();

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Context value ──────────────────────────────────────────────────────────
  // Shape is 100% identical to v1 — all consumers compile without changes.

  const value: TogetherAuthContextValue = {
    session,
    user: session?.user ?? null,
    isLoading,
    isAuthenticated: session !== null,
    refresh,
    config: resolvedConfig,
  };

  return (
    <TogetherAuthContext.Provider value={value}>
      {children}
    </TogetherAuthContext.Provider>
  );
}

// ─── Context accessor ─────────────────────────────────────────────────────────

export function useTogetherAuthContext(): TogetherAuthContextValue {
  const ctx = useContext(TogetherAuthContext);
  if (!ctx) {
    throw new Error(
      "[@together/auth-client] useTogetherAuthContext must be called inside <TogetherAuthProvider>."
    );
  }
  return ctx;
}
