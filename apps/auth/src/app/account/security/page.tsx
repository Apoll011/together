"use client";

import React, { useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  ConfigProvider,
  Divider,
  Form,
  Input,
  Modal,
  Progress,
  QRCode,
  Switch,
  Table,
  Tag,
  Timeline,
  Tooltip,
  Typography,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DesktopOutlined,
  ExclamationCircleOutlined,
  KeyOutlined,
  LockOutlined,
  MobileOutlined,
  SafetyCertificateOutlined,
  SafetyOutlined,
  WarningOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

// ─── Types ────────────────────────────────────────────────────────────────────

interface ActiveSession {
  id: string;
  device: string;
  os: string;
  browser: string;
  ip: string;
  location: string;
  lastSeen: string;
  isCurrent: boolean;
  deviceType: "desktop" | "mobile";
}

interface SecurityEvent {
  id: string;
  event: string;
  detail: string;
  timestamp: string;
  type: "success" | "warning" | "error";
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_SESSIONS: ActiveSession[] = [
  { id: "s1", device: "MacBook Pro", os: "macOS 14", browser: "Chrome 122", ip: "189.20.x.x", location: "São Paulo, BR", lastSeen: "Now", isCurrent: true,  deviceType: "desktop" },
  { id: "s2", device: "iPhone 15",   os: "iOS 17",   browser: "Safari",      ip: "189.20.x.x", location: "São Paulo, BR", lastSeen: "2h ago", isCurrent: false, deviceType: "mobile"  },
  { id: "s3", device: "Windows PC",  os: "Windows 11", browser: "Edge 121",  ip: "200.10.x.x", location: "Brasília, BR", lastSeen: "3d ago", isCurrent: false, deviceType: "desktop" },
];

const MOCK_EVENTS: SecurityEvent[] = [
  { id: "e1", event: "Successful login",         detail: "Chrome on macOS · São Paulo",      timestamp: "Just now",       type: "success" },
  { id: "e2", event: "Password changed",          detail: "Via account settings",             timestamp: "7 days ago",     type: "warning" },
  { id: "e3", event: "App authorized",            detail: "Together We Learn",                timestamp: "12 days ago",    type: "success" },
  { id: "e4", event: "Failed login attempt",      detail: "Unknown device · Rio de Janeiro",  timestamp: "14 days ago",    type: "error"   },
  { id: "e5", event: "New device signed in",      detail: "iPhone 15 · Safari",               timestamp: "20 days ago",    type: "warning" },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function SecurityPage() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [sessions, setSessions] = useState<ActiveSession[]>(MOCK_SESSIONS);
  const [revokeAllLoading, setRevokeAllLoading] = useState(false);
  const [changePwLoading, setChangePwLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  // ── Password strength ──────────────────────────────────────────────────────

  function pwScore(pw: string) {
    let s = 0;
    if (pw.length >= 8)  s++;
    if (pw.length >= 12) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    const map = [
      { label: "Too short",    color: "#E76F51" },
      { label: "Weak",         color: "#E76F51" },
      { label: "Fair",         color: "#F4A261" },
      { label: "Good",         color: "#52B788" },
      { label: "Strong",       color: "#2D6A4F" },
      { label: "Very strong",  color: "#1B4332" },
    ];
    return { score: s, ...map[Math.min(s, 5)] };
  }

  const pwStrength = pwScore(newPassword);

  // ── Handlers ──────────────────────────────────────────────────────────────

  async function handleChangePassword(values: { currentPassword: string; newPassword: string }) {
    setChangePwLoading(true);
    try {
      await fetch("/api/account/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      message.success("Password updated successfully!");
    } catch {
      message.error("Failed to update password.");
    } finally {
      setChangePwLoading(false);
    }
  }

  function revokeSession(id: string) {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    message.success("Session revoked.");
  }

  async function revokeAllOther() {
    setRevokeAllLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setSessions((prev) => prev.filter((s) => s.isCurrent));
    setRevokeAllLoading(false);
    message.success("All other sessions revoked.");
  }

  function enable2FA() {
    setTwoFactorEnabled(true);
    setShow2FAModal(false);
    message.success("Two-factor authentication enabled!");
  }

  // ── Session columns ────────────────────────────────────────────────────────

  const sessionColumns: ColumnsType<ActiveSession> = [
    {
      title: "Device",
      dataIndex: "device",
      render: (_, r) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {r.deviceType === "mobile"
            ? <MobileOutlined style={{ fontSize: 20, color: "#888" }} />
            : <DesktopOutlined style={{ fontSize: 20, color: "#888" }} />
          }
          <div>
            <Text strong style={{ display: "block", fontSize: 14 }}>{r.device}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{r.os} · {r.browser}</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Location",
      dataIndex: "location",
      render: (loc, r) => (
        <div>
          <Text style={{ fontSize: 13 }}>{loc}</Text>
          <Text type="secondary" style={{ display: "block", fontSize: 12 }}>{r.ip}</Text>
        </div>
      ),
    },
    {
      title: "Last seen",
      dataIndex: "lastSeen",
      render: (v, r) => (
        <div>
          <Text style={{ fontSize: 13 }}>{v}</Text>
          {r.isCurrent && <Tag color="green" style={{ marginLeft: 8, fontSize: 11 }}>Current</Tag>}
        </div>
      ),
    },
    {
      title: "",
      key: "action",
      render: (_, r) =>
        r.isCurrent ? null : (
          <Button danger type="text" size="small" onClick={() => revokeSession(r.id)}>
            Revoke
          </Button>
        ),
    },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <Title level={4} style={styles.pageTitle}>Security</Title>
          <Text type="secondary" style={{ display: "block", marginBottom: 28 }}>
            Manage your password, two-factor authentication, and active sessions.
          </Text>

          {/* Security score */}
          <Card style={styles.card} bordered={false}>
            <div style={styles.scoreRow}>
              <div>
                <Title level={5} style={{ margin: 0 }}>Security score</Title>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  {twoFactorEnabled ? "Your account is well protected." : "Enable 2FA to improve your score."}
                </Text>
              </div>
              <div style={{ textAlign: "right" }}>
                <Text strong style={{ fontSize: 28, color: twoFactorEnabled ? "#2D6A4F" : "#F4A261" }}>
                  {twoFactorEnabled ? "90" : "55"}
                  <Text type="secondary" style={{ fontSize: 16 }}>/100</Text>
                </Text>
              </div>
            </div>
            <Progress
              percent={twoFactorEnabled ? 90 : 55}
              strokeColor={twoFactorEnabled ? { "0%": "#52B788", "100%": "#2D6A4F" } : { "0%": "#F4A261", "100%": "#E76F51" }}
              showInfo={false}
              style={{ marginTop: 12 }}
            />
            <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
              <Tag icon={<CheckCircleOutlined />} color="success">Strong password</Tag>
              <Tag icon={<CheckCircleOutlined />} color="success">Email verified</Tag>
              {twoFactorEnabled
                ? <Tag icon={<CheckCircleOutlined />} color="success">2FA enabled</Tag>
                : <Tag icon={<ExclamationCircleOutlined />} color="warning">2FA not set up</Tag>
              }
            </div>
          </Card>

          {/* Change password */}
          <Card style={styles.card} bordered={false}>
            <Title level={5} style={styles.sectionTitle}>
              <LockOutlined style={{ marginRight: 8, color: "#2D6A4F" }} />
              Change password
            </Title>
            <Form layout="vertical" onFinish={handleChangePassword} requiredMark={false}>
              <Form.Item
                label="Current password"
                name="currentPassword"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input.Password placeholder="••••••••" autoComplete="current-password" />
              </Form.Item>
              <Form.Item
                label="New password"
                name="newPassword"
                rules={[{ required: true, message: "Required" }, { min: 8, message: "At least 8 characters" }]}
              >
                <Input.Password
                  placeholder="Create a strong new password"
                  autoComplete="new-password"
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Form.Item>
              {newPassword.length > 0 && (
                <div style={{ marginTop: -12, marginBottom: 16 }}>
                  <Progress percent={(pwStrength.score / 5) * 100} showInfo={false} strokeColor={pwStrength.color} size="small" />
                  <Text style={{ fontSize: 12, color: pwStrength.color }}>{pwStrength.label}</Text>
                </div>
              )}
              <Form.Item
                label="Confirm new password"
                name="confirmPassword"
                dependencies={["newPassword"]}
                rules={[
                  { required: true, message: "Required" },
                  ({ getFieldValue }) => ({
                    validator(_, v) {
                      if (!v || getFieldValue("newPassword") === v) return Promise.resolve();
                      return Promise.reject(new Error("Passwords don't match"));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Repeat new password" autoComplete="new-password" />
              </Form.Item>
              <Button type="primary" htmlType="submit" loading={changePwLoading} style={styles.saveBtn}>
                Update password
              </Button>
            </Form>
          </Card>

          {/* 2FA */}
          <Card style={styles.card} bordered={false}>
            <div style={styles.twoFaRow}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <SafetyCertificateOutlined style={{ fontSize: 24, color: twoFactorEnabled ? "#2D6A4F" : "#888", marginTop: 2 }} />
                <div>
                  <Title level={5} style={{ margin: "0 0 4px" }}>Two-factor authentication</Title>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    {twoFactorEnabled
                      ? "2FA is active. Your account is protected with an authenticator app."
                      : "Add an extra layer of security by requiring a code from your authenticator app on sign-in."}
                  </Text>
                </div>
              </div>
              <Switch
                checked={twoFactorEnabled}
                onChange={(v) => { if (v) setShow2FAModal(true); else setTwoFactorEnabled(false); }}
                style={{ flexShrink: 0 }}
              />
            </div>

            {twoFactorEnabled && (
              <>
                <Divider />
                <div style={{ display: "flex", gap: 12 }}>
                  <Button icon={<KeyOutlined />} onClick={() => message.info("Backup codes shown here.")}>
                    View backup codes
                  </Button>
                  <Button danger onClick={() => setTwoFactorEnabled(false)}>
                    Disable 2FA
                  </Button>
                </div>
              </>
            )}
          </Card>

          {/* Active sessions */}
          <Card style={styles.card} bordered={false}>
            <div style={styles.sessionHeader}>
              <div>
                <Title level={5} style={{ margin: "0 0 2px" }}>Active sessions</Title>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  {sessions.length} device{sessions.length !== 1 ? "s" : ""} currently signed in
                </Text>
              </div>
              {sessions.length > 1 && (
                <Button danger loading={revokeAllLoading} onClick={revokeAllOther} size="small">
                  Revoke all others
                </Button>
              )}
            </div>
            <Table
              dataSource={sessions}
              columns={sessionColumns}
              rowKey="id"
              pagination={false}
              size="small"
              style={{ marginTop: 16 }}
            />
          </Card>

          {/* Security log */}
          <Card style={styles.card} bordered={false}>
            <Title level={5} style={styles.sectionTitle}>Recent security activity</Title>
            <Timeline
              items={MOCK_EVENTS.map((e) => ({
                color: e.type === "success" ? "green" : e.type === "error" ? "red" : "orange",
                dot:
                  e.type === "error" ? <CloseCircleOutlined style={{ color: "#E76F51" }} />
                  : e.type === "warning" ? <WarningOutlined style={{ color: "#F4A261" }} />
                  : <CheckCircleOutlined style={{ color: "#52B788" }} />,
                children: (
                  <div>
                    <Text strong style={{ display: "block", fontSize: 14 }}>{e.event}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>{e.detail} · {e.timestamp}</Text>
                  </div>
                ),
              }))}
            />
          </Card>
        </div>

        {/* 2FA Setup Modal */}
        <Modal
          open={show2FAModal}
          onCancel={() => setShow2FAModal(false)}
          footer={null}
          title="Set up two-factor authentication"
          centered
        >
          <Paragraph type="secondary">
            Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.),
            then enter the 6-digit code to confirm.
          </Paragraph>

          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <QRCode
              value="otpauth://totp/Together:janedoe?secret=JBSWY3DPEHPK3PXP&issuer=Together"
              size={160}
              style={{ margin: "0 auto" }}
            />
            <Text
              copyable
              code
              style={{ display: "block", marginTop: 16, fontSize: 13, letterSpacing: 2 }}
            >
              JBSW Y3DP EHPK 3PXP
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Or enter this key manually into your app
            </Text>
          </div>

          <Form onFinish={enable2FA}>
            <Form.Item
              name="totpCode"
              rules={[
                { required: true, message: "Enter the 6-digit code" },
                { len: 6, message: "Must be exactly 6 digits" },
                { pattern: /^[0-9]+$/, message: "Digits only" },
              ]}
            >
              <Input
                placeholder="000 000"
                maxLength={6}
                size="large"
                style={{ textAlign: "center", letterSpacing: 8, fontSize: 20, fontWeight: 700 }}
              />
            </Form.Item>
            <Button type="primary" htmlType="submit" block size="large" style={styles.saveBtn}>
              Verify and enable 2FA
            </Button>
          </Form>
        </Modal>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  pageTitle: { margin: "0 0 4px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700 },
  card: { borderRadius: 16, boxShadow: "0 1px 8px rgba(0,0,0,0.06)", marginBottom: 20 },
  sectionTitle: { marginBottom: 16, fontFamily: "'DM Sans', sans-serif" },
  scoreRow: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 },
  twoFaRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 },
  sessionHeader: { display: "flex", alignItems: "flex-start", justifyContent: "space-between" },
  saveBtn: {
    height: 40,
    paddingInline: 20,
    fontWeight: 600,
    background: "linear-gradient(135deg, #2D6A4F, #40916C)",
    border: "none",
    boxShadow: "0 3px 10px rgba(45,106,79,0.2)",
  },
};