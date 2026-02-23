"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client"; 

const SCOPE_META: Record<string, { label: string; description: string }> = {
  openid: {
    label: "OpenID identity",
    description: "Confirm your identity with a unique identifier.",
  },
  profile: {
    label: "Profile information",
    description: "Access your display name, picture, and locale.",
  },
  email: {
    label: "Email address",
    description: "Read your primary email address.",
  },
  offline_access: {
    label: "Stay signed in",
    description: "Keep access without requiring you to sign in again (refresh token).",
  },
};

function scopeLabel(scope: string) {
  return SCOPE_META[scope] ?? { label: scope, description: null };
}

type PublicClient = {
  client_id: string,
  client_name?: string;
  logo_uri?: string;
  client_uri?: string;
  tos_uri?: string;
  policy_uri?: string;
};

export default function ConsentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const clientId = searchParams.get("client_id") ?? "";
  const rawScopes = searchParams.get("scope") ?? "openid";
  const scopes = rawScopes.split(" ").filter(Boolean);

  const [appInfo, setAppInfo] = useState<PublicClient | null>(null);
  const [appLoading, setAppLoading] = useState(true);
  const [accepted, setAccepted] = useState<Set<string>>(new Set(scopes));
  const [loading, setLoading] = useState<"allow" | "deny" | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!clientId) { setAppLoading(false); return; }

    authClient.oauth2.publicClient({query: {client_id: clientId}})
      .then(({ data, error }) => {
        console.log(data);
        if (data) setAppInfo(data as PublicClient);
        if (error) console.error("Could not load client info:", error);
      })
      .finally(() => setAppLoading(false));
  }, []);

  function toggle(scope: string) {
    if (scope === "openid") return; // always required
    setAccepted((prev) => {
      const next = new Set(prev);
      next.has(scope) ? next.delete(scope) : next.add(scope);
      return next;
    });
  }

  async function handleAllow() {
    setLoading("allow");
    setError("");
    try {
      const res = await authClient.oauth2.consent({
        accept: true,
        scope: Array.from(accepted).join(" "),
      });
      if (res.error) throw new Error(res.error.message ?? "Consent failed");
      if ((res as any).data?.redirectTo) router.push((res as any).data.redirectTo);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong.");
      setLoading(null);
    }
  }

  async function handleDeny() {
    setLoading("deny");
    setError("");
    try {
      const res = await authClient.oauth2.consent({ accept: false });
      if (res.error) throw new Error(res.error.message ?? "Request failed");
      if ((res as any).data?.redirectTo) router.push((res as any).data.redirectTo);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong.");
      setLoading(null);
    }
  }

  const appName = appInfo?.client_name ?? (clientId
    ? clientId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "An application");

  return (
    <div className="page-center">
      <div className="auth-card card" style={{ maxWidth: 440 }}>
        {/* Header */}
        <span className="logo">Together</span>

        <div style={{ textAlign: "center", margin: "1.5rem 0 1.25rem" }}>
          {/* App icon: use fetched icon URL or fall back to initial letter */}
          {appInfo?.logo_uri ? (
            <img
              src={appInfo.logo_uri}
              alt={appName}
              className="app-avatar"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div className="app-avatar" aria-hidden>
              {appLoading ? "…" : appName.charAt(0)}
            </div>
          )}
          <h1 style={{ marginTop: "1rem", marginBottom: ".25rem", fontSize: "1.25rem" }}>
            {appLoading ? <span style={{ color: "#9ca3af" }}>Loading…</span> : appName}
          </h1>
          <p className="subtitle" style={{ margin: 0 }}>
            wants to access your Together account
          </p>
          {appInfo?.client_uri && (
            <a
              href={appInfo.client_uri}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: ".75rem", color: "#6b7280", marginTop: ".25rem", display: "inline-block" }}
            >
              {appInfo.client_uri.replace(/^https?:\/\//, "")}
            </a>
          )}
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {/* Scope list */}
        <div className="scope-list">
          <p
            style={{
              fontSize: ".75rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: ".05em",
              color: "#6b7280",
              marginBottom: ".75rem",
            }}
          >
            This will allow {appName} to:
          </p>

          {scopes.map((scope) => {
            const { label, description } = scopeLabel(scope);
            const required = scope === "openid";
            const isOn = accepted.has(scope);

            return (
              <label
                key={scope}
                className={`scope-item ${isOn ? "scope-on" : "scope-off"} ${required ? "scope-required" : ""}`}
                title={required ? "Required – cannot be removed" : undefined}
              >
                <span className="scope-text">
                  <span className="scope-label">{label}</span>
                  {description && (
                    <span className="scope-desc">{description}</span>
                  )}
                </span>

                <span className="scope-toggle-wrap">
                  {required ? (
                    <span className="scope-badge">Required</span>
                  ) : (
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isOn}
                      onClick={() => toggle(scope)}
                      className={`toggle ${isOn ? "toggle-on" : "toggle-off"}`}
                      aria-label={`${isOn ? "Remove" : "Add"} ${label}`}
                    >
                      <span className="toggle-thumb" />
                    </button>
                  )}
                </span>
              </label>
            );
          })}
        </div>

        {/* Legal note */}
        <p
          style={{
            fontSize: ".75rem",
            color: "#9ca3af",
            margin: "1rem 0 1.5rem",
            lineHeight: 1.5,
          }}
        >
          By allowing access, you agree that {appName} may use your information
          in accordance with their privacy policy and terms of service.
        </p>

        {/* Actions */}
        <div style={{ display: "flex", gap: ".75rem" }}>
          <button
            type="button"
            className="btn btn-secondary btn-full"
            onClick={handleDeny}
            disabled={loading !== null}
            style={{ flex: 1 }}
          >
            {loading === "deny" ? "Cancelling…" : "Deny"}
          </button>
          <button
            type="button"
            className="btn btn-primary btn-full"
            onClick={handleAllow}
            disabled={loading !== null}
            style={{ flex: 2 }}
          >
            {loading === "allow" ? "Authorizing…" : "Allow access"}
          </button>
        </div>

        {/* Client id footer */}
        {clientId && (
          <p
            style={{
              textAlign: "center",
              marginTop: "1.25rem",
              fontSize: ".75rem",
              color: "#9ca3af",
            }}
          >
            Client ID:{" "}
            <code style={{ fontFamily: "monospace" }}>{clientId}</code>
          </p>
        )}
      </div>
    </div>
  );
}