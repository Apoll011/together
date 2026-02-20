"use client";

import React, { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useTheme } from "@repo/ui/ThemeContext";

const EyeIcon = ({ open }: { open: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
    ) : (
      <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
    )}
  </svg>
);

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

export default function SignInPage() {
  const { colors, mode } = useTheme();
  const isDark = mode === "dark";
  const router = useRouter();

  const { isLoaded, signIn, setActive } = useSignIn();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const primary   = colors.accentText;
  const bg        = isDark ? "#141414" : "#ffffff";
  const ink       = isDark ? "#ffffff" : "#1F1F1F";
  const muted     = isDark ? "rgba(255,255,255,0.45)" : "#595959";
  const borderCol = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)";
  const inputBg   = isDark ? "#1b1b1b" : "#f5f7fa";

  const mkInput = (focused = false): React.CSSProperties => ({
    width: "100%", padding: "12px 16px",
    background: inputBg,
    border: `1.5px solid ${focused ? primary : borderCol}`,
    borderRadius: 12, color: ink, fontSize: 15,
    fontFamily: "'Inter', -apple-system, sans-serif",
    outline: "none", transition: "border-color 0.2s", boxSizing: "border-box",
  });

  const primaryBtn: React.CSSProperties = {
    width: "100%", padding: "13px 0",
    background: primary, border: "none", borderRadius: 12,
    color: "#fff", fontSize: 15,
    fontFamily: "'Inter', -apple-system, sans-serif",
    fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
    opacity: loading ? 0.65 : 1, transition: "opacity 0.2s",
  };

  const ghostBtn: React.CSSProperties = {
    width: "100%", padding: "12px 0", background: "transparent",
    border: `1.5px solid ${borderCol}`, borderRadius: 12, color: ink,
    fontSize: 15, fontFamily: "'Inter', -apple-system, sans-serif",
    fontWeight: 500, cursor: "pointer", display: "flex",
    alignItems: "center", justifyContent: "center", gap: 10,
    transition: "border-color 0.2s",
  };

  const label: React.CSSProperties = {
    display: "block", fontSize: 13, fontWeight: 500,
    color: muted, fontFamily: "'Inter', -apple-system, sans-serif",
    marginBottom: 6, letterSpacing: "0.01em",
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true); setError("");
    try {
      const result = await signIn.create({ identifier: email, password });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage || err.errors?.[0]?.message || "Incorrect email or password.");
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    if (!isLoaded) return;
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/home",
      });
    } catch (err: any) { setError(err.errors?.[0]?.message || "Google sign-in failed."); }
  };

  const handleForgotPassword = async () => {
    if (!email) { setError("Enter your email above first."); return; }
    if (!isLoaded) return;
    try {
      await signIn.create({ strategy: "reset_password_email_code", identifier: email });
      router.push(`/forgot-password?email=${encodeURIComponent(email)}`);
    } catch (err: any) { setError(err.errors?.[0]?.message || "Couldn't send reset email."); }
  };

  return (
    <main style={{
      minHeight: "100vh", background: bg,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "80px 24px 120px",
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>

      {/* Logo */}
      <div style={{ marginBottom: 32, animation: "fadeUp 0.4s ease both" }}>
        <div style={{
          width: 44, height: 44, background: primary, borderRadius: 12,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: 20, fontWeight: 700, margin: "0 auto",
        }}>T</div>
      </div>

      <div style={{ width: "100%", maxWidth: 420, animation: "fadeUp 0.55s ease both" }}>

        {/* Heading */}
        <h1 style={{
          fontSize: "clamp(22px, 4vw, 28px)", color: ink, fontWeight: 700,
          letterSpacing: "-0.025em", margin: "0 0 8px",
          fontFamily: "'Inter', sans-serif", lineHeight: 1.2,
        }}>
          Sign in to Together
        </h1>
        <p style={{ fontSize: 15, color: muted, lineHeight: 1.6, margin: "0 0 28px", fontFamily: "'Inter', sans-serif" }}>
          Welcome back! Please sign in to continue.
        </p>

        {/* Google */}
        <button onClick={handleGoogle} style={ghostBtn as React.CSSProperties}>
          <GoogleIcon /><span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
          <div style={{ flex: 1, height: 1, background: borderCol }} />
          <span style={{ fontSize: 13, color: muted }}>or</span>
          <div style={{ flex: 1, height: 1, background: borderCol }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSignIn} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={label}>Email address</label>
            <FocusInput type="email" value={email} onChange={setEmail} placeholder="you@example.com" mkInput={mkInput} required />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={label}>Password</span>
              <button
                type="button"
                onClick={handleForgotPassword}
                style={{ background: "none", border: "none", color: primary, cursor: "pointer", fontSize: 13, fontWeight: 500, padding: 0, fontFamily: "'Inter', sans-serif" }}
              >
                Forgot password?
              </button>
            </div>
            <div style={{ position: "relative" }}>
              <FocusInput
                type={showPass ? "text" : "password"}
                value={password} onChange={setPassword}
                placeholder="Your password"
                mkInput={(f) => ({ ...mkInput(f), paddingRight: 46 })}
                required
              />
              <button type="button" onClick={() => setShowPass((v) => !v)}
                style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: muted, padding: 0, display: "flex" }}>
                <EyeIcon open={showPass} />
              </button>
            </div>
          </div>

          {error && <p style={{ fontSize: 13, color: "#cf1322", fontFamily: "'Inter', sans-serif", margin: 0 }}>{error}</p>}

          <button type="submit" style={primaryBtn} disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p style={{ marginTop: 20, fontSize: 14, color: muted, textAlign: "center" }}>
          Don't have an account?{" "}
          <a href="/join" style={{ color: primary, textDecoration: "none", fontWeight: 500 }}>Sign up</a>
        </p>
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        input::placeholder { opacity: 0.4; }
        button:hover:not(:disabled) { opacity: 0.85 !important; }
      `}</style>
    </main>
  );
}

function FocusInput({ value, onChange, placeholder, type = "text", required = false, mkInput }: {
  value: string; onChange: (v: string) => void; placeholder: string;
  type?: string; required?: boolean; mkInput: (f?: boolean) => React.CSSProperties;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder} required={required} style={mkInput(focused)}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    />
  );
}