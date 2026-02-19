"use client";

import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Divider,
  Skeleton,
  Tag,
  Typography,
  Alert,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  LockOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";

const { Title, Text, Paragraph } = Typography;

interface OAuthClient {
  clientId: string;
  name: string;
  description: string;
  logoUrl?: string;
  privacyUrl: string;
  tosUrl: string;
  verified: boolean;
}

interface OAuthScope {
  id: string;
  label: string;
  description: string;
  sensitive: boolean;
}

interface AuthRequest {
  client: OAuthClient;
  scopes: OAuthScope[];
  redirectUri: string;
  state: string;
  responseType: string;
}

const KNOWN_SCOPES: Record<string, OAuthScope> = {
  "profile:read": {
    id: "profile:read",
    label: "View your profile",
    description: "Read your display name, username, avatar, and bio.",
    sensitive: false,
  },
  "profile:write": {
    id: "profile:write",
    label: "Edit your profile",
    description: "Update your display name, bio, and avatar on your behalf.",
    sensitive: true,
  },
  "email:read": {
    id: "email:read",
    label: "View your email address",
    description: "Access the email address associated with your account.",
    sensitive: true,
  },
  "communities:read": {
    id: "communities:read",
    label: "View your communities",
    description: "See which Together apps you have joined.",
    sensitive: false,
  },
  "notifications:write": {
    id: "notifications:write",
    label: "Send you notifications",
    description: "Send push and in-app notifications to your account.",
    sensitive: false,
  },
  "offline_access": {
    id: "offline_access",
    label: "Stay signed in",
    description: "Access your account when you're not actively using this app (refresh tokens).",
    sensitive: true,
  },
};

export default function OAuthAuthorizePage() {
  const router = useRouter();
  const params = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authRequest, setAuthRequest] = useState<AuthRequest | null>(null);
  const [approving, setApproving] = useState(false);
  const [denying, setDenying] = useState(false);

  const clientId = params.get("client_id");
  const redirectUri = params.get("redirect_uri");
  const scope = params.get("scope") ?? "";
  const state = params.get("state") ?? "";
  const responseType = params.get("response_type") ?? "code";

  
  useEffect(() => {
    setAuthRequest({
        client: {
            clientId: "learn",
            name: "Together we Learn",
            description: "Get info about the world",
            logoUrl: "string",
            privacyUrl: "string",
            tosUrl: "string",
            verified: true,
        },
        scopes: [KNOWN_SCOPES["offline_access"], KNOWN_SCOPES["communities:read"], KNOWN_SCOPES["profile:write"]],
        redirectUri: redirectUri ?? "string",
        state: state,
        responseType: responseType
    });
    setLoading(false);
  /*
    if (!clientId || !redirectUri) {
      setError("Invalid authorization request. Missing required parameters.");
      setLoading(false);
      return;
    }
    
    fetch(`/api/oauth/validate?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error_description ?? "This authorization request is invalid.");
        } else {
          setAuthRequest(data);
        }
      })
      .catch(() => setError("Failed to validate this authorization request."))
      .finally(() => setLoading(false));*/
  }, [clientId, redirectUri, scope]);

  async function handleApprove() {
    if (!authRequest) return;
    setApproving(true);
    try {
      const res = await fetch("/api/oauth/authorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, redirectUri, scope, state, responseType, decision: "allow" }),
      });
      const data = await res.json();
      // Server responds with the redirect URL containing the code
      if (data.redirectTo) {
        window.location.href = data.redirectTo;
      }
    } catch {
      setError("Failed to complete authorization. Please try again.");
      setApproving(false);
    }
  }

  async function handleDeny() {
    setDenying(true);
    const denyUrl = new URL(redirectUri ?? "/");
    denyUrl.searchParams.set("error", "access_denied");
    denyUrl.searchParams.set("error_description", "The user denied the authorization request.");
    if (state) denyUrl.searchParams.set("state", state);
    window.location.href = denyUrl.toString();
  }

  const resolvedScopes: OAuthScope[] = scope
    .split(" ")
    .filter(Boolean)
    .map((s) => KNOWN_SCOPES[s] ?? { id: s, label: s, description: "Custom permission.", sensitive: false });

  const sensitiveScopeCount = resolvedScopes.filter((s) => s.sensitive).length;

  return (
      <div style={styles.page}>
        <div style={styles.bg} aria-hidden />

        <div style={styles.container}>
          {loading ? (
            <Card style={styles.card} variant={"borderless"}>
              <Skeleton active avatar paragraph={{ rows: 6 }} />
            </Card>
          ) : error ? (
            <Card style={styles.card} variant={"borderless"}>
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <CloseCircleOutlined style={{ fontSize: 48, color: "#E76F51", marginBottom: 16 }} />
                <Title level={4}>Invalid Request</Title>
                <Paragraph type="secondary">{error}</Paragraph>
                <Button onClick={() => router.push("/dashboard")}>Back to dashboard</Button>
              </div>
            </Card>
          ) : authRequest ? (
            <Card style={styles.card} variant={"borderless"}>
              {/* App identity */}
              <div style={styles.identityRow}>
                <Avatar
                  size={52}
                  src={authRequest.client.logoUrl}
                  style={{ background: "#D8F3DC", fontSize: 22 }}
                >
                  {authRequest.client.name[0]}
                </Avatar>
                <div style={styles.arrow}>→</div>
                <Avatar
                  size={52}
                  style={{
                    background: "linear-gradient(135deg, #2D6A4F, #52B788)",
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  T
                </Avatar>
              </div>

              <Title level={4} style={styles.title}>
                <span style={{ color: "#2D6A4F" }}>{authRequest.client.name}</span> wants to connect to your Together account
              </Title>

              {authRequest.client.verified && (
                <div style={styles.verifiedBadge}>
                  <SafetyOutlined style={{ marginRight: 6, color: "#2D6A4F" }} />
                  <Text style={{ fontSize: 13, color: "#2D6A4F", fontWeight: 500 }}>
                    Verified Together app
                  </Text>
                </div>
              )}

              <Paragraph type="secondary" style={{ marginBottom: 24, fontSize: 14 }}>
                {authRequest.client.description}
              </Paragraph>

              <Divider style={{ margin: "16px 0" }} />

              {/* Scopes */}
              <Text strong style={{ display: "block", marginBottom: 12 }}>
                This app will be able to:
              </Text>

              <div style={styles.scopeList}>
                {[...resolvedScopes, ...authRequest.scopes].map((scope) => (
                  <div key={scope.id} style={styles.scopeItem}>
                    <CheckCircleOutlined
                      style={{ color: scope.sensitive ? "#F4A261" : "#52B788", marginTop: 2, flexShrink: 0 }}
                    />
                    <div>
                      <Text strong style={{ display: "block", fontSize: 14 }}>
                        {scope.label}
                        {scope.sensitive && (
                          <Tag color="orange" style={{ marginLeft: 8, fontSize: 11 }}>
                            Sensitive
                          </Tag>
                        )}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 13 }}>{scope.description}</Text>
                    </div>
                  </div>
                ))}
              </div>

              {sensitiveScopeCount > 0 && (
                <Alert
                  type="warning"
                  showIcon
                  icon={<InfoCircleOutlined />}
                  message={`This app is requesting ${sensitiveScopeCount} sensitive permission${sensitiveScopeCount > 1 ? "s" : ""}. Only approve if you trust this app.`}
                  style={{ marginBottom: 20, marginTop: 4 }}
                />
              )}

              {/* Revocation notice */}
              <div style={styles.revokeNotice}>
                <LockOutlined style={{ marginRight: 8, color: "#888" }} />
                <Text style={{ fontSize: 13, color: "#888" }}>
                  You can revoke this access anytime from{" "}
                  <a href="/connected-apps" style={{ color: "#2D6A4F" }}>Connected Apps</a>.
                </Text>
              </div>

              <Divider style={{ margin: "16px 0" }} />

              {/* Actions */}
              <div style={styles.actions}>
                <Button
                  size="large"
                  onClick={handleDeny}
                  loading={denying}
                  style={styles.denyBtn}
                >
                  Deny
                </Button>
                <Button
                  type="primary"
                  size="large"
                  onClick={handleApprove}
                  loading={approving}
                  style={styles.approveBtn}
                >
                  Allow access
                </Button>
              </div>

              <Text style={styles.legalNote}>
                By allowing, you agree to{" "}
                <a href={authRequest.client.tosUrl} target="_blank" rel="noreferrer" style={{ color: "#888" }}>
                  {authRequest.client.name}&apos;s Terms
                </a>{" "}
                and{" "}
                <a href={authRequest.client.privacyUrl} target="_blank" rel="noreferrer" style={{ color: "#888" }}>
                  Privacy Policy
                </a>
                .
              </Text>
            </Card>
          ) : null}

          <Text style={styles.footer}>
            Secured by Together Central Auth ·{" "}
            <a href="/security" style={{ color: "#888" }}>Learn more</a>
          </Text>
        </div>
      </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#F8F7F4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px 16px",
    fontFamily: "'DM Sans', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  bg: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(ellipse 70% 50% at 50% 0%, #D8F3DC33 0%, transparent 60%)",
    pointerEvents: "none",
  },
  container: { width: "100%", maxWidth: 460, position: "relative", zIndex: 1 },
  card: { borderRadius: 20, boxShadow: "0 2px 24px rgba(0,0,0,0.08)", padding: "8px 4px" },
  identityRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    marginBottom: 20,
  },
  arrow: { fontSize: 22, color: "#aaa", fontWeight: 300 },
  title: { textAlign: "center", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, lineHeight: 1.35, marginBottom: 12 },
  verifiedBadge: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#F0FAF4",
    border: "1px solid #B7E4C7",
    borderRadius: 20,
    padding: "4px 14px",
    margin: "0 auto 16px",
    width: "fit-content",
  },
  scopeList: { display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 },
  scopeItem: { display: "flex", gap: 12, alignItems: "flex-start" },
  revokeNotice: {
    display: "flex",
    alignItems: "center",
    background: "#F8F7F4",
    padding: "10px 14px",
    borderRadius: 10,
    marginBottom: 8,
  },
  actions: { display: "flex", gap: 12 },
  denyBtn: { flex: 1, height: 46, borderRadius: 10, fontWeight: 500 },
  approveBtn: {
    flex: 2,
    height: 46,
    fontWeight: 600,
    fontSize: 15,
    background: "linear-gradient(135deg, #2D6A4F, #40916C)",
    border: "none",
    boxShadow: "0 4px 12px rgba(45,106,79,0.25)",
  },
  legalNote: {
    display: "block",
    textAlign: "center",
    fontSize: 12,
    color: "#aaa",
    marginTop: 14,
  },
  footer: { display: "block", textAlign: "center", fontSize: 12, color: "#bbb", marginTop: 20 },
};