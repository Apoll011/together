"use client";

import React, { useState, useEffect } from "react";
import { useSignUp, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useTheme } from "@repo/ui/ThemeContext";
import { completeOnboarding } from "./_actions";
import { appsData } from "@repo/together-apps/data";
import { Typography } from "antd";
const { Text } = Typography;

type Step = "signup" | "verify" | "apps" | "done";

const EyeIcon = ({ open }: { open: boolean }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
);

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

export default function JoinPage() {
  const { colors, mode } = useTheme();
  const isDark = mode === "dark";
  const router = useRouter();

  const { isLoaded, signUp, setActive } = useSignUp();
  const { user } = useUser();

  const [step, setStep] = useState<Step>("signup");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [code, setCode] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [doneVisible, setDoneVisible] = useState(false);

  useEffect(() => {
    if (user && step === "signup") setStep("apps");
  }, [user]);
  useEffect(() => {
    if (step === "done") setTimeout(() => setDoneVisible(true), 80);
  }, [step]);

  // ── Theme ──────────────────────────────────────────────────────────────────
  const primary = colors.accentText;
  const bg = isDark ? "#141414" : "#ffffff";
  const ink = isDark ? "#ffffff" : "#1F1F1F";
  const muted = isDark ? "rgba(255,255,255,0.45)" : "#595959";
  const borderCol = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)";
  const inputBg = isDark ? "#1b1b1b" : "#f5f7fa";
  const cardBg = isDark ? "#1b1b1b" : "#ffffff";
  const cardShadow = isDark
    ? "0 1px 3px rgba(0,0,0,0.4)"
    : "0 1px 3px rgba(0,0,0,0.07)";

  // ── Style helpers ──────────────────────────────────────────────────────────
  const mkInput = (focused = false): React.CSSProperties => ({
    width: "100%",
    padding: "12px 16px",
    background: inputBg,
    border: `1.5px solid ${focused ? primary : borderCol}`,
    borderRadius: 12,
    color: ink,
    fontSize: 15,
    fontFamily: "'Inter', -apple-system, sans-serif",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  });

  const primaryBtn: React.CSSProperties = {
    width: "100%",
    padding: "13px 0",
    background: primary,
    border: "none",
    borderRadius: 12,
    color: "#fff",
    fontSize: 15,
    fontFamily: "'Inter', -apple-system, sans-serif",
    fontWeight: 600,
    cursor: loading ? "not-allowed" : "pointer",
    opacity: loading ? 0.65 : 1,
    transition: "opacity 0.2s, transform 0.15s",
  };

  const ghostBtn: React.CSSProperties = {
    width: "100%",
    padding: "12px 0",
    background: "transparent",
    border: `1.5px solid ${borderCol}`,
    borderRadius: 12,
    color: ink,
    fontSize: 15,
    fontFamily: "'Inter', -apple-system, sans-serif",
    fontWeight: 500,
    cursor: "pointer",
    transition: "border-color 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  };

  const label: React.CSSProperties = {
    display: "block",
    fontSize: 13,
    fontWeight: 500,
    color: muted,
    fontFamily: "'Inter', -apple-system, sans-serif",
    marginBottom: 6,
    letterSpacing: "0.01em",
  };

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    setError("");
    try {
      await signUp.create({
        firstName,
        lastName: lastName || undefined,
        emailAddress: email,
        username: username,
        password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setStep("verify");
    } catch (err: any) {
      setError(
        err.errors?.[0]?.longMessage ||
          err.errors?.[0]?.message ||
          "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    if (!isLoaded) return;
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/join/apps",
      });
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Google sign-up failed.");
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    setError("");
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      console.log(result);

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        setStep("apps");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Invalid code. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleApp = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const handleSaveApps = async () => {
    if (selected.length === 0) return;
    setLoading(true);
    try {
      const res = await completeOnboarding(selected);
      if (res?.message) {
        await user?.reload();
        setStep("done");
      }
      if (res?.error) setError(res.error);
    } catch {
      setError("Couldn't save your picks. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Sub-components ─────────────────────────────────────────────────────────
  const H = ({ children }: { children: React.ReactNode }) => (
    <h1
      style={{
        fontSize: "clamp(22px, 4vw, 28px)",
        color: ink,
        fontWeight: 700,
        letterSpacing: "-0.025em",
        margin: "0 0 8px",
        fontFamily: "'Inter', sans-serif",
        lineHeight: 1.2,
      }}
    >
      {children}
    </h1>
  );
  const Sub = ({ children }: { children: React.ReactNode }) => (
    <p
      style={{
        fontSize: 15,
        color: muted,
        lineHeight: 1.6,
        margin: "0 0 28px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {children}
    </p>
  );
  const Divider = () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        margin: "20px 0",
      }}
    >
      <div style={{ flex: 1, height: 1, background: borderCol }} />
      <span style={{ fontSize: 13, color: muted, fontFamily: "sans-serif" }}>
        or
      </span>
      <div style={{ flex: 1, height: 1, background: borderCol }} />
    </div>
  );
  const Err = ({ msg }: { msg: string }) =>
    msg ? (
      <p
        style={{
          fontSize: 13,
          color: "#cf1322",
          fontFamily: "'Inter', sans-serif",
          margin: "0",
        }}
      >
        {msg}
      </p>
    ) : null;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 24px 120px",
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      {/* Logo */}
      {step !== "done" && (
        <div style={{ marginBottom: 32, animation: "fadeUp 0.4s ease both" }}>
          <div
            style={{
              width: 44,
              height: 44,
              background: primary,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 20,
              fontWeight: 700,
              margin: "0 auto",
            }}
          >
            T
          </div>
        </div>
      )}

      {/* ── SIGNUP ── */}
      {step === "signup" && (
        <div
          style={{
            width: "100%",
            maxWidth: 420,
            animation: "fadeUp 0.55s ease both",
          }}
        >
          <H>Create your account</H>
          <Sub>Welcome! Please fill in the details to get started.</Sub>

          <button
            onClick={handleGoogle}
            style={ghostBtn as React.CSSProperties}
          >
            <GoogleIcon />
            <span>Continue with Google</span>
          </button>
          <Divider />

          <form
            onSubmit={handleSignUp}
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <div>
                <label style={label}>First name</label>
                <FocusInput
                  value={firstName}
                  onChange={setFirstName}
                  placeholder="Ada"
                  mkInput={mkInput}
                  required
                />
              </div>
              <div>
                <label style={label}>Last name</label>
                <FocusInput
                  value={lastName}
                  onChange={setLastName}
                  placeholder="Lovelace"
                  mkInput={mkInput}
                />
              </div>
            </div>
            <div>
              <label style={label}>Username</label>
              <FocusInput
                value={username}
                onChange={setUsername}
                placeholder="lovelace1911"
                mkInput={mkInput}
                required
              />
            </div>
            <div>
              <label style={label}>Email address</label>
              <FocusInput
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="you@example.com"
                mkInput={mkInput}
                required
              />
            </div>
            <div>
              <label style={label}>Password</label>
              <div style={{ position: "relative" }}>
                <FocusInput
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={setPassword}
                  placeholder="Create a strong password"
                  mkInput={(f) => ({ ...mkInput(f), paddingRight: 46 })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  style={{
                    position: "absolute",
                    right: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: muted,
                    padding: 0,
                    display: "flex",
                  }}
                >
                  <EyeIcon open={showPass} />
                </button>
              </div>
            </div>
            <Err msg={error} />

            <div id="clerk-captcha" />

            <button type="submit" style={primaryBtn} disabled={loading}>
              {loading ? "Creating account…" : "Continue"}
            </button>
          </form>
          <p
            style={{
              marginTop: 20,
              fontSize: 14,
              color: muted,
              textAlign: "center",
            }}
          >
            Already have an account?{" "}
            <a
              href="/sign-in"
              style={{
                color: primary,
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Sign in
            </a>
          </p>
        </div>
      )}

      {/* ── VERIFY ── */}
      {step === "verify" && (
        <div
          style={{
            width: "100%",
            maxWidth: 420,
            animation: "fadeUp 0.55s ease both",
          }}
        >
          <H>Check your inbox.</H>
          <Sub>
            We sent a 6-digit code to{" "}
            <strong style={{ color: ink }}>{email}</strong>. Enter it below to
            verify your account.
          </Sub>
          <form
            onSubmit={handleVerify}
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            <input
              type="text"
              inputMode="numeric"
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              maxLength={6}
              placeholder="000000"
              required
              autoFocus
              style={{
                ...mkInput(),
                fontSize: 28,
                letterSpacing: "0.35em",
                textAlign: "center",
                fontWeight: 600,
              }}
              onFocus={(e) => (e.target.style.borderColor = primary)}
              onBlur={(e) => (e.target.style.borderColor = borderCol)}
            />
            <Err msg={error} />
            <button
              type="submit"
              style={{
                ...primaryBtn,
                opacity: code.length < 6 ? 0.4 : loading ? 0.65 : 1,
              }}
              disabled={loading || code.length < 6}
            >
              {loading ? "Verifying…" : "Verify email"}
            </button>
          </form>
          <p
            style={{
              marginTop: 16,
              fontSize: 14,
              color: muted,
              textAlign: "center",
            }}
          >
            Didn't get it?{" "}
            <button
              onClick={() =>
                signUp?.prepareEmailAddressVerification({
                  strategy: "email_code",
                })
              }
              style={{
                background: "none",
                border: "none",
                color: primary,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 500,
                padding: 0,
              }}
            >
              Resend code
            </button>
          </p>
        </div>
      )}

      {/* ── APP SELECTION ── */}
      {step === "apps" && (
        <div
          style={{
            width: "100%",
            maxWidth: 740,
            animation: "fadeUp 0.55s ease both",
          }}
        >
          <H>Where do you want to show up?</H>
          <Sub>Pick what calls to you. You can always change this later.</Sub>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
              gap: 10,
              marginBottom: 24,
            }}
          >
            {appsData.map((app, i) => {
              const isOn = selected.includes(app.key);
              return (
                <button
                  key={app.key}
                  onClick={() => toggleApp(app.key)}
                  style={{
                    background: isOn ? primary : cardBg,
                    border: `1.5px solid ${isOn ? primary : borderCol}`,
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 12px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 0.15s",
                    width: "100%",
                    animation: `fadeUp 0.45s ease ${i * 0.035}s both`,
                    boxShadow: cardShadow,
                    transform: isOn ? "scale(1.02)" : "scale(1)",
                    color: isOn ? "#fff" : colors.navText,
                    maxHeight: 100,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: `${app.color}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                      flexShrink: 0,
                      color: "#fff",
                    }}
                  >
                    {app.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        marginBottom: 2,
                      }}
                    >
                      <Text
                        strong
                        style={{
                          fontSize: 14,
                          color: isOn ? "#fff" : colors.navText,
                        }}
                      >
                        {app.label}
                      </Text>
                    </div>
                    <Text
                      style={{
                        fontSize: 12,
                        display: "block",
                        color: isOn ? "#fff" : colors.navText,
                      }}
                    >
                      {app.description}
                    </Text>
                  </div>
                </button>
              );
            })}
          </div>
          <Err msg={error} />
          <button
            onClick={handleSaveApps}
            disabled={selected.length === 0 || loading}
            style={{
              ...primaryBtn,
              opacity: selected.length === 0 ? 0.35 : loading ? 0.65 : 1,
            }}
          >
            {loading
              ? "Saving…"
              : selected.length === 0
                ? "Pick at least one"
                : `I'm in... Let's go`}
          </button>
          <p
            style={{
              marginTop: 12,
              fontSize: 13,
              color: muted,
              textAlign: "center",
            }}
          >
            {selected.length === 0
              ? "Nothing selected yet"
              : `${selected.length} ${selected.length === 1 ? "space" : "spaces"} chosen`}
          </p>
        </div>
      )}

      {step === "done" && (
        <div
          style={{
            width: "100%",
            maxWidth: 520,
            textAlign: "center",
            opacity: doneVisible ? 1 : 0,
            transform: doneVisible ? "translateY(0)" : "translateY(18px)",
            transition: "opacity 0.9s ease, transform 0.9s ease",
          }}
        >
          <div
            style={{
              position: "relative",
              width: 72,
              height: 72,
              margin: "0 auto 40px",
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  border: `1.5px solid ${primary}`,
                  animation: `ripple 2.2s ease ${i * 0.45}s infinite`,
                  opacity: 0,
                }}
              />
            ))}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: primary,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
              }}
            >
              🤝
            </div>
          </div>
          <h1
            style={{
              fontSize: "clamp(28px, 5vw, 40px)",
              color: ink,
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.2,
              marginBottom: 16,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            You're one of us now.
          </h1>
          <p
            style={{
              fontSize: 17,
              color: muted,
              lineHeight: 1.75,
              marginBottom: 32,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Your account is ready. The doors you picked are open.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              justifyContent: "center",
              marginBottom: 40,
            }}
          >
            {selected.map((id) => {
              const app = appsData.find((a) => a.key === id)!;
              return (
                <span
                  key={id}
                  style={{
                    padding: "6px 14px",
                    border: `1px solid ${borderCol}`,
                    borderRadius: 100,
                    fontSize: 13,
                    color: muted,
                    display: "flex",
                    gap: 2,
                    alignItems: 'center',
                    fontFamily: "'Inter', sans-serif",
                    background: cardBg,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      background: `${app.color}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 24,
                      flexShrink: 0,
                      marginRight: 5,
                      color: "#fff",
                    }}
                  >
                    {app.icon}
                  </div>{" "}
                  {app.label}
                </span>
              );
            })}
          </div>
          <button
            onClick={() => router.push("/")}
            style={{
              ...primaryBtn,
              width: "auto",
              padding: "13px 44px",
              display: "inline-block",
            }}
          >
            Take me in
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes ripple { 0% { transform:scale(0.7); opacity:0.6; } 100% { transform:scale(2.6); opacity:0; } }
        input::placeholder { opacity: 0.4; }
        button:hover:not(:disabled) { opacity: 0.85 !important; }
      `}</style>
    </main>
  );
}

// ── Controlled input that manages its own focus state ─────────────────────────
function FocusInput({
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  mkInput,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
  mkInput: (f?: boolean) => React.CSSProperties;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      style={mkInput(focused)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}
