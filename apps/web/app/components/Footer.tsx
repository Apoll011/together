"use client";

import React, { useState } from "react";
import {
  Row,
  Col,
  Button,
  Input,
  Typography,
  Space,
  Divider,
  Form,
  message,
  Tag,
  Grid,
  Switch,
} from "antd";
import {
  GithubOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  ArrowRightOutlined,
  CheckCircleFilled,
  SunOutlined,
  MoonOutlined,
} from "@ant-design/icons";
import { useTheme } from "../ThemeContext";

const { Text, Title, Link } = Typography;
const { useBreakpoint } = Grid;

// ─── Data ─────────────────────────────────────────────────────────────────────

const apps = [
  { key: "preserve", label: "We Preserve", icon: "🌿", color: "#52c41a" },
  { key: "learn",    label: "We Learn",    icon: "📚", color: "#fa8c16", isNew: true },
  { key: "work",     label: "We Work",     icon: "🚀", color: "#0050B3" },
  { key: "help",     label: "We Help",     icon: "🤝", color: "#eb2f96" },
  { key: "explore",  label: "We Explore",  icon: "🧭", color: "#722ed1" },
  { key: "code",     label: "We Code",     icon: "⌨️", color: "#13c2c2" },
];

const resources = [
  { key: "docs",   label: "Documentation" },
  { key: "api",    label: "API Reference" },
  { key: "forum",  label: "Community Forum" },
  { key: "help",   label: "Help Center" },
  { key: "oss",    label: "Open Source" },
];

const company = [
  { key: "about",     label: "About Us" },
  { key: "careers",   label: "Careers" },
  { key: "manifesto", label: "Manifesto" },
  { key: "privacy",   label: "Privacy Policy" },
  { key: "terms",     label: "Terms of Service" },
];

const socialLinks = [
  { key: "github",   icon: <GithubOutlined />,   label: "GitHub",   href: "#" },
  { key: "twitter",  icon: <TwitterOutlined />,  label: "Twitter",  href: "#" },
  { key: "linkedin", icon: <LinkedinOutlined />, label: "LinkedIn", href: "#" },
];

// ─── Newsletter ───────────────────────────────────────────────────────────────

const Newsletter: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form] = Form.useForm();
  const { colors } = useTheme();

  const handleSubmit = (values: { email: string }) => {
    if (values.email) {
      setSubmitted(true);
      message.success("You're on the list!");
    }
  };

  if (submitted) {
    return (
      <Space
        style={{
          background: "rgba(82,196,26,0.08)",
          border: "1px solid rgba(82,196,26,0.2)",
          borderRadius: 8,
          padding: "10px 16px",
          display: "inline-flex",
        }}
      >
        <CheckCircleFilled style={{ color: "#52c41a" }} />
        <Text style={{ color: "#52c41a", fontWeight: 600 }}>
          You're on the list!
        </Text>
      </Space>
    );
  }

  return (
    <Form form={form} onFinish={handleSubmit} layout="inline">
      <Form.Item
        name="email"
        rules={[{ type: "email", message: "" }]}
        style={{ marginBottom: 0, flex: 1 }}
      >
        <Input
          placeholder="Enter your email"
          style={{ borderRadius: "8px 0 0 8px", height: 44 }}
        />
      </Form.Item>
      <Form.Item style={{ marginBottom: 0 }}>
        <Button
          type="primary"
          htmlType="submit"
          style={{ borderRadius: "0 8px 8px 0", height: 44 }}
          icon={<ArrowRightOutlined />}
        >
          Subscribe
        </Button>
      </Form.Item>
    </Form>
  );
};

// ─── Footer link helper ───────────────────────────────────────────────────────

const FooterLink: React.FC<{ href?: string; children: React.ReactNode }> = ({
  href = "#",
  children,
}) => {
  const { colors } = useTheme();
  
  return (
    <Link
      href={href}
      style={{
        display: "block",
        color: colors.footerLink,
        fontSize: 14,
        marginBottom: 10,
        transition: "color 0.2s",
        lineHeight: "1.5",
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = colors.footerLinkHover)}
      onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = colors.footerLink)}
    >
      {children}
    </Link>
  );
};

export const Footer: React.FC = () => {
  const screens = useBreakpoint();
  const { colors } = useTheme();

  return (
    <footer
      style={{
        background: colors.footerBg,
        color: colors.footerText,
        paddingTop: 72,
        paddingBottom: 0,
      }}
    >
      {/* Subtle top accent */}
      <div
        style={{
          position: "relative",
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* ── Main grid ── */}
        <Row gutter={[48, 48]}>
          {/* Brand column */}
          <Col xs={24} sm={24} md={8} lg={7}>
            {/* Logo */}
            <a
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                textDecoration: "none",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: colors.logoBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  color: colors.logoText,
                  fontWeight: 700,
                }}
              >
                ✦
              </div>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: 20,
                  color: colors.footerText,
                  letterSpacing: "-0.02em",
                }}
              >
                Together
                <span style={{ color: colors.accentText }}>.</span>
              </span>
            </a>

            <Text
              style={{
                color: colors.footerTextMuted,
                fontSize: 14,
                lineHeight: 1.7,
                display: "block",
                marginBottom: 24,
              }}
            >
              A modular ecosystem designed to foster community, preservation,
              and learning. Join the movement.
            </Text>

            {/* Newsletter */}
            <Text
              style={{
                color: colors.footerText,
                fontWeight: 600,
                fontSize: 13,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: 12,
              }}
            >
              Stay Updated
            </Text>
            <Newsletter />
          </Col>

          {/* Spacer on large screens */}
          <Col lg={1} xs={0} />

          {/* Ecosystem */}
          <Col xs={12} sm={8} md={5} lg={5}>
            <Text
              strong
              style={{
                color: colors.footerText,
                fontSize: 13,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: 16,
              }}
            >
              Ecosystem
            </Text>
            {apps.map((app) => (
              <Link
                key={app.key}
                href="#"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: colors.footerLink,
                  marginBottom: 10,
                  fontSize: 14,
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color =
                    colors.footerLinkHover)
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color =
                    colors.footerLink)
                }
              >
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 5,
                    background: `${app.color}25`,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    flexShrink: 0,
                  }}
                >
                  {app.icon}
                </span>
                Together {app.label}
                {app.isNew && (
                  <Tag
                    color="blue"
                    style={{
                      fontSize: 10,
                      lineHeight: "16px",
                      padding: "0 4px",
                      marginLeft: 2,
                    }}
                  >
                    New
                  </Tag>
                )}
              </Link>
            ))}
          </Col>

          {/* Resources */}
          <Col xs={12} sm={8} md={5} lg={5}>
            <Text
              strong
              style={{
                color: colors.footerText,
                fontSize: 13,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: 16,
              }}
            >
              Resources
            </Text>
            {resources.map((r) => (
              <FooterLink key={r.key}>{r.label}</FooterLink>
            ))}
          </Col>

          {/* Company */}
          <Col xs={12} sm={8} md={5} lg={5}>
            <Text
              strong
              style={{
                color: colors.footerText,
                fontSize: 13,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: 16,
              }}
            >
              Company
            </Text>
            {company.map((c) => (
              <FooterLink key={c.key}>{c.label}</FooterLink>
            ))}
          </Col>
        </Row>

        {/* ── Divider ── */}
        <Divider
          style={{
            borderColor: colors.footerDivider,
            marginTop: 56,
            marginBottom: 0,
          }}
        />

        {/* ── Bottom bar ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            padding: "20px 0 24px",
          }}
        >
          <Text style={{ color: colors.footerBottomText, fontSize: 13 }}>
            © {new Date().getFullYear()} Together Project. All rights reserved.
          </Text>

          <Space size={4}>
            
            {socialLinks.map((s) => (
              <Button
                key={s.key}
                type="text"
                href={s.href}
                icon={s.icon}
                aria-label={s.label}
                style={{
                  color: colors.footerSocialIcon,
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "color 0.2s, background 0.2s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.color = colors.footerSocialIconHover;
                  el.style.background = colors.footerSocialBgHover;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.color = colors.footerSocialIcon;
                  el.style.background = "transparent";
                }}
              />
            ))}
          </Space>
        </div>
      </div>
    </footer>
  );
};

