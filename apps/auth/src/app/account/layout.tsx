"use client";

import React from "react";
import { Avatar, Badge, Button, Layout, Menu, Tooltip, Typography } from "antd";
import {
  AppstoreOutlined,
  BellOutlined,
  LogoutOutlined,
  SafetyOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeKey?: string;
}

/**
 * Shared layout wrapper for all authenticated pages.
 * Includes the persistent sidebar and top header.
 */
export default function DashboardLayout({ children, activeKey = "dashboard" }: DashboardLayoutProps) {
  return (
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
          selectedKeys={[activeKey]}
          style={{ background: "transparent", border: "none", color: "#D8F3DC" }}
          theme="dark"
          items={[
            {
              key: "dashboard",
              icon: <AppstoreOutlined />,
              label: <Link href="/dashboard">Dashboard</Link>,
            },
            {
              key: "profile",
              icon: <UserOutlined />,
              label: <Link href="/profile">Profile</Link>,
            },
            {
              key: "apps",
              icon: <TeamOutlined />,
              label: <Link href="/connected-apps">Connected Apps</Link>,
            },
            {
              key: "security",
              icon: <SafetyOutlined />,
              label: <Link href="/security">Security</Link>,
            },
            {
              key: "settings",
              icon: <SettingOutlined />,
              label: <Link href="/settings">Settings</Link>,
            },
          ]}
        />

        <div style={styles.siderFooter}>
          <Link href="/api/auth/logout" style={styles.logoutLink}>
            <LogoutOutlined style={{ marginRight: 8 }} />
            Sign out
          </Link>
        </div>
      </Sider>

      {/* Main area */}
      <Layout>
        <Header style={styles.header}>
          <div />
          <div style={styles.headerRight}>
            <Tooltip title="Notifications">
              <Badge count={3} size="small">
                <Button type="text" icon={<BellOutlined />} style={styles.headerBtn} />
              </Badge>
            </Tooltip>
            <Tooltip title="Your profile">
              <Link href="/profile">
                <Avatar
                  size={36}
                  icon={<UserOutlined />}
                  style={{ cursor: "pointer", background: "#B7E4C7" }}
                />
              </Link>
            </Tooltip>
          </div>
        </Header>

        <Content style={styles.content}>{children}</Content>
      </Layout>
    </Layout>
  );
}

const styles: Record<string, React.CSSProperties> = {
  layout: {
    minHeight: "100vh",
    fontFamily: "'DM Sans', sans-serif",
  },
  sider: {
    background: "linear-gradient(180deg, #1B4332 0%, #2D6A4F 100%)",
    position: "sticky",
    top: 0,
    height: "100vh",
    overflow: "auto",
    flexShrink: 0,
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
  logoutLink: {
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
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
  },
  content: {
    padding: "32px 28px",
    background: "#F8F7F4",
    minHeight: "calc(100vh - 64px)",
  },
};