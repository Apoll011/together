"use client";

import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Divider,
  List,
  Typography,
  Alert,
  Tooltip,
  Space,
  Tag,
  theme,
  Spin,
} from "antd";
import {
  CheckCircleFilled,
  InfoCircleOutlined,
  LockOutlined,
  GlobalOutlined,
  SafetyCertificateFilled,
  UserOutlined,
  WarningFilled,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "@repo/ui/ThemeContext";
import Image from "next/image";

const { Title, Text, Paragraph } = Typography;

// --- Types ---
interface OAuthClient {
  clientId: string;
  name: string;
  url: string;
  logoUrl?: string;
  privacyUrl: string;
  tosUrl: string;
  verified: boolean;
  usersCount?: number; // Added feature: Social proof
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
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}

// --- Mock Data Generator ---
// This runs if real API fails or parameters are missing
const getMockData = (): AuthRequest => ({
  client: {
    clientId: "demo-app",
    name: "Vercel Integration",
    url: "https://vercel.com",
    logoUrl: "https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png",
    privacyUrl: "#",
    tosUrl: "#",
    verified: true,
    usersCount: 15000,
  },
  user: {
    name: "Claude Developer",
    email: "claude@together.dev",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Claude",
  },
  scopes: [
    {
      id: "profile:read",
      label: "Read your profile",
      description: "Access your name, username, and avatar.",
      sensitive: false,
    },
    {
      id: "email:read",
      label: "Read email address",
      description: "Access your primary email address.",
      sensitive: false,
    },
    {
      id: "repos:write",
      label: "Modify repositories",
      description: "Create and delete repositories on your behalf.",
      sensitive: true, // This triggers the warning UI
    },
  ],
});

export default function OAuthAuthorizePage() {
  const router = useRouter();
  const params = useSearchParams();
  const { colors, mode } = useTheme();
  const { token } = theme.useToken();
  const isDark = mode === "dark";

  // State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authRequest, setAuthRequest] = useState<AuthRequest | null>(null);
  const [approving, setApproving] = useState(false);
  const [denying, setDenying] = useState(false);

  // Params
  const clientId = params.get("client_id");
  const redirectUri = params.get("redirect_uri");
  const isDemo = params.get("demo") === "true"; // Add ?demo=true to force mock

  // --- Effect: Load Data ---
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      
      // Artificial delay for realism
      await new Promise((r) => setTimeout(r, 800));

      // 1. Check if we should run in "Demo/Test" mode
      if (isDemo || !clientId) {
        console.log("⚠️ OAuth: Running in Mock Mode (No client_id or ?demo=true)");
        setAuthRequest(getMockData());
        setLoading(false);
        return;
      }

      // 2. Real API Attempt (Simulated for now, replace with your fetch)
      try {
        // const res = await fetch(`/api/oauth/validate?...`);
        // if (!res.ok) throw new Error("API Error");
        // const data = await res.json();
        
        // Fallback to mock for this example even if ID exists
        setAuthRequest(getMockData());
      } catch (err) {
        setError("Invalid authorization request. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [clientId, isDemo]);

  // --- Handlers ---
  const handleApprove = async () => {
    setApproving(true);
    // Simulate network request
    setTimeout(() => {
      // In a real app, you'd POST to your backend, then window.location.href = redirectUrl
      if (redirectUri) {
         window.location.href = `${redirectUri}?code=mock_auth_code_123`;
      } else {
         alert("Success! In production, this would redirect.");
         setApproving(false);
      }
    }, 1000);
  };

  const handleDeny = () => {
    setDenying(true);
    setTimeout(() => {
      if (redirectUri) {
        window.location.href = `${redirectUri}?error=access_denied`;
      } else {
        router.push("/");
      }
    }, 500);
  };

  // --- Render Helpers ---
  const sensitiveScopes = authRequest?.scopes.filter(s => s.sensitive) || [];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: colors.navBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div style={{ maxWidth: 480, width: "100%" }}>
        
        {/* Loading State */}
        {loading && (
          <Card variant={"borderless"} style={{ textAlign: "center", padding: 40, background: isDark ? colors.navBg : "#fff" }}>
            <Spin size="large" />
            <div style={{ marginTop: 16, color: colors.navSubText }}>
              Verifying application...
            </div>
          </Card>
        )}

        {/* Error State */}
        {!loading && error && (
          <Card variant={"borderless"} style={{ background: isDark ? colors.navBg : "#fff" }}>
            <Alert
              message="Authorization Error"
              description={error}
              type="error"
              showIcon
              action={
                <Button size="small" danger onClick={() => router.push("/")}>
                  Go Home
                </Button>
              }
            />
          </Card>
        )}

        {/* Success / Loaded State */}
        {!loading && authRequest && !error && (
          <Card
            bordered={isDark}
            style={{
              background: isDark ? colors.navBg : "#fff",
              borderRadius: 16,
              boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.05)",
              overflow: "hidden",
            }}
            styles={{ body: { padding: 0 } }}
          >
            {/* Header / Identity Section */}
            <div
              style={{
                padding: "40px 32px 30px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: isDark 
                   ? `linear-gradient(180deg, ${token.colorPrimary}1A 0%, ${colors.navBg} 100%)` 
                   : `linear-gradient(180deg, ${token.colorPrimary}0D 0%, #fff 100%)`,
              }}
            >
              {/* Visual Connection */}
              <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 24 }}>
                <BadgeAvatar src={authRequest.client.logoUrl} letter={authRequest.client.name[0]} verified={authRequest.client.verified} />
                
                {/* Animated Dots */}
                <div style={{ display: "flex", gap: 4, opacity: 0.5 }}>
                  <div className="animate-pulse" style={{ width: 6, height: 6, background: token.colorPrimary, borderRadius: "50%" }} />
                  <div className="animate-pulse" style={{ width: 6, height: 6, background: token.colorPrimary, borderRadius: "50%", animationDelay: "0.2s" }} />
                  <div className="animate-pulse" style={{ width: 6, height: 6, background: token.colorPrimary, borderRadius: "50%", animationDelay: "0.4s" }} />
                </div>

                <BadgeAvatar src={null} letter="T" isTogether />
              </div>

              <Title level={3} style={{ textAlign: "center", margin: "0 0 8px", color: colors.navText }}>
                Authorize Access
              </Title>
              <Paragraph style={{ textAlign: "center", color: colors.navSubText, fontSize: 16, marginBottom: 0 }}>
                <strong style={{ color: colors.navText }}>{authRequest.client.name}</strong> wants to access your <strong style={{ color: colors.navText }}>Together</strong> account.
              </Paragraph>

              {/* Client URL display for security */}
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6, background: isDark ? "rgba(255,255,255,0.05)" : "#f5f5f5", padding: "4px 12px", borderRadius: 20 }}>
                <GlobalOutlined style={{ fontSize: 12, color: colors.navSubText }} />
                <Text type="secondary" style={{ fontSize: 13 }}>{authRequest.client.url}</Text>
              </div>
            </div>

            <Divider style={{ margin: 0, borderColor: isDark ? "#333" : "#f0f0f0" }} />

            {/* User Context (Who am I?) */}
            <div style={{ padding: "16px 24px", background: isDark ? "rgba(255,255,255,0.02)" : "#fafafa", display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Avatar src={authRequest.user.avatar} icon={<UserOutlined />} />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                     <Text style={{ fontSize: 13, color: colors.navSubText }}>Signing in as</Text>
                     <Text strong style={{ color: colors.navText }}>{authRequest.user.email}</Text>
                  </div>
               </div>
               <Button type="link" size="small" style={{ color: token.colorPrimary }}>Not you?</Button>
            </div>

            <Divider style={{ margin: 0, borderColor: isDark ? "#333" : "#f0f0f0" }} />

            {/* Scope List */}
            <div style={{ padding: "24px 32px" }}>
              <Text strong style={{ display: "block", marginBottom: 16, color: colors.navText, fontSize: 13, textTransform: "uppercase", letterSpacing: 0.5 }}>
                Permissions Requested
              </Text>
              
              <List
                itemLayout="horizontal"
                dataSource={authRequest.scopes}
                renderItem={(scope) => (
                  <List.Item style={{ border: "none", padding: "10px 0" }}>
                     <List.Item.Meta
                        avatar={
                            scope.sensitive 
                            ? <WarningFilled style={{ color: "#faad14", fontSize: 20, marginTop: 4 }} />
                            : <CheckCircleFilled style={{ color: "#52c41a", fontSize: 20, marginTop: 4 }} />
                        }
                        title={
                            <Space>
                                <Text style={{ fontSize: 15, color: colors.navText, fontWeight: 500 }}>{scope.label}</Text>
                                {scope.sensitive && <Tag color="warning" variant={"borderless"} style={{ fontSize: 10 }}>SENSITIVE</Tag>}
                            </Space>
                        }
                        description={<Text style={{ color: colors.navSubText, fontSize: 13 }}>{scope.description}</Text>}
                     />
                  </List.Item>
                )}
              />

              {sensitiveScopes.length > 0 && (
                 <Alert 
                    message="Sensitive Access Warning"
                    description={`This app requests high-level access. Only approve if you trust ${authRequest.client.name}.`}
                    type="warning"
                    showIcon
                    style={{ marginTop: 16, borderRadius: 8 }}
                 />
              )}
            </div>

            <Divider style={{ margin: 0, borderColor: isDark ? "#333" : "#f0f0f0" }} />

            {/* Footer / Actions */}
            <div style={{ padding: "24px 32px", background: isDark ? "#1a1a1a" : "#fbfbfb" }}>
               <div style={{ display: "flex", gap: 16 }}>
                 <Button 
                    block 
                    size="large" 
                    onClick={handleDeny}
                    disabled={approving}
                    style={{ background: "transparent", borderColor: isDark ? "#444" : "#d9d9d9", color: colors.navText }}
                 >
                    Cancel
                 </Button>
                 <Button 
                    block 
                    type="primary" 
                    size="large" 
                    onClick={handleApprove}
                    loading={approving}
                    style={{ fontWeight: 600, background: token.colorPrimary }}
                 >
                    Authorize
                 </Button>
               </div>
               
               <div style={{ marginTop: 20, textAlign: "center", fontSize: 12, color: colors.navSubText, lineHeight: 1.6 }}>
                  By authorizing, you agree to the App's <a href="#" style={{ color: token.colorPrimary }}>Terms of Service</a> and <a href="#" style={{ color: token.colorPrimary }}>Privacy Policy</a>.
               </div>
            </div>
          </Card>
        )}
      </div>

      {/* --- Helper for Testing/Demo --- */}
      <div style={{ position: "fixed", bottom: 16, right: 16 }}>
        <Tooltip title="Toggle between Test Mode and Empty State">
            <Button 
                shape="circle" 
                icon={<InfoCircleOutlined />} 
                onClick={() => {
                    const url = new URL(window.location.href);
                    if (url.searchParams.get("demo")) url.searchParams.delete("demo");
                    else url.searchParams.set("demo", "true");
                    window.location.href = url.toString();
                }}
            />
        </Tooltip>
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: .5; transform: scale(0.8); }
        }
        .animate-pulse {
          animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </main>
  );
}

// Sub-component for the Avatars to clean up main render
function BadgeAvatar({ src, letter, verified, isTogether }: { src?: string | null, letter: string, verified?: boolean, isTogether?: boolean }) {
    return (
        <div style={{ position: 'relative' }}>
            <Avatar 
                size={64} 
                src={src} 
                shape="square"
                style={{ 
                    background: isTogether ? "linear-gradient(135deg, #2D6A4F, #52B788)" : "#f0f0f0",
                    color: isTogether ? "#fff" : "#333",
                    fontSize: 28,
                    borderRadius: 16,
                    border: "1px solid rgba(0,0,0,0.05)"
                }}
            >
                {letter}
            </Avatar>
            {verified && (
                <Tooltip title="Verified Application">
                    <div style={{ 
                        position: 'absolute', 
                        bottom: -6, 
                        right: -6, 
                        background: '#fff', 
                        borderRadius: '50%', 
                        padding: 2,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
                    }}>
                        <SafetyCertificateFilled style={{ color: '#52c41a', fontSize: 20 }} />
                    </div>
                </Tooltip>
            )}
        </div>
    );
}