"use client";

import React from "react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  ConfigProvider,
  Layout,
  Menu,
  Row,
  Statistic,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import {
  AppstoreOutlined,
  BellOutlined,
  LockOutlined,
  LogoutOutlined,
  SafetyOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { TOGETHER_APPS, togetherTheme } from "@/lib/together/theme";

const { Header, Sider, Content } = Layout;
const { Title, Text, Paragraph } = Typography;

// ─── Mock session type ────────────────────────────────────────────────────────
// Replace with your actual session/auth hook (e.g. next-auth useSession)

interface UserSession {
  user: {
    id: string;
    name: string;
    username: string;
    email: string;
    avatarUrl?: string;
    joinedAt: string;
    connectedApps: string[];
    twoFactorEnabled: boolean;
    activeSessions: number;
  };
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function DashboardPage() {
  // Replace with real session data
  const session: UserSession = {
    user: {
      id: "usr_01",
      name: "Jane Doe",
      username: "janedoe",
      email: "jane@example.com",
      avatarUrl: undefined,
      joinedAt: "February 2025",
      connectedApps: ["learn", "support", "transform", "code"],
      twoFactorEnabled: false,
      activeSessions: 2,
    },
  };

  const { user } = session;

  const connectedSet = new Set(user.connectedApps);
  const connectedAppDefs = TOGETHER_APPS.filter((a) => connectedSet.has(a.key));
  const suggestedApps = TOGETHER_APPS.filter((a) => !connectedSet.has(a.key)).slice(0, 4);

  return (
    <ConfigProvider theme={togetherTheme}>
      <Layout style={styles.layout}>
        {/* Sidebar */}
        <Sider
          width={240}
          style={styles.sider}
          breakpoint="lg"
          collapsedWidth={0}
        >
          <div style={styles.siderBrand}>
            <div style={styles.siderLogo}>T</div>
            <Text strong style={{ color: "#fff", fontSize: 16 }}>Together</Text>
          </div>

          <Menu
            mode="inline"
            defaultSelectedKeys={["dashboard"]}
            style={{ background: "transparent", border: "none", color: "#D8F3DC" }}
            theme="dark"
            items={[
              { key: "dashboard", icon: <AppstoreOutlined />, label: <Link href="/dashboard">Dashboard</Link> },
              { key: "profile",   icon: <UserOutlined />,       label: <Link href="/profile">Profile</Link> },
              { key: "apps",      icon: <TeamOutlined />,        label: <Link href="/connected-apps">Connected Apps</Link> },
              { key: "security",  icon: <SafetyOutlined />,      label: <Link href="/security">Security</Link> },
              { key: "settings",  icon: <SettingOutlined />,     label: <Link href="/settings">Settings</Link> },
            ]}
          />

          <div style={styles.siderFooter}>
            <Link href="/api/auth/logout" style={styles.logoutBtn}>
              <LogoutOutlined style={{ marginRight: 8 }} />
              Sign out
            </Link>
          </div>
        </Sider>

        {/* Main */}
        <Layout>
          <Header style={styles.header}>
            <div />
            <div style={styles.headerRight}>
              <Tooltip title="Notifications">
                <Badge count={3} size="small">
                  <Button type="text" icon={<BellOutlined />} style={styles.headerBtn} />
                </Badge>
              </Tooltip>
              <Avatar
                size={36}
                src={user.avatarUrl}
                icon={<UserOutlined />}
                style={{ cursor: "pointer", background: "#B7E4C7" }}
              />
            </div>
          </Header>

          <Content style={styles.content}>
            {/* Welcome banner */}
            <div style={styles.welcomeBanner}>
              <div>
                <Title level={3} style={styles.welcomeTitle}>
                  Welcome back, {user.name.split(" ")[0]} 👋
                </Title>
                <Text style={{ color: "#A8D5B5", fontSize: 15 }}>
                  @{user.username} · Member since {user.joinedAt}
                </Text>
              </div>
              <Avatar
                size={64}
                src={user.avatarUrl}
                icon={<UserOutlined />}
                style={{ border: "3px solid rgba(255,255,255,0.3)", flexShrink: 0 }}
              />
            </div>

            {/* Stats */}
            <Row gutter={[16, 16]} style={{ marginBottom: 28 }}>
              {[
                { title: "Connected Apps", value: user.connectedApps.length, suffix: `/ ${TOGETHER_APPS.length}`, color: "#2D6A4F" },
                { title: "Active Sessions", value: user.activeSessions, color: "#457B9D" },
                { title: "2FA", value: user.twoFactorEnabled ? "Enabled" : "Disabled", color: user.twoFactorEnabled ? "#52B788" : "#E76F51", isString: true },
              ].map((stat) => (
                <Col xs={24} sm={8} key={stat.title}>
                  <Card style={styles.statCard} bordered={false}>
                    <Statistic
                      title={stat.title}
                      value={stat.value}
                      suffix={stat.suffix}
                      valueStyle={{ color: stat.color, fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}
                    />
                    {!stat.twoFactorEnabled && stat.title === "2FA" && (
                      <Link href="/security" style={{ fontSize: 12, color: "#E76F51" }}>
                        Enable now →
                      </Link>
                    )}
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Security alert if 2FA off */}
            {!user.twoFactorEnabled && (
              <Card style={styles.alertCard} bordered={false}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <LockOutlined style={{ fontSize: 22, color: "#E76F51" }} />
                  <div style={{ flex: 1 }}>
                    <Text strong style={{ display: "block" }}>
                      Protect your account with two-factor authentication
                    </Text>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      Adding 2FA makes your Together account significantly more secure.
                    </Text>
                  </div>
                  <Link href="/security">
                    <Button type="primary" danger style={{ borderRadius: 10 }}>
                      Enable 2FA
                    </Button>
                  </Link>
                </div>
              </Card>
            )}

            {/* My apps */}
            <Title level={5} style={styles.sectionTitle}>My Communities</Title>
            {connectedAppDefs.length === 0 ? (
              <Paragraph type="secondary">No apps connected yet. Explore below.</Paragraph>
            ) : (
              <Row gutter={[12, 12]} style={{ marginBottom: 28 }}>
                {connectedAppDefs.map((app) => (
                  <Col xs={12} sm={8} md={6} key={app.key}>
                    <Card
                      hoverable
                      style={{ ...styles.appCard, borderColor: `${app.color}33` }}
                      bordered
                    >
                      <div style={{ fontSize: 28, marginBottom: 6 }}>{app.emoji}</div>
                      <Text strong style={{ fontSize: 13, display: "block" }}>
                        {app.label.replace("Together We ", "")}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 11 }}>{app.desc}</Text>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}

            {/* Discover */}
            <Title level={5} style={styles.sectionTitle}>Discover More</Title>
            <Row gutter={[12, 12]}>
              {suggestedApps.map((app) => (
                <Col xs={12} sm={8} md={6} key={app.key}>
                  <Card
                    hoverable
                    style={{ ...styles.appCard, opacity: 0.8 }}
                    bordered={false}
                    extra={
                      <Tag color={app.color} style={{ fontSize: 11 }}>
                        Join
                      </Tag>
                    }
                  >
                    <div style={{ fontSize: 28, marginBottom: 6 }}>{app.emoji}</div>
                    <Text strong style={{ fontSize: 13, display: "block" }}>
                      {app.label.replace("Together We ", "")}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>{app.desc}</Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

const styles: Record<string, React.CSSProperties> = {
  layout: { minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" },
  sider: {
    background: "linear-gradient(180deg, #1B4332 0%, #2D6A4F 100%)",
    position: "sticky",
    top: 0,
    height: "100vh",
    overflow: "auto",
    boxShadow: "2px 0 12px rgba(0,0,0,0.12)",
  },
  siderBrand: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "20px 20px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    marginBottom: 8,
  },
  siderLogo: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: "rgba(255,255,255,0.15)",
    color: "#fff",
    fontWeight: 700,
    fontSize: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  siderFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "16px 20px",
    borderTop: "1px solid rgba(255,255,255,0.1)",
  },
  logoutBtn: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
  },
  header: {
    background: "#fff",
    padding: "0 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid #F0EDE6",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  headerRight: { display: "flex", alignItems: "center", gap: 12 },
  headerBtn: { width: 36, height: 36, borderRadius: 10 },
  content: { padding: "28px 24px", background: "#F8F7F4", minHeight: "calc(100vh - 64px)" },
  welcomeBanner: {
    background: "linear-gradient(135deg, #2D6A4F, #40916C)",
    borderRadius: 16,
    padding: "24px 28px",
    marginBottom: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  welcomeTitle: {
    color: "#fff",
    margin: "0 0 4px",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 700,
  },
  statCard: { borderRadius: 14, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" },
  alertCard: {
    borderRadius: 14,
    border: "1.5px solid #FECACA",
    background: "#FFF8F6",
    marginBottom: 28,
  },
  sectionTitle: {
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 700,
    marginBottom: 14,
    color: "#1A2E1A",
  },
  appCard: {
    borderRadius: 12,
    textAlign: "left",
    boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
  },
};