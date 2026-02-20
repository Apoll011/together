"use client";

import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Row,
  Col,
  Divider,
  Alert,
  theme,
  ConfigProvider,
} from "antd";
import {
  MailOutlined,
  LockOutlined,
  GoogleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "@repo/ui/ThemeContext";

const { Title, Text, Paragraph } = Typography;


const IMG_LIGHT = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop"; 
const IMG_DARK = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop";

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { callbackUrl?: string; error?: string };
}) {
  const router = useRouter();
  const { colors, mode } = useTheme();
  const { token } = theme.useToken();

  const isDark = mode === "dark";
  const currentImage = isDark ? IMG_DARK : IMG_LIGHT;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(searchParams?.error ?? "");
  const callbackUrl = searchParams?.callbackUrl ?? "/dashboard";

  const handleSubmit = async (values: any) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Invalid credentials");
      router.push(callbackUrl);
    } catch (err) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = () => {
    console.log("Social login...");
  };

  return (
    // We override the background here to match the split layout
    <main style={{ minHeight: "100vh", background: colors.navBg }}>
      <Row style={{ minHeight: "100vh" }}>
        
      <Col
          xs={0}
          lg={12}
          style={{
            position: "relative",
            background: "#000", // Fallback color
            overflow: "hidden",
          }}
        >
          {/* Background Image */}
          <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <Image
              src={currentImage}
              alt="Login Visual"
              fill
              priority
              style={{ objectFit: "cover", opacity: 0.9 }}
            />
            {/* Gradient Overlay for text readability */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: isDark 
                  ? "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)"
                  : "linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.4) 100%)",
              }}
            />
          </div>

          <div
            style={{
              position: "relative",
              zIndex: 1,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "60px",
              color: "#fff",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 12,
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(10px)",
                  padding: "8px 16px",
                  borderRadius: 30,
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <div style={{ fontWeight: 800, fontSize: 18 }}>T</div>
                <span style={{ fontWeight: 500 }}>Together Ecosystem</span>
              </div>
            </div>

            <div style={{ maxWidth: 480 }}>
              <Title level={2} style={{ color: "#fff", marginBottom: 16 }}>
                "The best way to manage your community apps in one place."
              </Title>
              <Paragraph style={{ color: "rgba(255,255,255,0.8)", fontSize: 16 }}>
                Join thousands of developers and community managers building the
                future together.
              </Paragraph>
            </div>
          </div>
        </Col>

        <Col
          xs={24}
          lg={12}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: colors.navBg,
            padding: "40px",
          }}
        >
          <div style={{ width: "100%", maxWidth: 420 }}>
            {/* Header */}
            <div style={{ marginBottom: 32 }}>
                <Title level={2} style={{ margin: "0 0 8px", color: colors.navText }}>
                    Welcome back
                </Title>
                <Text style={{ color: colors.navSubText, fontSize: 16 }}>
                    Please enter your details to sign in.
                </Text>
            </div>

            {error && (
              <Alert
                message={error}
                type="error"
                showIcon
                style={{ marginBottom: 24 }}
              />
            )}

            {/* Form */}
            <Form
              layout="vertical"
              size="large"
              onFinish={handleSubmit}
              requiredMark={false}
            >
              <Form.Item
                label={<span style={{ color: colors.navText }}>Email</span>}
                name="email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Invalid email format" },
                ]}
              >
                <Input
                  prefix={<MailOutlined style={{ color: colors.navText }} />}
                  placeholder="name@company.com"
                  style={{ 
                    color: colors.navText,
                    background: isDark ? "rgba(255,255,255,0.04)" : "#fff",
                    borderColor: isDark ? "#444" : undefined
                  }}
                />
              </Form.Item>

              <Form.Item
                label={<span style={{ color: colors.navText }}>Password</span>}
                name="password"
                rules={[{ required: true, message: "Please enter your password" }]}
              >
                <Input.Password
                color={colors.navText}
                  prefix={<LockOutlined style={{ color: colors.navText }} />}
                  placeholder="••••••••"
                  style={{ 
                    color: colors.navText,
                    background: isDark ? "rgba(255,255,255,0.04)" : "#fff",
                    borderColor: isDark ? "#444" : undefined
                  }}
                />
              </Form.Item>

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
                 {/* Empty span to push Forgot Password to right if checkbox removed */}
                 <span /> 
                 <Link href="/auth/forgot" style={{ color: token.colorPrimary, fontWeight: 500, fontSize: 14 }}>
                   Forgot password?
                 </Link>
              </div>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                  size="large"
                  style={{ height: 48, fontSize: 16, fontWeight: 600 }}
                >
                  Sign In
                </Button>
              </Form.Item>
            </Form>

            <div style={{ position: "relative", margin: "24px 0" }}>
              <Divider style={{ borderColor: isDark ? "#333" : "#e5e7eb", color: colors.navSubText, fontSize: 13 }}>
                OR CONTINUE WITH
              </Divider>
            </div>

            <Button
              block
              size="large"
              icon={<GoogleOutlined />}
              onClick={handleSocialLogin}
              style={{
                height: 48,
                background: isDark ? "rgba(255,255,255,0.05)" : "#fff",
                borderColor: isDark ? "#444" : "#d9d9d9",
                color: colors.navText,
                fontSize: 15,
                fontWeight: 500
              }}
            >
              Google
            </Button>

            <div style={{ marginTop: 32, textAlign: "center" }}>
              <Text style={{ color: colors.navSubText }}>
                Don&apos;t have an account?{" "}
                <Link href="/auth/signup" style={{ color: token.colorPrimary, fontWeight: 600 }}>
                  Sign up for free
                </Link>
              </Text>
            </div>
          </div>
        </Col>
      </Row>
    </main>
  );
}