"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAuth, useSignIn } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { Typography, Form, Input, Button, Card, message, Spin, Result } from "antd";
import { LockOutlined, KeyOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { useTheme } from "@repo/ui/ThemeContext";

const { Title, Paragraph } = Typography;

export default function ResetPasswordPage() {
  const { isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const { colors } = useTheme();

  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const [secondFactor, setSecondFactor] = useState(false);
  const didRequestCode = useRef(false);

  const emailParam = searchParams.get("email");

  useEffect(() => {
    if (isSignedIn) router.push("/");
  }, [isSignedIn, router]);

  useEffect(() => {
    if (!isLoaded || !signIn || !emailParam || didRequestCode.current) {
        setInitLoading(false);
        return;
    }

    const sendResetCode = async () => {
      didRequestCode.current = true; 
      try {
        await signIn.create({
          strategy: "reset_password_email_code",
          identifier: emailParam,
        });
        message.success("A reset code has been sent to your email.");
      } catch (err: any) {
        console.error("Error sending code", err);
        // If the error is not "already pending", show it
        const msg = err.errors?.[0]?.longMessage || "Failed to send reset code.";
        message.error(msg);
      } finally {
        setInitLoading(false);
      }
    };

    sendResetCode();
  }, [isLoaded, signIn, emailParam]);

  const onFinish = async (values: any) => {
    setLoading(true);
    const { code, password } = values;

    try {
      const result = await signIn?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });

      if (result?.status === "needs_second_factor") {
        setSecondFactor(true);
        message.warning("Two-Factor Authentication required.");
      } else if (result?.status === "complete") {
        await setActive({
          session: result.createdSessionId,
          navigate: async () => {
            message.success("Password reset successfully! Logging you in...");
            router.push("/");
          },
        });
      } else {
        console.log(result);
        message.error("Something went wrong during sign in.");
      }
    } catch (err: any) {
      console.error("error", err.errors[0]?.longMessage);
      message.error(err.errors[0]?.longMessage || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // 1. Loading State
  if (!isLoaded || initLoading) {
    return (
      <main style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: colors.navBg }}>
        <Spin size="large" description="Initializing..." />
      </main>
    );
  }

  // 2. Missing Email Parameter State
  if (!emailParam) {
    return (
        <main style={{ paddingTop: 80, minHeight: '100vh', background: colors.navBg }}>
             <div style={{ textAlign: "center", padding: "80px 24px", maxWidth: 600, margin: "0 auto" }}>
                <Result
                    status="warning"
                    title="Missing Information"
                    subTitle="We could not find an email address to reset. Please go back to the login page and try 'Forgot Password' again."
                    extra={<Button type="primary" onClick={() => router.push('/sign-in')}>Go to Login</Button>}
                />
             </div>
        </main>
    )
  }

  // 3. Main Form UI
  return (
    <main style={{ paddingTop: 80, minHeight: '100vh', background: colors.navBg }}>
      
      {/* Header Section */}
      <div style={{ textAlign: "center", padding: "40px 24px 20px", maxWidth: 800, margin: "0 auto" }}>
        <Title style={{ fontSize: 48, color: colors.navText, marginBottom: 8 }}>
          Secure Reset
        </Title>
        <Paragraph style={{ fontSize: 18, color: colors.navSubText }}>
          Enter the verification code sent to <strong>{emailParam}</strong> and verify your new password.
        </Paragraph>
      </div>

      {/* Content Section */}
      <section style={{ padding: "20px 24px" }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
            {secondFactor ? (
                <Card variant={"borderless"} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    <Result
                        icon={<SafetyCertificateOutlined style={{ color: colors.primaryBtnText || '#1890ff' }} />}
                        title="2FA Required"
                        subTitle="Your account requires secondary verification. Please use your authenticator app or check your text messages."
                    />
                </Card>
            ) : (
                <Card variant={"borderless"} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    <Form
                        name="reset_password"
                        layout="vertical"
                        onFinish={onFinish}
                        autoComplete="off"
                        requiredMark={false}
                    >
                        {/* OTP Code Input */}
                        <Form.Item
                            label="Verification Code"
                            name="code"
                            rules={[{ required: true, message: 'Please enter the code sent to your email!' }]}
                        >
                            <Input 
                                size="large" 
                                prefix={<KeyOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} 
                                placeholder="e.g. 123456" 
                            />
                        </Form.Item>

                        {/* New Password Input */}
                        <Form.Item
                            label="New Password"
                            name="password"
                            rules={[
                                { required: true, message: 'Please input your new password!' },
                                { min: 8, message: 'Password must be at least 8 characters' }
                            ]}
                            hasFeedback
                        >
                            <Input.Password 
                                size="large"
                                prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="Enter new password" 
                            />
                        </Form.Item>

                        {/* Confirm Password Input */}
                        <Form.Item
                            label="Confirm Password"
                            name="confirm"
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                                { required: true, message: 'Please confirm your password!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password 
                                size="large"
                                prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="Confirm new password" 
                            />
                        </Form.Item>

                        <Form.Item style={{ marginTop: 32 }}>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                size="large" 
                                block 
                                loading={loading}
                                style={{ height: 48, fontSize: 16 }}
                            >
                                Reset Password
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            )}
        </div>
      </section>
    </main>
  );
}