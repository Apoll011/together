"use client";

import React, { useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Steps,
  Tag,
  Tooltip,
  Typography,
  Upload,
  message,
} from "antd";
import {
  CameraOutlined,
  CheckCircleFilled,
  UserOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { AppKey, appsData } from "@repo/together-apps/data";

const { Title, Text, Paragraph } = Typography;

interface ProfileStep {
  displayName: string;
  username: string;
  bio: string;
  birthdate: string | null;
  country: string;
  language: string;
}

interface InterestsStep {
  apps: AppKey[];
}

interface NotificationsStep {
  email: boolean;
  push: boolean;
}

const STEPS = [
  { title: "Profile",       description: "Tell us about you" },
  { title: "Interests",     description: "Pick your communities" },
  { title: "Notifications", description: "Stay in the loop" },
  { title: "All set!",      description: "You're ready" },
];

export default function SetupPage() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [profileForm] = Form.useForm<ProfileStep>();
  const [selectedApps, setSelectedApps] = useState<AppKey[]>([]);
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  function toggleApp(key: AppKey) {
    setSelectedApps((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  async function handleNext() {
    if (current === 0) {
      try {
        await profileForm.validateFields();
      } catch {
        return;
      }
    }
    if (current === 1 && selectedApps.length === 0) {
      message.warning("Please select at least one community.");
      return;
    }
    setCurrent((c) => c + 1);
  }

  async function handleFinish() {
    setSubmitting(true);
    try {
      const profileValues = profileForm.getFieldsValue();
      await fetch("/api/account/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: profileValues,
          apps: selectedApps,
          notifications: { email: emailNotif, push: pushNotif },
          avatarUrl,
        }),
      });
      setCurrent(3);
    } catch {
      message.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function beforeUpload(file: File) {
    const isImage = file.type.startsWith("image/");
    if (!isImage) { message.error("Please upload an image file."); return false; }
    const isSmall = file.size / 1024 / 1024 < 5;
    if (!isSmall) { message.error("Image must be less than 5 MB."); return false; }
    const reader = new FileReader();
    reader.onload = (e) => setAvatarUrl(e.target?.result as string);
    reader.readAsDataURL(file);
    return false; // prevent auto-upload
  }

  function renderStep() {
    switch (current) {
      case 0:
        return <StepProfile form={profileForm} avatarUrl={avatarUrl} beforeUpload={beforeUpload} />;
      case 1:
        return <StepInterests selected={selectedApps} onToggle={toggleApp} />;
      case 2:
        return (
          <StepNotifications
            email={emailNotif}
            push={pushNotif}
            onEmail={setEmailNotif}
            onPush={setPushNotif}
          />
        );
      case 3:
        return <StepDone onGo={() => router.push("/dashboard")} />;
      default:
        return null;
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
      <div style={styles.page}>
        <div style={styles.bg} aria-hidden />

        <div style={styles.container}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.logo}>T</div>
            <Title level={4} style={styles.heading}>
              Let&apos;s set up your account
            </Title>
            <Text type="secondary" style={{ fontSize: 14 }}>
              Just a few steps to personalise your experience
            </Text>
          </div>

          {/* Progress steps */}
          <Steps
            current={current}
            items={STEPS.map((s) => ({ title: s.title, description: s.description }))}
            style={styles.steps}
            size="small"
          />

          {/* Card */}
          <Card style={styles.card} variant={"borderless"}>
            {renderStep()}

            {/* Navigation buttons */}
            {current < 3 && (
              <div style={styles.actions}>
                {current > 0 && (
                  <Button
                    onClick={() => setCurrent((c) => c - 1)}
                    style={styles.backBtn}
                    size="large"
                  >
                    Back
                  </Button>
                )}
                {current < 2 ? (
                  <Button
                    type="primary"
                    onClick={handleNext}
                    size="large"
                    style={styles.nextBtn}
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    onClick={handleFinish}
                    loading={submitting}
                    size="large"
                    style={styles.nextBtn}
                  >
                    Finish setup
                  </Button>
                )}
              </div>
            )}
          </Card>

          {current < 3 && (
            <Text style={styles.skip} onClick={() => router.push("/dashboard")}>
              Skip for now →
            </Text>
          )}
        </div>
      </div>
  );
}

function StepProfile({
  form,
  avatarUrl,
  beforeUpload,
}: {
  form: ReturnType<typeof Form.useForm<ProfileStep>>[0];
  avatarUrl: string | null;
  beforeUpload: (f: File) => boolean;
}) {
  return (
    <>
      <Title level={5} style={styles.stepTitle}>Your profile</Title>
      <Paragraph type="secondary" style={{ marginBottom: 24 }}>
        This is how other members will see you across all Together apps.
      </Paragraph>

      {/* Avatar */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <Upload beforeUpload={beforeUpload} showUploadList={false} accept="image/*">
          <Tooltip title="Upload photo">
            <div style={{ position: "relative", display: "inline-block", cursor: "pointer" }}>
              <Avatar
                size={88}
                src={avatarUrl}
                icon={<UserOutlined />}
                style={{ background: "#B7E4C7" }}
              />
              <div style={styles.cameraOverlay}>
                <CameraOutlined style={{ color: "#fff", fontSize: 16 }} />
              </div>
            </div>
          </Tooltip>
        </Upload>
        <Text style={{ display: "block", marginTop: 8, fontSize: 13, color: "#999" }}>
          Optional — you can do this later
        </Text>
      </div>

      <Form form={form} layout="vertical" requiredMark={false}>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              label="Display name"
              name="displayName"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="Jane Doe" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Username"
              name="username"
              rules={[
                { required: true, message: "Required" },
                { pattern: /^[a-z0-9_]{3,24}$/, message: "3–24 chars, lowercase/numbers/_" },
              ]}
            >
              <Input prefix="@" placeholder="janedoe" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Short bio" name="bio">
          <Input.TextArea
            placeholder="Tell communities a bit about yourself…"
            maxLength={180}
            showCount
            autoSize={{ minRows: 2, maxRows: 4 }}
          />
        </Form.Item>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item label="Country" name="country">
              <Select
                showSearch
                placeholder="Select country"
                options={COUNTRIES}
                filterOption={(input, opt) =>
                  (opt?.label as string)?.toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Language" name="language" initialValue="en">
              <Select
                options={[
                  { value: "en", label: "English" },
                  { value: "pt", label: "Português" },
                  { value: "es", label: "Español" },
                  { value: "fr", label: "Français" },
                  { value: "de", label: "Deutsch" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
}

function StepInterests({
  selected,
  onToggle,
}: {
  selected: AppKey[];
  onToggle: (k: AppKey) => void;
}) {
  return (
    <>
      <Title level={5} style={styles.stepTitle}>Your communities</Title>
      <Paragraph type="secondary" style={{ marginBottom: 24 }}>
        Select the Together apps you&apos;re interested in. You can always change this later.
      </Paragraph>

      <Row gutter={[12, 12]}>
        {appsData.map((app) => {
          const active = selected.includes(app.key);
          return (
            <Col span={12} key={app.key}>
              <div
                onClick={() => onToggle(app.key)}
                style={{
                  ...styles.appCard,
                  border: active ? `2px solid ${app.color}` : "2px solid #E8E4DC",
                  background: active ? `${app.color}0D` : "#FAFAF8",
                  cursor: "pointer",
                }}
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
            </div>                <Text strong style={{ fontSize: 13, display: "block" }}>
                  {app.label.replace("Together We ", "")}
                </Text>
                <Text type="secondary" style={{ fontSize: 11 }}>{app.description}</Text>
                {active && (
                  <CheckCircleFilled
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      color: app.color,
                      fontSize: 16,
                    }}
                  />
                )}
              </div>
            </Col>
          );
        })}
      </Row>

      {selected.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Selected ({selected.length}):{" "}
          </Text>
          {selected.map((k) => {
            const app = appsData.find((a) => a.key === k)!;
            return (
              <Tag key={k} color={app.color} style={{ marginBottom: 4 }}>
                {app.icon} {k}
              </Tag>
            );
          })}
        </div>
      )}
    </>
  );
}

function StepNotifications({
  email,
  push,
  onEmail,
  onPush,
}: {
  email: boolean;
  push: boolean;
  onEmail: (v: boolean) => void;
  onPush: (v: boolean) => void;
}) {
  return (
    <>
      <Title level={5} style={styles.stepTitle}>Stay in the loop</Title>
      <Paragraph type="secondary" style={{ marginBottom: 24 }}>
        Choose how Together keeps you informed. You can adjust these anytime in settings.
      </Paragraph>

      {[
        {
          label: "Email notifications",
          desc: "Activity summaries, new messages, and important updates",
          value: email,
          onChange: onEmail,
          emoji: "📧",
        },
        {
          label: "Push notifications",
          desc: "Real-time alerts from your Together communities",
          value: push,
          onChange: onPush,
          emoji: "🔔",
        },
      ].map((item) => (
        <div
          key={item.label}
          style={{
            ...styles.notifCard,
            border: item.value ? "2px solid #2D6A4F" : "2px solid #E8E4DC",
            background: item.value ? "#F0FAF4" : "#FAFAF8",
          }}
          onClick={() => item.onChange(!item.value)}
        >
          <div style={{ fontSize: 28, marginRight: 16 }}>{item.emoji}</div>
          <div style={{ flex: 1 }}>
            <Text strong style={{ display: "block" }}>{item.label}</Text>
            <Text type="secondary" style={{ fontSize: 13 }}>{item.desc}</Text>
          </div>
          {item.value && <CheckCircleFilled style={{ color: "#2D6A4F", fontSize: 20 }} />}
        </div>
      ))}
    </>
  );
}

function StepDone({ onGo }: { onGo: () => void }) {
  return (
    <div style={{ textAlign: "center", padding: "16px 0 8px" }}>
      <div style={styles.doneBadge}>🎉</div>
      <Title level={4} style={{ marginBottom: 8 }}>You&apos;re all set!</Title>
      <Paragraph type="secondary" style={{ marginBottom: 32, maxWidth: 320, margin: "0 auto 32px" }}>
        Your Together account is ready. Explore your communities and start connecting.
      </Paragraph>
      <Button
        type="primary"
        size="large"
        onClick={onGo}
        style={styles.doneBtn}
      >
        Go to my dashboard →
      </Button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#F8F7F4",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "40px 16px 60px",
    fontFamily: "'DM Sans', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  bg: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(ellipse 80% 40% at 50% 0%, #D8F3DC44 0%, transparent 60%)",
    pointerEvents: "none",
  },
  container: { width: "100%", maxWidth: 600, position: "relative", zIndex: 1 },
  header: { textAlign: "center", marginBottom: 32 },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 14,
    background: "linear-gradient(135deg, #2D6A4F, #52B788)",
    color: "#fff",
    fontSize: 22,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 12px",
    boxShadow: "0 4px 16px rgba(45,106,79,0.3)",
  },
  heading: { margin: "0 0 4px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700 },
  steps: { marginBottom: 24 },
  card: { borderRadius: 20, boxShadow: "0 2px 24px rgba(0,0,0,0.08)", padding: "8px 4px" },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 28,
    paddingTop: 20,
    borderTop: "1px solid #F0EDE6",
  },
  backBtn: { borderRadius: 10, height: 44, minWidth: 100 },
  nextBtn: {
    height: 44,
    minWidth: 140,
    fontWeight: 600,
    background: "linear-gradient(135deg, #2D6A4F, #40916C)",
    border: "none",
    boxShadow: "0 4px 12px rgba(45,106,79,0.25)",
  },
  skip: { display: "block", textAlign: "center", color: "#aaa", fontSize: 14, marginTop: 16, cursor: "pointer" },
  stepTitle: { marginBottom: 4, fontFamily: "'DM Sans', sans-serif" },
  cameraOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: "#2D6A4F",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid #fff",
  },
  appCard: {
    position: "relative",
    padding: "14px 12px",
    borderRadius: 12,
    transition: "all 0.18s ease",
    userSelect: "none",
  },
  notifCard: {
    display: "flex",
    alignItems: "center",
    padding: "16px 20px",
    borderRadius: 12,
    marginBottom: 12,
    cursor: "pointer",
    transition: "all 0.18s ease",
    userSelect: "none",
  },
  doneBadge: {
    fontSize: 56,
    marginBottom: 16,
    display: "block",
  },
  doneBtn: {
    height: 48,
    paddingInline: 32,
    fontWeight: 600,
    fontSize: 15,
    background: "linear-gradient(135deg, #2D6A4F, #40916C)",
    border: "none",
    boxShadow: "0 4px 16px rgba(45,106,79,0.3)",
  },
};

const COUNTRIES = [
  { value: "BR", label: "Brazil" },
  { value: "US", label: "United States" },
  { value: "PT", label: "Portugal" },
  { value: "AR", label: "Argentina" },
  { value: "MX", label: "Mexico" },
  { value: "CO", label: "Colombia" },
  { value: "GB", label: "United Kingdom" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "ES", label: "Spain" },
  { value: "NG", label: "Nigeria" },
  { value: "IN", label: "India" },
  { value: "CN", label: "China" },
  { value: "JP", label: "Japan" },
  { value: "AU", label: "Australia" },
  { value: "CA", label: "Canada" },
  { value: "ZA", label: "South Africa" },
  { value: "KE", label: "Kenya" },
];