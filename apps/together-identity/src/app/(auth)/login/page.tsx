"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("redirect") ?? "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [needsTOTP, setNeedsTOTP] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn.email({
      email,
      password,
      ...(needsTOTP ? { twoFactorCode: totpCode } : {}),
    });

    if (result.error) {
      if (result.error.code === "TWO_FACTOR_REQUIRED") {
        setNeedsTOTP(true);
        setLoading(false);
        return;
      }
      setError(result.error.message ?? "Login failed");
      setLoading(false);
      return;
    }

    router.push(callbackUrl);
  }

  async function handleGoogle() {
    await signIn.social({ provider: "google", callbackURL: callbackUrl });
  }

  async function handleGitHub() {
    await signIn.social({ provider: "github", callbackURL: callbackUrl });
  }

  return (
    <div className="page-center">
      <div className="auth-card card">
        <span className="logo">Together</span>
        <h1>Sign in</h1>
        <p className="subtitle">Welcome back. Sign in to your account.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <button className="btn btn-secondary btn-full" onClick={handleGoogle} type="button" style={{ marginBottom: ".75rem" }}>
          <GoogleIcon /> Continue with Google
        </button>
        <button className="btn btn-secondary btn-full" onClick={handleGitHub} type="button">
          <GitHubIcon /> Continue with GitHub
        </button>

        <div className="divider">or</div>

        <form onSubmit={handleSubmit}>
          {!needsTOTP ? (
            <>
              <div className="field">
                <label className="label" htmlFor="email">Email</label>
                <input
                  id="email"
                  className="input"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="field">
                <label className="label" htmlFor="password">
                  Password
                  <Link href="/forgot-password" style={{ float: "right", fontWeight: 400 }}>
                    Forgot password?
                  </Link>
                </label>
                <input
                  id="password"
                  className="input"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </>
          ) : (
            <div className="field">
              <div className="alert alert-info" style={{ marginBottom: "1rem" }}>
                Two-factor authentication is enabled. Enter the 6-digit code from your authenticator app.
              </div>
              <label className="label" htmlFor="totp">Authenticator code</label>
              <input
                id="totp"
                className="input"
                type="text"
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                autoComplete="one-time-code"
                required
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value)}
              />
            </div>
          )}

          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? "Signing in…" : needsTOTP ? "Verify" : "Sign in"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: ".875rem", color: "#6b7280" }}>
          Don&apos;t have an account?{" "}
          <Link href="/register ">Create one</Link>
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.5-1.45-.79-3-.79-4.59s.29-3.14.79-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
}
