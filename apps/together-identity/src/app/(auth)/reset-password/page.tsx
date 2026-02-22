"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { resetPassword } from "@/lib/auth-client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="page-center">
        <div className="auth-card card">
          <span className="logo">Together</span>
          <div className="alert alert-error">
            Invalid or missing reset token. Please request a new password reset link.
          </div>
          <Link href="/forgot-password" className="btn btn-primary btn-full">
            Request new link
          </Link>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    const result = await resetPassword({ newPassword: password, token });

    if (result.error) {
      const msg = result.error.message ?? "Reset failed";
      setError(
        msg.toLowerCase().includes("expired")
          ? "This reset link has expired. Please request a new one."
          : msg
      );
      setLoading(false);
      return;
    }

    router.push("/login?reset=success");
  }

  return (
    <div className="page-center">
      <div className="auth-card card">
        <span className="logo">Together</span>
        <h1>Set new password</h1>
        <p className="subtitle">Choose a strong password for your account.</p>

        {error && (
          <div className="alert alert-error">
            {error}{" "}
            {error.includes("expired") && (
              <Link href="/forgot-password">Request new link</Link>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label" htmlFor="password">New password</label>
            <input
              id="password"
              className="input"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="help-text">Minimum 8 characters</span>
          </div>
          <div className="field">
            <label className="label" htmlFor="confirm">Confirm new password</label>
            <input
              id="confirm"
              className="input"
              type="password"
              autoComplete="new-password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? "Saving…" : "Set new password"}
          </button>
        </form>
      </div>
    </div>
  );
}
