"use client";

import React, { useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  ConfigProvider,
  Divider,
  Form,
  Input,
  Typography,
  Alert,
  Space,
} from "antd";
import {
  LockOutlined,
  MailOutlined,
  GoogleOutlined,
  GithubOutlined,
  AppleOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";

const { Title, Text } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

/**
 * Login page for the Together central account system.
 *
 * Handles:
 *  - Email + password authentication
 *  - OAuth social sign-in (Google, GitHub, Apple)
 *  - "Remember me" persistence
 *  - Redirect to `callbackUrl` query param after login (used by OAuth authorize flow)
 */
export default function LoginPage({
  searchParams,
}: {
  searchParams?: { callbackUrl?: string; error?: string };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(searchParams?.error ?? "");

  const callbackUrl = searchParams?.callbackUrl ?? "/dashboard";

  async function handleSubmit(values: LoginFormValues) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          remember: values.remember,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message ?? "Invalid credentials. Please try again.");
        return;
      }

      router.push(callbackUrl);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleSocialLogin(provider: "google" | "github" | "apple") {
    const params = new URLSearchParams({ callbackUrl });
    window.location.href = `/api/auth/oauth/${provider}?${params}`;
  }

  return (
    <div style={styles.page}>
        <div style={styles.bg} aria-hidden />

        <div style={styles.container}>
          {/* Brand */}
          <div style={styles.brand}>
            <div style={styles.logo}>T</div>
            <Title level={3} style={styles.brandName}>
              Together
            </Title>
            <Text style={styles.brandTagline}>One account. Every community.</Text>
          </div>

          <Card style={styles.card} bordered={false}>
            <Title level={4} style={styles.cardTitle}>
              Welcome back
            </Title>
            <Text type="secondary" style={{ display: "block", marginBottom: 24 }}>
              Sign in to access all Together apps
            </Text>

            {error && (
              <Alert
                message={error}
                type="error"
                showIcon
                style={{ marginBottom: 20 }}
              />
            )}

            {/* Social providers */}
            <Space direction="vertical" style={{ width: "100%" }} size={10}>
              <Button
                block
                icon={<GoogleOutlined />}
                onClick={() => handleSocialLogin("google")}
                style={styles.socialBtn}
              >
                Continue with Google
              </Button>
              <Button
                block
                icon={<GithubOutlined />}
                onClick={() => handleSocialLogin("github")}
                style={styles.socialBtn}
              >
                Continue with GitHub
              </Button>
              <Button
                block
                icon={<AppleOutlined />}
                onClick={() => handleSocialLogin("apple")}
                style={styles.socialBtn}
              >
                Continue with Apple
              </Button>
            </Space>

            <Divider plain style={{ color: "#aaa", fontSize: 13 }}>
              or sign in with email
            </Divider>

            <Form<LoginFormValues>
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{ remember: true }}
              requiredMark={false}
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Email is required" },
                  { type: "email", message: "Enter a valid email" },
                ]}
              >
                <Input
                  prefix={<MailOutlined style={{ color: "#aaa" }} />}
                  placeholder="you@example.com"
                  size="large"
                  autoComplete="email"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: "Password is required" }]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: "#aaa" }} />}
                  placeholder="Password"
                  size="large"
                  autoComplete="current-password"
                />
              </Form.Item>

              <div style={styles.rememberRow}>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <Link href="/forgot-password" style={styles.forgotLink}>
                  Forgot password?
                </Link>
              </div>

              <Form.Item style={{ marginTop: 8 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                  size="large"
                  style={styles.submitBtn}
                >
                  Sign in
                </Button>
              </Form.Item>
            </Form>

            <Text style={styles.signupPrompt}>
              Don&apos;t have an account?{" "}
              <Link href="/signup" style={styles.signupLink}>
                Create one free
              </Link>
            </Text>
          </Card>

          <Text style={styles.footer}>
            By continuing, you agree to Together&apos;s{" "}
            <Link href="/terms" style={styles.footerLink}>Terms</Link> and{" "}
            <Link href="/privacy" style={styles.footerLink}>Privacy Policy</Link>.
          </Text>
        </div>
      </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F7F4",
    padding: "24px 16px",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'DM Sans', sans-serif",
  },
  bg: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(ellipse 80% 60% at 20% 0%, #D8F3DC55 0%, transparent 60%)," +
      "radial-gradient(ellipse 60% 50% at 80% 100%, #B7E4C755 0%, transparent 60%)",
    pointerEvents: "none",
  },
  container: {
    width: "100%",
    maxWidth: 440,
    position: "relative",
    zIndex: 1,
  },
  brand: {
    textAlign: "center",
    marginBottom: 32,
  },
  logo: {
    width: 52,
    height: 52,
    borderRadius: 16,
    background: "linear-gradient(135deg, #2D6A4F, #52B788)",
    color: "#fff",
    fontSize: 26,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 12px",
    boxShadow: "0 4px 20px rgba(45,106,79,0.35)",
  },
  brandName: {
    margin: "0 0 4px",
    color: "#1A2E1A",
    fontWeight: 700,
    fontFamily: "'DM Sans', sans-serif",
  },
  brandTagline: {
    color: "#6B8C6B",
    fontSize: 14,
  },
  card: {
    borderRadius: 20,
    boxShadow: "0 2px 24px rgba(0,0,0,0.08)",
    padding: "8px 4px",
  },
  cardTitle: {
    margin: "0 0 4px",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 700,
  },
  socialBtn: {
    height: 44,
    borderRadius: 10,
    fontWeight: 500,
    border: "1.5px solid #E8E4DC",
    background: "#FAFAF8",
  },
  rememberRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    marginTop: -8,
  },
  forgotLink: {
    color: "#2D6A4F",
    fontSize: 14,
  },
  submitBtn: {
    height: 46,
    fontWeight: 600,
    fontSize: 15,
    background: "linear-gradient(135deg, #2D6A4F, #40916C)",
    border: "none",
    boxShadow: "0 4px 16px rgba(45,106,79,0.30)",
  },
  signupPrompt: {
    display: "block",
    textAlign: "center",
    fontSize: 14,
  },
  signupLink: {
    color: "#2D6A4F",
    fontWeight: 600,
  },
  footer: {
    display: "block",
    textAlign: "center",
    fontSize: 12,
    color: "#aaa",
    marginTop: 20,
  },
  footerLink: {
    color: "#888",
  },
};