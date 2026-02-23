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
import { fetchSession, redirectToLogin } from "../utils/session.ts";

// ─── Context ──────────────────────────────────────────────────────────────────

const TogetherAuthContext = createContext<TogetherAuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export interface TogetherAuthProviderProps {
  children: ReactNode;
  config: TogetherAuthConfig;
  /**
   * Optionally pass a pre-fetched session from a server component to avoid
   * a client-side waterfall on first render.
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

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const next = await fetchSession();
    if (isMounted.current) {
      setSession(next);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;

    // If we received an initialSession from SSR, skip the client fetch
    if (initialSession !== null) {
      setIsLoading(false);
      return;
    }

    void refresh();

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

// ─── Context accessor (internal) ──────────────────────────────────────────────

export function useTogetherAuthContext(): TogetherAuthContextValue {
  const ctx = useContext(TogetherAuthContext);
  if (!ctx) {
    throw new Error(
      "[@together/auth-client] useTogetherAuthContext must be called inside <TogetherAuthProvider>."
    );
  }
  return ctx;
}
