"use client";

import React, { useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Col,
  ConfigProvider,
  Empty,
  Modal,
  Row,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import {
  ApiOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  SafetyOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

interface ConnectedApp {
  id: string;
  name: string;
  description: string;
  logoEmoji: string;
  color: string;
  authorizedAt: string;
  lastUsed: string;
  scopes: string[];
  verified: boolean;
  isTogetherApp: boolean;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const SCOPE_LABELS: Record<string, { label: string; sensitive: boolean }> = {
  "profile:read":        { label: "View profile",          sensitive: false },
  "email:read":          { label: "View email",            sensitive: true  },
  "communities:read":    { label: "View communities",      sensitive: false },
  "notifications:write": { label: "Send notifications",    sensitive: false },
  "offline_access":      { label: "Stay signed in",        sensitive: true  },
  "profile:write":       { label: "Edit profile",          sensitive: true  },
};

const MOCK_APPS: ConnectedApp[] = [
  {
    id: "app_learn",
    name: "Together We Learn",
    description: "Collaborative learning platform for adults.",
    logoEmoji: "📚",
    color: "#6B4226",
    authorizedAt: "Jan 15, 2025",
    lastUsed: "2 hours ago",
    scopes: ["profile:read", "communities:read", "notifications:write", "offline_access"],
    verified: true,
    isTogetherApp: true,
  },
  {
    id: "app_support",
    name: "Together We Support",
    description: "Mental health and wellbeing resources.",
    logoEmoji: "💙",
    color: "#5E60CE",
    authorizedAt: "Jan 20, 2025",
    lastUsed: "Yesterday",
    scopes: ["profile:read", "email:read", "notifications:write", "offline_access"],
    verified: true,
    isTogetherApp: true,
  },
  {
    id: "app_code",
    name: "Together We Code",
    description: "Dev collaboration and open source.",
    logoEmoji: "💻",
    color: "#2B2D42",
    authorizedAt: "Feb 1, 2025",
    lastUsed: "3 days ago",
    scopes: ["profile:read", "profile:write", "communities:read", "offline_access"],
    verified: true,
    isTogetherApp: true,
  },
  {
    id: "app_ext_1",
    name: "DevSync",
    description: "Third-party developer productivity tool.",
    logoEmoji: "⚙️",
    color: "#457B9D",
    authorizedAt: "Dec 10, 2024",
    lastUsed: "2 weeks ago",
    scopes: ["profile:read", "email:read"],
    verified: false,
    isTogetherApp: false,
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function ConnectedAppsPage() {
  const [apps, setApps] = useState<ConnectedApp[]>(MOCK_APPS);
  const [revoking, setRevoking] = useState<string | null>(null);

  const togetherApps = apps.filter((a) => a.isTogetherApp);
  const thirdPartyApps = apps.filter((a) => !a.isTogetherApp);

  function confirmRevoke(app: ConnectedApp) {
    Modal.confirm({
      title: `Revoke access for ${app.name}?`,
      icon: <ExclamationCircleOutlined style={{ color: "#E76F51" }} />,
      content:
        "This app will immediately lose access to your Together account. Any active sessions in that app may stop working.",
      okText: "Revoke access",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      onOk: async () => {
        setRevoking(app.id);
        await fetch(`/api/oauth/revoke/${app.id}`, { method: "DELETE" });
        setApps((prev) => prev.filter((a) => a.id !== app.id));
        setRevoking(null);
        message.success(`Access revoked for ${app.name}.`);
      },
    });
  }

  return (
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <Title level={4} style={styles.pageTitle}>Connected Apps</Title>
          <Text type="secondary" style={{ display: "block", marginBottom: 28 }}>
            Apps and services that have been authorized to access your Together account.
            Revoke access at any time.
          </Text>

          {/* Together apps */}
          <Title level={5} style={styles.sectionTitle}>
            <SafetyOutlined style={{ marginRight: 8, color: "#2D6A4F" }} />
            Together Communities
          </Title>
          <Paragraph type="secondary" style={{ fontSize: 13, marginBottom: 16 }}>
            Official Together apps you&apos;ve joined. These are verified and managed by Together.
          </Paragraph>

          {togetherApps.length === 0 ? (
            <Card style={styles.card} bordered={false}>
              <Empty description="No Together apps connected yet." />
            </Card>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
              {togetherApps.map((app) => (
                <AppCard key={app.id} app={app} onRevoke={confirmRevoke} revoking={revoking === app.id} />
              ))}
            </div>
          )}

          {/* Third-party apps */}
          <Title level={5} style={styles.sectionTitle}>
            <ApiOutlined style={{ marginRight: 8, color: "#888" }} />
            Third-party Apps
          </Title>
          <Paragraph type="secondary" style={{ fontSize: 13, marginBottom: 16 }}>
            External apps that have been granted access. Review their permissions carefully.
          </Paragraph>

          {thirdPartyApps.length === 0 ? (
            <Card style={styles.card} bordered={false}>
              <Empty description="No third-party apps connected." />
            </Card>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {thirdPartyApps.map((app) => (
                <AppCard key={app.id} app={app} onRevoke={confirmRevoke} revoking={revoking === app.id} />
              ))}
            </div>
          )}

          {/* Info box */}
          <Card style={{ ...styles.card, marginTop: 24, background: "#F0FAF4", border: "1px solid #B7E4C7" }} bordered={false}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <SafetyOutlined style={{ color: "#2D6A4F", fontSize: 20, marginTop: 2 }} />
              <div>
                <Text strong style={{ display: "block", marginBottom: 4 }}>About app permissions</Text>
                <Paragraph type="secondary" style={{ margin: 0, fontSize: 13 }}>
                  Apps can only access data within the permissions you granted. Together never shares your password with third-party apps. Revoking access will sign you out of that app and delete any stored access tokens.
                </Paragraph>
              </div>
            </div>
          </Card>
        </div>
  );
}

// ─── AppCard ──────────────────────────────────────────────────────────────────

function AppCard({
  app,
  onRevoke,
  revoking,
}: {
  app: ConnectedApp;
  onRevoke: (a: ConnectedApp) => void;
  revoking: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card style={cardStyles.card} bordered={false}>
      <div style={cardStyles.header}>
        {/* Identity */}
        <div style={cardStyles.identity}>
          <Avatar
            size={44}
            style={{ background: `${app.color}22`, fontSize: 22, flexShrink: 0 }}
          >
            {app.logoEmoji}
          </Avatar>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
              <Text strong style={{ fontSize: 15 }}>{app.name}</Text>
              {app.verified && (
                <Tooltip title="Verified Together app">
                  <Tag icon={<SafetyOutlined />} color="success" style={{ fontSize: 11 }}>
                    Verified
                  </Tag>
                </Tooltip>
              )}
            </div>
            <Text type="secondary" style={{ fontSize: 13 }}>{app.description}</Text>
          </div>
        </div>

        {/* Actions */}
        <div style={cardStyles.actions}>
          <Button
            type="text"
            size="small"
            onClick={() => setExpanded((v) => !v)}
            style={{ color: "#888", fontSize: 13 }}
          >
            {expanded ? "Hide" : "Details"}
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            size="small"
            loading={revoking}
            onClick={() => onRevoke(app)}
          >
            Revoke
          </Button>
        </div>
      </div>

      {/* Metadata */}
      <div style={cardStyles.meta}>
        <span>
          <ClockCircleOutlined style={{ marginRight: 4 }} />
          Last used: {app.lastUsed}
        </span>
        <span>Authorized: {app.authorizedAt}</span>
      </div>

      {/* Expanded permissions */}
      {expanded && (
        <div style={cardStyles.permissions}>
          <Text strong style={{ display: "block", marginBottom: 8, fontSize: 13 }}>
            Granted permissions:
          </Text>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {app.scopes.map((scope) => {
              const info = SCOPE_LABELS[scope] ?? { label: scope, sensitive: false };
              return (
                <Tag
                  key={scope}
                  color={info.sensitive ? "orange" : "default"}
                  style={{ fontSize: 12 }}
                >
                  {info.label}
                  {info.sensitive && " ⚠"}
                </Tag>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}

const styles: Record<string, React.CSSProperties> = {
  pageTitle: { margin: "0 0 4px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700 },
  sectionTitle: { marginBottom: 4, fontFamily: "'DM Sans', sans-serif" },
  card: { borderRadius: 14, boxShadow: "0 1px 6px rgba(0,0,0,0.06)" },
};

const cardStyles: Record<string, React.CSSProperties> = {
  card: { borderRadius: 14, boxShadow: "0 1px 6px rgba(0,0,0,0.06)" },
  header: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 },
  identity: { display: "flex", alignItems: "flex-start", gap: 14, flex: 1 },
  actions: { display: "flex", gap: 8, flexShrink: 0 },
  meta: { display: "flex", gap: 16, marginTop: 12, fontSize: 12, color: "#aaa" },
  permissions: { marginTop: 14, paddingTop: 14, borderTop: "1px solid #F0EDE6" },
};