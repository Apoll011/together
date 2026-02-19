"use client";

import React, { useState } from "react";
import {
  Button,
  Card,
  ConfigProvider,
  Divider,
  Form,
  Input,
  Typography,
  Alert,
  Progress,
  Space,
} from "antd";
import {
  LockOutlined,
  MailOutlined,
  UserOutlined,
  GoogleOutlined,
  GithubOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";

const { Title, Text } = Typography;

interface SignupFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function passwordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  const map = [
    { label: "Too short", color: "#E76F51" },
    { label: "Weak", color: "#E76F51" },
    { label: "Fair", color: "#F4A261" },
    { label: "Good", color: "#52B788" },
    { label: "Strong", color: "#2D6A4F" },
    { label: "Very strong", color: "#1B4332" },
  ];
  return { score, ...map[Math.min(score, 5)] };
}

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");

  const pwStrength = passwordStrength(password);

  async function handleSubmit(values: SignupFormValues) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message ?? "Registration failed. Please try again.");
        return;
      }

      // Redirect to multi-step setup
      router.push("/setup");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
      <div style={styles.page}>
        <div style={styles.bg} aria-hidden />

        <div style={styles.container}>
          {/* Brand */}
          <div style={styles.brand}>
            <div style={styles.logo}>T</div>
            <Title level={3} style={styles.brandName}>Together</Title>
            <Text style={styles.brandTagline}>Join a world of communities</Text>
          </div>

          <Card style={styles.card} variant={"borderless"}>
            <Title level={4} style={styles.cardTitle}>Create your account</Title>
            <Text type="secondary" style={{ display: "block", marginBottom: 24 }}>
              Access every Together app with one account
            </Text>

            {error && (
              <Alert message={error} type="error" showIcon style={{ marginBottom: 20 }} />
            )}

            <Space direction="vertical" style={{ width: "100%" }} size={10}>
              <Button
                block
                icon={<GoogleOutlined />}
                onClick={() => (window.location.href = "/api/auth/oauth/google?callbackUrl=/setup")}
                style={styles.socialBtn}
              >
                Sign up with Google
              </Button>
              <Button
                block
                icon={<GithubOutlined />}
                onClick={() => (window.location.href = "/api/auth/oauth/github?callbackUrl=/setup")}
                style={styles.socialBtn}
              >
                Sign up with GitHub
              </Button>
            </Space>

            <Divider plain style={{ color: "#aaa", fontSize: 13 }}>
              or create with email
            </Divider>

            <Form<SignupFormValues>
              layout="vertical"
              onFinish={handleSubmit}
              requiredMark={false}
            >
              <Form.Item
                name="name"
                rules={[{ required: true, message: "Full name is required" }]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: "#aaa" }} />}
                  placeholder="Full name"
                  size="large"
                  autoComplete="name"
                />
              </Form.Item>

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
                rules={[
                  { required: true, message: "Password is required" },
                  { min: 8, message: "At least 8 characters" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: "#aaa" }} />}
                  placeholder="Create a password"
                  size="large"
                  autoComplete="new-password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Item>

              {password.length > 0 && (
                <div style={{ marginTop: -16, marginBottom: 16 }}>
                  <Progress
                    percent={(pwStrength.score / 5) * 100}
                    showInfo={false}
                    strokeColor={pwStrength.color}
                    size="small"
                    style={{ marginBottom: 4 }}
                  />
                  <Text style={{ fontSize: 12, color: pwStrength.color }}>
                    {pwStrength.label}
                  </Text>
                </div>
              )}

              <Form.Item
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Please confirm your password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Passwords don't match"));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: "#aaa" }} />}
                  placeholder="Confirm password"
                  size="large"
                  autoComplete="new-password"
                />
              </Form.Item>

              <Form.Item style={{ marginTop: 4 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                  size="large"
                  style={styles.submitBtn}
                >
                  Create account
                </Button>
              </Form.Item>
            </Form>

            <Text style={styles.loginPrompt}>
              Already have an account?{" "}
              <Link href="/login" style={styles.loginLink}>Sign in</Link>
            </Text>
          </Card>

          <Text style={styles.footer}>
            By creating an account you agree to our{" "}
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
      "radial-gradient(ellipse 80% 60% at 80% 0%, #D8F3DC55 0%, transparent 60%)," +
      "radial-gradient(ellipse 60% 50% at 10% 100%, #B7E4C755 0%, transparent 60%)",
    pointerEvents: "none",
  },
  container: { width: "100%", maxWidth: 440, position: "relative", zIndex: 1 },
  brand: { textAlign: "center", marginBottom: 32 },
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
  brandTagline: { color: "#6B8C6B", fontSize: 14 },
  card: { borderRadius: 20, boxShadow: "0 2px 24px rgba(0,0,0,0.08)", padding: "8px 4px" },
  cardTitle: { margin: "0 0 4px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700 },
  socialBtn: { height: 44, borderRadius: 10, fontWeight: 500, border: "1.5px solid #E8E4DC", background: "#FAFAF8" },
  submitBtn: {
    height: 46,
    fontWeight: 600,
    fontSize: 15,
    background: "linear-gradient(135deg, #2D6A4F, #40916C)",
    border: "none",
    boxShadow: "0 4px 16px rgba(45,106,79,0.30)",
  },
  loginPrompt: { display: "block", textAlign: "center", fontSize: 14 },
  loginLink: { color: "#2D6A4F", fontWeight: 600 },
  footer: { display: "block", textAlign: "center", fontSize: 12, color: "#aaa", marginTop: 20 },
  footerLink: { color: "#888" },
};