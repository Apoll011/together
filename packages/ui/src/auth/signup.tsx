"use client";

import React, { useState } from "react";
import {
  Button,
  Divider,
  Form,
  Input,
  Typography,
  Alert,
  Progress,
  Row,
  Col,
  theme,
} from "antd";
import {
  LockOutlined,
  MailOutlined,
  UserOutlined,
  GoogleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@repo/ui/ThemeContext";

const { Title, Text, Paragraph } = Typography;

const IMG_LIGHT = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop";
const IMG_DARK = "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1932&auto=format&fit=crop";

interface SignupFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Logic to calculate password strength color/score
function passwordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (!pw) return { score: 0, label: "", color: "" };
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  const map = [
    { label: "Too short", color: "#ff4d4f" }, // Antd Error Red
    { label: "Weak", color: "#ff4d4f" },
    { label: "Fair", color: "#faad14" },      // Antd Warning Yellow
    { label: "Good", color: "#52c41a" },      // Antd Success Green
    { label: "Strong", color: "#52c41a" },
    { label: "Very strong", color: "#135200" },
  ];
  return { score, ...map[Math.min(score, 5)] };
}

export default function SignUp() {
  const router = useRouter();
  const { colors, mode } = useTheme();
  const { token } = theme.useToken();
  const isDark = mode === "dark";
  const currentImage = isDark ? IMG_DARK : IMG_LIGHT;

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
      
      // Redirect to onboarding/setup
      router.push("/setup");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Common input styles for dark/light mode
  const inputStyle = {
    background: isDark ? "rgba(255,255,255,0.04)" : "#fff",
    borderColor: isDark ? "#444" : undefined,
    color: colors.navBg
  };

  return (
    <main style={{ minHeight: "100vh", background: colors.navBg }}>
      <Row style={{ minHeight: "100vh" }}>
        
        <Col
          xs={0}
          lg={12}
          style={{
            position: "relative",
            background: "#000",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <Image
              src={currentImage}
              alt="Signup Visual"
              fill
              priority
              style={{ objectFit: "cover", opacity: 0.9 }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: isDark
                  ? "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.9) 100%)"
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
                "Building communities has never been easier."
              </Title>
              <Paragraph style={{ color: "rgba(255,255,255,0.8)", fontSize: 16 }}>
                Create your account today and start collaborating with your team in minutes.
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
            padding: "10px",
          }}
        >
          <div style={{ width: "100%", maxWidth: 420 }}>
            <div style={{ marginBottom: 16 }}>
                <Title level={2} style={{ margin: "0 0 8px", color: colors.navText }}>
                    Create an account
                </Title>
                <Text style={{ color: colors.navSubText, fontSize: 16 }}>
                    Join the ecosystem today.
                </Text>
            </div>

            {error && (
              <Alert message={error} type="error" showIcon style={{ marginBottom: 24 }} />
            )}

            <Form<SignupFormValues>
              layout="vertical"
              size="large"
              onFinish={handleSubmit}
              requiredMark={false}
            >
              <Form.Item
                style={{ marginBottom: 0 }}
                name="name"
                label={<span style={{ color: colors.navText }}>Full Name</span>}
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: colors.navBg }} />}
                  placeholder="John Doe"
                  style={inputStyle}
                />
              </Form.Item>

              <Form.Item
              style={{ marginBottom: 0 }}
                name="email"
                label={<span style={{ color: colors.navText }}>Email</span>}
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Invalid email format" },
                ]}
              >
                <Input
                  prefix={<MailOutlined style={{ color: colors.navBg }} />}
                  placeholder="name@company.com"
                  style={inputStyle}
                />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: 0 }}
                name="password"
                label={<span style={{ color: colors.navText }}>Password</span>}
                rules={[
                  { required: true, message: "Please create a password" },
                  { min: 8, message: "Must be at least 8 characters" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: colors.navBg }} />}
                  placeholder="Create a password"
                  onChange={(e) => setPassword(e.target.value)}
                  style={inputStyle}
                />
              </Form.Item>

              {/* Password Strength Meter */}
              {password.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={{ fontSize: 12, color: colors.navSubText }}>Strength</Text>
                    <Text style={{ fontSize: 12, color: pwStrength.color, fontWeight: 600 }}>
                        {pwStrength.label}
                    </Text>
                  </div>
                  <Progress
                    percent={(pwStrength.score / 5) * 100}
                    showInfo={false}
                    strokeColor={pwStrength.color}
                    trailColor={isDark ? "rgba(255,255,255,0.1)" : "#f0f0f0"}
                    size="small"
                    style={{ margin: 0 }}
                  />
                </div>
              )}

              <Form.Item
                name="confirmPassword"
                label={<span style={{ color: colors.navText }}>Confirm Password</span>}
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Please confirm your password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Passwords do not match"));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: colors.navBg }} />}
                  placeholder="Confirm password"
                  style={inputStyle}
                />
              </Form.Item>

              <Form.Item style={{ marginTop: 8 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                  size="large"
                  style={{ height: 48, fontSize: 16, fontWeight: 600 }}
                >
                  Create Account
                </Button>
              </Form.Item>
            </Form>

            <div style={{ position: "relative", margin: "12px 0" }}>
              <Divider style={{ borderColor: isDark ? "#333" : "#e5e7eb", color: colors.navSubText, fontSize: 13 }}>
                OR REGISTER WITH
              </Divider>
            </div>

            <Button
              block
              size="large"
              icon={<GoogleOutlined />}
              onClick={() => (window.location.href = "/api/auth/oauth/google")}
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

            <div style={{ marginTop: 16, textAlign: "center" }}>
              <Text style={{ color: colors.navSubText }}>
                Already have an account?{" "}
                <Link href="/auth/login" style={{ color: token.colorPrimary, fontWeight: 600 }}>
                  Sign in
                </Link>
              </Text>
            </div>
          </div>
        </Col>
      </Row>
    </main>
  );
}