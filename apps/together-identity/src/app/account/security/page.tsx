"use client";

import { useState } from "react";
import { useSession, twoFactor, changePassword } from "@/lib/auth-client";

type TotpSetupData = { totpURI: string; backupCodes: string[] };

export default function SecurityPage() {
  const { data: session, isPending } = useSession();

  const [totpSetup, setTotpSetup] = useState<TotpSetupData | null>(null);
  const [totpCode, setTotpCode] = useState("");
  const [totpPassword, setTotpPassword] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [twoFAStatus, setTwoFAStatus] = useState<"idle" | "loading" | "verifying" | "error">("idle");
  const [twoFAError, setTwoFAError] = useState("");

  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwStatus, setPwStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [pwError, setPwError] = useState("");

  if (isPending) return <p style={{ color: "#6b7280" }}>Loading…</p>;
  if (!session) return null;

  const user = session.user;
  const is2FAEnabled = (user as { twoFactorEnabled?: boolean }).twoFactorEnabled ?? false;

  // ─── 2FA setup ───────────────────────────────────────────────────────────────
  async function handleEnable2FA(e: React.FormEvent) {
    e.preventDefault();
    setTwoFAStatus("loading");
    setTwoFAError("");

    const result = await twoFactor.getTotpUri({ password: totpPassword });
    if (result.error) {
      setTwoFAError(result.error.message ?? "Failed");
      setTwoFAStatus("error");
      return;
    }
    setTotpSetup(result.data as TotpSetupData);
    setTwoFAStatus("verifying");
  }

  async function handleVerify2FA(e: React.FormEvent) {
    e.preventDefault();
    setTwoFAError("");
    const result = await twoFactor.enable({ code: totpCode });
    if (result.error) {
      setTwoFAError(result.error.message ?? "Invalid code");
      return;
    }
    const codes = (result.data as { backupCodes?: string[] }).backupCodes ?? [];
    setBackupCodes(codes);
    setTotpSetup(null);
    setTwoFAStatus("idle");
  }

  async function handleDisable2FA(e: React.FormEvent) {
    e.preventDefault();
    setTwoFAError("");
    const result = await twoFactor.disable({ password: totpPassword });
    if (result.error) {
      setTwoFAError(result.error.message ?? "Failed");
      return;
    }
    setTotpPassword("");
  }

  // ─── Password change ─────────────────────────────────────────────────────────
  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError("");
    if (pwNew !== pwConfirm) { setPwError("New passwords do not match"); return; }
    if (pwNew.length < 8) { setPwError("Minimum 8 characters"); return; }

    setPwStatus("saving");
    const result = await changePassword({ currentPassword: pwCurrent, newPassword: pwNew });
    if (result.error) {
      setPwError(result.error.message ?? "Failed");
      setPwStatus("error");
      return;
    }
    setPwCurrent(""); setPwNew(""); setPwConfirm("");
    setPwStatus("saved");
    setTimeout(() => setPwStatus("idle"), 3000);
  }

  return (
    <>
      <h1>Security</h1>

      {/* ─── Password ─────────────────────────────────────────────────────────── */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem" }}>Change password</h2>
        {pwStatus === "saved" && <div className="alert alert-success">Password updated!</div>}
        {pwError && <div className="alert alert-error">{pwError}</div>}
        <form onSubmit={handleChangePassword}>
          <div className="field">
            <label className="label">Current password</label>
            <input className="input" type="password" required value={pwCurrent} onChange={(e) => setPwCurrent(e.target.value)} />
          </div>
          <div className="field">
            <label className="label">New password</label>
            <input className="input" type="password" required value={pwNew} onChange={(e) => setPwNew(e.target.value)} />
          </div>
          <div className="field">
            <label className="label">Confirm new password</label>
            <input className="input" type="password" required value={pwConfirm} onChange={(e) => setPwConfirm(e.target.value)} />
          </div>
          <button className="btn btn-primary" type="submit" disabled={pwStatus === "saving"}>
            {pwStatus === "saving" ? "Saving…" : "Update password"}
          </button>
        </form>
      </div>

      {/* ─── 2FA ──────────────────────────────────────────────────────────────── */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div>
            <h2 style={{ fontSize: "1rem", fontWeight: 600 }}>Two-factor authentication</h2>
            <p style={{ fontSize: ".875rem", color: "#6b7280", marginTop: ".25rem" }}>
              {is2FAEnabled
                ? "TOTP authentication is enabled."
                : "Add an extra layer of security using an authenticator app."}
            </p>
          </div>
          <span className={`badge ${is2FAEnabled ? "badge-green" : "badge-gray"}`}>
            {is2FAEnabled ? "Enabled" : "Disabled"}
          </span>
        </div>

        {twoFAError && <div className="alert alert-error">{twoFAError}</div>}

        {/* Backup codes display (shown once after enabling) */}
        {backupCodes.length > 0 && (
          <div className="alert alert-info" style={{ marginBottom: "1rem" }}>
            <strong>Save these backup codes!</strong> They won&apos;t be shown again.
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".25rem .5rem", marginTop: ".5rem", fontFamily: "monospace", fontSize: ".875rem" }}>
              {backupCodes.map((c) => <span key={c}>{c}</span>)}
            </div>
            <button className="btn btn-secondary" style={{ marginTop: ".75rem" }} onClick={() => setBackupCodes([])}>
              Done
            </button>
          </div>
        )}

        {/* Enable flow */}
        {!is2FAEnabled && !totpSetup && twoFAStatus !== "verifying" && (
          <form onSubmit={handleEnable2FA}>
            <div className="field">
              <label className="label">Confirm your password to continue</label>
              <input className="input" type="password" required value={totpPassword} onChange={(e) => setTotpPassword(e.target.value)} />
            </div>
            <button className="btn btn-primary" type="submit" disabled={twoFAStatus === "loading"}>
              {twoFAStatus === "loading" ? "Loading…" : "Set up 2FA"}
            </button>
          </form>
        )}

        {/* QR code scan */}
        {totpSetup && twoFAStatus === "verifying" && (
          <div>
            <p style={{ fontSize: ".875rem", marginBottom: "1rem" }}>
              Scan this QR code with Google Authenticator or a compatible app, then enter the 6-digit code below.
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(totpSetup.totpURI)}&size=200x200`}
              alt="TOTP QR code"
              width={200}
              height={200}
              style={{ borderRadius: 8, border: "1px solid #e5e7eb", marginBottom: "1rem" }}
            />
            <form onSubmit={handleVerify2FA}>
              <div className="field">
                <label className="label">Authenticator code</label>
                <input
                  className="input"
                  type="text"
                  inputMode="numeric"
                  pattern="\d{6}"
                  maxLength={6}
                  required
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value)}
                  style={{ maxWidth: 160 }}
                />
              </div>
              <button className="btn btn-primary" type="submit">Verify &amp; enable</button>
            </form>
          </div>
        )}

        {/* Disable flow */}
        {is2FAEnabled && (
          <form onSubmit={handleDisable2FA} style={{ display: "flex", gap: ".75rem", alignItems: "flex-end" }}>
            <div className="field" style={{ flex: 1, marginBottom: 0 }}>
              <label className="label">Enter password to disable 2FA</label>
              <input className="input" type="password" required value={totpPassword} onChange={(e) => setTotpPassword(e.target.value)} />
            </div>
            <button className="btn btn-danger" type="submit">Disable</button>
          </form>
        )}
      </div>
    </>
  );
}
