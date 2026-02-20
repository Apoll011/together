"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  Drawer,
  Dropdown,
  Space,
  Typography,
  Grid,
  Tag,
  Divider,
} from "antd";
import type { MenuProps } from "antd";
import {
  DownOutlined,
  MenuOutlined,
  CloseOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useTheme } from "@repo/ui/ThemeContext";
import { appsData } from "@repo/together-apps/data";
import { ToggleTheme } from "./theme-toggle";

import Image from "next/image";
import logo from "../static/logov2.png";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

const { useBreakpoint } = Grid;
const { Text } = Typography;

interface AppItem {
  key: string;
  label: string;
  description: string;
  color: string;
  icon: string;
  tag?: string;
}

interface NavbarProps {
  variant?: "default" | "transparent";
}

const apps: AppItem[] = appsData.map(
  (app) =>
    ({
      key: app.key,
      label: app.label,
      description: app.tagline,
      color: app.color,
      icon: app.icon,
      tag: app.isNew ? "New" : undefined,
    }) as AppItem,
);

const communityItems: MenuProps["items"] = [
  { key: "forum", label: <Link href="#">Forum</Link> },
  { key: "events", label: <Link href="#">Events</Link> },
  { key: "blog", label: <Link href="#">Blog</Link> },
];

const MegaMenuOverlay: React.FC = () => {
  const { colors } = useTheme();

  return (
    <div
      style={{
        width: 680,
        background: colors.footerBg === "#0A0F1E" ? "#fff" : "#1b1b1b",
        borderRadius: 12,
        boxShadow: "0 8px 24px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)",
        padding: "24px 24px 16px",
        border:
          colors.footerBg === "#0A0F1E"
            ? "1px solid rgba(0,0,0,0.06)"
            : "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <Text
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#8c8c8c",
          display: "block",
          marginBottom: 16,
        }}
      >
        Together Ecosystem
      </Text>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
        }}
      >
        {apps.map((app) => (
          <Link
            key={app.key}
            onClick={() => {}}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 12px",
              borderRadius: 8,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              textAlign: "left",
              transition: "background 0.15s",
              width: "100%",
            }}
            onMouseEnter={(e) => {
              const bg =
                colors.footerBg === "#0A0F1E"
                  ? "#f5f5f5"
                  : "rgba(255,255,255,0.08)";
              e.currentTarget.style.background = bg;
            }}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
            href={`/apps/${app.key}`}
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
                <Text strong style={{ fontSize: 14, color: colors.navText }}>
                  Together We {app.label}
                </Text>
                {app.tag && (
                  <Tag
                    color="blue"
                    style={{
                      fontSize: 10,
                      lineHeight: "16px",
                      padding: "0 5px",
                    }}
                  >
                    {app.tag}
                  </Tag>
                )}
              </div>
              <Text
                style={{
                  fontSize: 12,
                  color: colors.navSubText,
                  display: "block",
                }}
              >
                {app.description}
              </Text>
            </div>
          </Link>
        ))}
      </div>

      <Divider style={{ margin: "16px 0 12px" }} />

      <div style={{ textAlign: "right" }}>
        <Button type="link" style={{ padding: 0, fontWeight: 600 }}>
          View all apps <ArrowRightOutlined />
        </Button>
      </div>
    </div>
  );
};

const MobileNav: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { colors, mode } = useTheme();
  const isDark = mode === "dark";
  const router = useRouter();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Button
        onClick={() => router.push("/")}
        type="text"
        style={{ textAlign: "left", height: 44, fontWeight: 500 }}
      >
        Home
      </Button>

      {/* Apps section */}
      <div>
        <Text
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#8c8c8c",
            display: "block",
            padding: "12px 12px 8px",
          }}
        >
          Our Apps
        </Text>
        {apps.map((app) => (
          <Button
            key={app.key}
            type="text"
            block
            onClick={() => router.push(`/apps/${app.key}`)}
            style={{
              textAlign: "left",
              height: 44,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
            icon={
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 7,
                  background: `${app.color}18`,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                }}
              >
                {app.icon}
              </span>
            }
          >
            Together We {app.label}
          </Button>
        ))}
      </div>

      {/* Community */}
      <div>
        <Text
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#8c8c8c",
            display: "block",
            padding: "12px 12px 8px",
          }}
        >
          Community
        </Text>
        {["Forum", "Events", "Blog"].map((label) => (
          <Button
            key={label}
            type="text"
            block
            style={{ textAlign: "left", height: 44 }}
          >
            {label}
          </Button>
        ))}
      </div>

      <Button
        type="text"
        block
        onClick={() => router.push("/about")}
        style={{ textAlign: "left", height: 44, fontWeight: 500 }}
      >
        About
      </Button>

      <Divider style={{ margin: "8px 0" }} />

      <Space orientation="vertical" style={{ width: "100%" }}>
         <SignedOut>
              <SignInButton />
              <SignUpButton>
                <Button
                  block
                  ghost={isDark}
                  style={{
                    borderColor: "rgba(255,255,255,0.2)",
                    height: 56,
                    padding: "0 40px",
                    fontSize: 16,
                  }}
                >
                  Sign Up
                </Button>
              </SignUpButton>
        </SignedOut>
        <SignedIn>
            <UserButton />
        </SignedIn>
        <Button type="primary" block icon={<ArrowRightOutlined />}>
          Get Started
        </Button>
      </Space>
    </div>
  );
};

export const Navbar: React.FC<NavbarProps> = ({ variant = "default" }) => {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const screens = useBreakpoint();
  const isMobile = !screens.lg;
  const { colors, mode } = useTheme();
  const router = useRouter();

  const isTransparent = variant === "transparent" && !scrolled;
  const isDark = mode === "dark";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navBg = isTransparent
    ? "transparent"
    : scrolled
      ? colors.navBg
      : colors.navBg;

  const navBorderBottom = isTransparent
    ? "1px solid rgba(255,255,255,0.12)"
    : scrolled
      ? colors.navBorderScrolled
      : colors.navBorder;

  const navBoxShadow = scrolled && !isTransparent ? colors.navShadow : "none";

  const textColor = isTransparent ? "rgba(255,255,255,0.9)" : colors.navText;
  const subTextColor = isTransparent
    ? "rgba(255,255,255,0.65)"
    : colors.navSubText;

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: navBg,
          borderBottom: navBorderBottom,
          boxShadow: navBoxShadow,
          backdropFilter: scrolled ? "blur(12px)" : "none",
          transition:
            "background 0.3s, box-shadow 0.3s, border-color 0.3s, backdrop-filter 0.3s",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 24px",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 32,
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: "relative",
                width: 44,
                height: 44,
                borderRadius: 12,
                overflow: "hidden",
                background: isTransparent
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.04)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                src={logo}
                alt="Together Logo"
                fill={true}
                style={{
                  objectFit: "contain",
                }}
                priority
              />
            </div>

            <span
              style={{
                fontWeight: 700,
                fontSize: 18,
                color: textColor,
                letterSpacing: "-0.02em",
                transition: "color 0.3s",
              }}
            >
              Together
              <span
                style={{
                  color: isTransparent
                    ? "rgba(255,255,255,0.5)"
                    : colors.accentText,
                }}
              >
                .
              </span>
            </span>
          </Link>

          {/* ── Desktop nav ── */}
          {!isMobile && (
            <Space size={4} style={{ flex: 1, justifyContent: "center" }}>
              {/* Home */}
              <Button
                onClick={() => router.push("/")}
                type="text"
                style={{ color: textColor, fontWeight: 500, height: 40 }}
              >
                Home
              </Button>

              {/* Our Apps — mega dropdown */}
              <Dropdown
                popupRender={() => <MegaMenuOverlay />}
                placement="bottom"
                arrow={false}
                trigger={["hover"]}
              >
                <Button
                  type="text"
                  style={{ color: textColor, fontWeight: 500, height: 40 }}
                >
                  <Space size={4}>
                    Our Apps
                    <DownOutlined style={{ fontSize: 11, opacity: 0.6 }} />
                  </Space>
                </Button>
              </Dropdown>

              {/* Community — simple dropdown */}
              <Dropdown
                menu={{ items: communityItems }}
                placement="bottom"
                trigger={["hover"]}
              >
                <Button
                  type="text"
                  style={{ color: textColor, fontWeight: 500, height: 40 }}
                >
                  <Space size={4}>
                    Community
                    <DownOutlined style={{ fontSize: 11, opacity: 0.6 }} />
                  </Space>
                </Button>
              </Dropdown>

              {/* About */}
              <Button
                onClick={() => router.push("/about")}
                type="text"
                style={{ color: textColor, fontWeight: 500, height: 40 }}
              >
                About
              </Button>
            </Space>
          )}

          {/* ── Desktop actions ── */}
          {!isMobile && (
            <Space size={8} style={{ flexShrink: 0 }}>
              {/* Theme Toggle */}
              <ToggleTheme />

              
            <SignedOut>
              <SignInButton>
                <Button
                ghost={isTransparent || isDark}
                style={
                  isTransparent || isDark
                    ? {
                        borderColor: isTransparent
                          ? "rgba(255,255,255,0.4)"
                          : "rgba(255,255,255,0.2)",
                        color: isTransparent
                          ? "rgba(255,255,255,0.9)"
                          : colors.navText,
                      }
                    : {}
                }
              >
                Sign In
              </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
              <Button
                type="primary"
                style={
                  isTransparent
                    ? {
                        background: "rgba(255,255,255,0.15)",
                        borderColor: "rgba(255,255,255,0.3)",
                      }
                    : {}
                }
                icon={<ArrowRightOutlined />}
              >
                Get Started
              </Button>
            </Space>
          )}

          {/* ── Mobile burger ── */}
          {isMobile && (
            <Space>
              <ToggleTheme />
              <Button
                type="text"
                icon={drawerOpen ? <CloseOutlined /> : <MenuOutlined />}
                onClick={() => setDrawerOpen(true)}
                style={{ color: textColor }}
              />
            </Space>
          )}
        </div>
      </nav>

      <Drawer
        title={
          <span
            style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em" }}
          >
            Together<span style={{ color: colors.accentText }}>.</span>
          </span>
        }
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        size={320}
        styles={{
          body: { padding: "16px" },
          header: { background: colors.navBg },
        }}
      >
        <MobileNav onClose={() => setDrawerOpen(false)} />
      </Drawer>
    </>
  );
};
