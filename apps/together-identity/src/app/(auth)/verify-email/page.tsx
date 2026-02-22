"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { verifyEmail, sendVerificationEmail } from "@/lib/auth-client";

export default function VerifyEmailPage() {
  const params = useSearchParams();
  const token = params.get("token");
  const resend = params.get("resend") === "true";
  const emailParam = params.get("email") ?? "";

  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">(
    token ? "verifying" : "idle"
  );
  const [error, setError] = useState("");
  const [resendEmail, setResendEmail] = useState(emailParam);
  const [resendSent, setResendSent] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    verifyEmail({ query: { token } })
      .then((r) => {
        if (r.error) {
          setError(r.error.message ?? "Verification failed");
          setStatus("error");
        } else {
          setStatus("success");
        }
      })
      .catch(() => {
        setError("An unexpected error occurred");
        setStatus("error");
      });
  }, [token]);

  async function handleResend(e: React.FormEvent) {
    e.preventDefault();
    setResendLoading(true);
    const result = await sendVerificationEmail({ email: resendEmail });
    if (result.error) {
      setError(result.error.message ?? "Failed to send");
    } else {
      setResendSent(true);
    }
    setResendLoading(false);
  }

  // ─── Token verification flow ─────────────────────────────────────────────────
  if (token) {
    return (
      <div className="page-center">
        <div className="auth-card card" style={{ textAlign: "center" }}>
          <span className="logo" style={{ display: "block", textAlign: "left" }}>Together</span>
          {status === "verifying" && <p style={{ color: "#6b7280" }}>Verifying your email…</p>}
          {status === "success" && (
            <>
              <div className="alert alert-success">Your email has been verified!</div>
              <Link href="/account" className="btn btn-primary">Go to your account</Link>
            </>
          )}
          {status === "error" && (
            <>
              <div className="alert alert-error">{error}</div>
              <p style={{ fontSize: ".875rem", color: "#6b7280", marginTop: ".75rem" }}>
                The link may have expired. <Link href="/verify-email?resend=true">Request a new one</Link>
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  // ─── Resend flow ─────────────────────────────────────────────────────────────
  return (
    <div className="page-center">
      <div className="auth-card card">
        <span className="logo">Together</span>
        <h1>Verify your email</h1>
        <p className="subtitle">
          {resend
            ? "Enter your email to receive a new verification link."
            : "Check your inbox for a verification link."}
        </p>

        {error && <div className="alert alert-error">{error}</div>}
        {resendSent && (
          <div className="alert alert-success">
            Verification email sent! Check your inbox.
          </div>
        )}

        {!resendSent && (
          <form onSubmit={handleResend}>
            <div className="field">
              <label className="label" htmlFor="email">Email</label>
              <input
                id="email"
                className="input"
                type="email"
                required
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
              />
            </div>
            <button className="btn btn-primary btn-full" disabled={resendLoading}>
              {resendLoading ? "Sending…" : "Resend verification email"}
            </button>
          </form>
        )}

        <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: ".875rem", color: "#6b7280" }}>
          <Link href="/login">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
