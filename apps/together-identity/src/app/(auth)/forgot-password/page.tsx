"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await requestPasswordReset({
        email,
        redirectTo:  `${process.env.NEXT_PUBLIC_IDENTITY_URL ?? ""}/reset-password`,
    });


    if (result.error) {
      setError(result.error.message ?? "Something went wrong");
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="page-center">
        <div className="auth-card card">
          <span className="logo">Together</span>
          <div className="alert alert-success">
            If an account exists for <strong>{email}</strong>, you&apos;ll receive a password reset link within a few minutes.
          </div>
          <p style={{ fontSize: ".875rem", color: "#6b7280" }}>
            The link expires in <strong>15 minutes</strong>. <br />
            <Link href="/forgot-password">Try again</Link> · <Link href="/login">Back to sign in</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-center">
      <div className="auth-card card">
        <span className="logo">Together</span>
        <h1>Forgot password</h1>
        <p className="subtitle">Enter your email and we&apos;ll send a reset link.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
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
          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? "Sending…" : "Send reset link"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: ".875rem", color: "#6b7280" }}>
          <Link href="/login">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
