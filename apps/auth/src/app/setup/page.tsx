"use client";

import React, { useState, useEffect } from "react";
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
  theme,
  Divider,
} from "antd";
import {
  CameraOutlined,
  CheckCircleFilled,
  UserOutlined,
  LeftOutlined,
  RightOutlined,
  BellOutlined,
  MailOutlined,
  SafetyCertificateFilled
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useTheme } from "@repo/ui/ThemeContext";
import { AppKey, appsData } from "@repo/together-apps/data"; 

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// --- Types ---
interface ProfileStep {
  displayName: string;
  username: string;
  bio: string;
  country: string;
  language: string;
}

const STEPS = [
  { title: "Profile", description: "Identity" },
  { title: "Interests", description: "Communities" },
  { title: "Notifications", description: "Preferences" },
];

export default function SetupPage() {
  const router = useRouter();
  const { colors, mode } = useTheme();
  const { token } = theme.useToken();
  const isDark = mode === "dark";

  const [current, setCurrent] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [profileForm] = Form.useForm<ProfileStep>();
  
  // Default to selecting "Learn" and "Code" as examples
  const [selectedApps, setSelectedApps] = useState<string[]>(["learn", "code"]);
  
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // --- Handlers ---

  function toggleApp(key: string) {
    setSelectedApps((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  async function handleNext() {
    if (current === 0) {
      try {
        await profileForm.validateFields();
      } catch {
        return; // Form invalid
      }
    }
    if (current === 1 && selectedApps.length === 0) {
      message.warning("Please join at least one community to get started.");
      return;
    }
    setCurrent((c) => c + 1);
  }

  async function handleFinish() {
    setSubmitting(true);
    try {
      // Simulate API Call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const payload = {
        profile: profileForm.getFieldsValue(),
        apps: selectedApps,
        notifications: { email: emailNotif, push: pushNotif },
        avatarUrl,
      };
      
      console.log("Saving Setup Data:", payload);
      
      // Move to "Done" state (visual only, current=3)
      setCurrent(3); 
    } catch {
      message.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // Mock Image Upload
  function beforeUpload(file: File) {
    const isImage = file.type.startsWith("image/");
    if (!isImage) { message.error("You can only upload image files!"); return false; }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) { message.error("Image must smaller than 2MB!"); return false; }
    
    // Simulate read
    const reader = new FileReader();
    reader.addEventListener("load", () => setAvatarUrl(reader.result as string));
    reader.readAsDataURL(file);
    return false; // Prevent auto upload
  }

  // --- Render Steps ---

  const renderContent = () => {
    switch (current) {
      case 0:
        return (
          <StepProfile 
            form={profileForm} 
            avatarUrl={avatarUrl} 
            beforeUpload={beforeUpload} 
            isDark={isDark} 
            colors={colors}
          />
        );
      case 1:
        return (
          <StepInterests 
            selected={selectedApps} 
            onToggle={toggleApp} 
            isDark={isDark}
            colors={colors}
          />
        );
      case 2:
        return (
          <StepNotifications
            email={emailNotif}
            push={pushNotif}
            onEmail={setEmailNotif}
            onPush={setPushNotif}
            isDark={isDark}
            colors={colors}
            token={token}
          />
        );
      case 3:
        return <StepDone onGo={() => router.push("/dashboard")} colors={colors} />;
      default:
        return null;
    }
  };

  // --- Main Render ---

  return (
    <div style={{
      minHeight: "100vh",
      background: colors.navBg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 16px",
      fontFamily: token.fontFamily,
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Background Ambience */}
      <div style={{
        position: "absolute",
        top: -100,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 800,
        height: 500,
        background: isDark 
          ? `radial-gradient(circle, ${token.colorPrimary}22 0%, transparent 70%)` 
          : `radial-gradient(circle, ${token.colorPrimary}11 0%, transparent 70%)`,
        zIndex: 0,
        pointerEvents: "none"
      }} />

      <div style={{ width: "100%", maxWidth: 640, position: "relative", zIndex: 1 }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ 
            width: 48, 
            height: 48, 
            background: token.colorPrimary, 
            borderRadius: 12, 
            margin: "0 auto 16px", 
            display: "grid", 
            placeItems: "center",
            color: "#fff",
            fontSize: 24,
            fontWeight: "bold",
            boxShadow: `0 8px 20px ${token.colorPrimary}40`
          }}>
            T
          </div>
          <Title level={3} style={{ marginBottom: 8, color: colors.navText }}>
             {current === 3 ? "Welcome to Together!" : "Set up your profile"}
          </Title>
          {current < 3 && (
            <Text style={{ color: colors.navSubText }}>
              Step {current + 1} of 3
            </Text>
          )}
        </div>

        {/* The Card */}
        <Card 
          variant={"borderless"} 
          style={{ 
            borderRadius: 24, 
            boxShadow: isDark ? "0 4px 40px rgba(0,0,0,0.4)" : "0 4px 40px rgba(0,0,0,0.06)",
            background: isDark ? "#1f1f1f" : "#fff",
            overflow: "hidden"
          }}
          styles={{ body: { padding: 0 } }}
        >
          {/* Progress Bar (Hidden on Done step) */}
          {current < 3 && (
            <div style={{ padding: "32px 32px 0" }}>
               <Steps
                 current={current}
                 items={STEPS}
                 size="small"
                 responsive={false}
                 className="custom-steps"
               />
               <Divider style={{ margin: "24px 0" }} />
            </div>
          )}

          {/* Step Content */}
          <div style={{ padding: "0 32px 32px" }}>
             <div style={{ minHeight: 300 }}>
               {renderContent()}
             </div>

             {/* Footer Actions */}
             {current < 3 && (
               <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, alignItems: "center" }}>
                 
                 {/* Back / Skip Logic */}
                 {current === 0 ? (
                   <Button type="text" style={{ color: colors.navSubText }} onClick={() => router.push("/dashboard")}>
                     Skip setup
                   </Button>
                 ) : (
                   <Button 
                     icon={<LeftOutlined />} 
                     onClick={() => setCurrent(c => c - 1)}
                     style={{ border: "none", background: "transparent", color: colors.navText, paddingLeft: 0 }}
                   >
                     Back
                   </Button>
                 )}

                 {/* Next Button */}
                 <Button 
                   type="primary" 
                   size="large" 
                   onClick={current === 2 ? handleFinish : handleNext}
                   loading={submitting}
                   style={{ 
                     minWidth: 140, 
                     height: 48, 
                     borderRadius: 12, 
                     fontWeight: 600,
                     background: token.colorPrimary
                   }}
                 >
                   {current === 2 ? "Finish Setup" : "Continue"} <RightOutlined style={{ fontSize: 12 }} />
                 </Button>
               </div>
             )}
          </div>
        </Card>
      </div>

      {/* Global Style Override for Steps component to match theme colors */}
      <style jsx global>{`
        .custom-steps .ant-steps-item-process .ant-steps-item-icon {
          background-color: ${token.colorPrimary} !important;
          border-color: ${token.colorPrimary} !important;
        }
        .custom-steps .ant-steps-item-finish .ant-steps-item-icon {
          border-color: ${token.colorPrimary} !important;
        }
        .custom-steps .ant-steps-item-finish .ant-steps-item-icon > .ant-steps-icon {
          color: ${token.colorPrimary} !important;
        }
      `}</style>
    </div>
  );
}

// -----------------------------------------------------------------------------
// STEP 1: PROFILE
// -----------------------------------------------------------------------------
function StepProfile({ form, avatarUrl, beforeUpload, isDark, colors }: any) {
  return (
    <div className="animate-fade-in">
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <Upload beforeUpload={beforeUpload} showUploadList={false}>
          <div style={{ position: "relative", cursor: "pointer", display: "inline-block" }}>
            <Avatar
              size={100}
              src={avatarUrl}
              icon={<UserOutlined />}
              style={{ 
                background: isDark ? "#333" : "#f0f0f0", 
                color: isDark ? "#666" : "#aaa",
                border: `4px solid ${isDark ? "#1f1f1f" : "#fff"}`,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)" 
              }}
            />
            <div style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 32,
              height: 32,
              background: "#0050B3",
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              border: `3px solid ${isDark ? "#1f1f1f" : "#fff"}`
            }}>
              <CameraOutlined style={{ color: "#fff", fontSize: 14 }} />
            </div>
          </div>
        </Upload>
        <Text style={{ display: "block", marginTop: 12, color: colors.navSubText, fontSize: 13 }}>
          Upload a photo or avatar
        </Text>
      </div>

      <Form form={form} layout="vertical" requiredMark={false} size="large">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="displayName"
              label={<span style={{ color: colors.navText }}>Display Name</span>}
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="Jane Doe" style={{ background: isDark ? "rgba(255,255,255,0.05)" : "#fff" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="username"
              label={<span style={{ color: colors.navText }}>Username</span>}
              rules={[{ required: true, message: "Required" }]}
            >
              <Input prefix="@" placeholder="jane" style={{ background: isDark ? "rgba(255,255,255,0.05)" : "#fff" }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item 
            name="bio" 
            label={<span style={{ color: colors.navText }}>Bio</span>}
        >
          <Input.TextArea 
            placeholder="Tell us a bit about yourself..." 
            rows={3} 
            showCount 
            maxLength={160}
            style={{ background: isDark ? "rgba(255,255,255,0.05)" : "#fff" }}
          />
        </Form.Item>
      </Form>
    </div>
  );
}

// -----------------------------------------------------------------------------
// STEP 2: INTERESTS (Fixing the App Cards)
// -----------------------------------------------------------------------------
function StepInterests({ selected, onToggle, isDark, colors }: any) {
  return (
    <div className="animate-fade-in">
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0, color: colors.navText }}>Pick your communities</Title>
        <Paragraph style={{ color: colors.navSubText }}>
          Select the Together apps you want to start with.
        </Paragraph>
      </div>

      <Row gutter={[12, 12]}>
        {appsData.map((app) => {
          const isSelected = selected.includes(app.key);
          const activeBorder = app.color;
          const inactiveBorder = isDark ? "#333" : "#eee";
          
          return (
            <Col xs={24} sm={12} key={app.key}>
              <div
                onClick={() => onToggle(app.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: 16,
                  borderRadius: 16,
                  border: `2px solid ${isSelected ? activeBorder : inactiveBorder}`,
                  background: isSelected 
                    ? (isDark ? `${app.color}15` : `${app.color}0A`) // Subtle tint based on app color
                    : (isDark ? "rgba(255,255,255,0.02)" : "#fafafa"),
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  position: "relative"
                }}
              >
                {/* App Icon Box */}
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: isSelected ? app.color : (isDark ? "#333" : "#eee"),
                  display: "grid",
                  placeItems: "center",
                  fontSize: 20,
                  color: isSelected ? "#fff" : (isDark ? "#aaa" : "#999"),
                  flexShrink: 0,
                  marginRight: 16,
                  transition: "all 0.2s ease"
                }}>
                  {app.icon}
                </div>

                {/* Text Info */}
                <div style={{ flex: 1 }}>
                  <Text strong style={{ display: "block", color: colors.navText, fontSize: 15 }}>
                    {app.label}
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.navSubText, lineHeight: 1.2, display: "block" }}>
                    {app.tagline}
                  </Text>
                </div>

                {/* Checkmark */}
                {isSelected && (
                   <CheckCircleFilled style={{ color: app.color, fontSize: 18 }} />
                )}
              </div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}

// -----------------------------------------------------------------------------
// STEP 3: NOTIFICATIONS
// -----------------------------------------------------------------------------
function StepNotifications({ email, push, onEmail, onPush, isDark, colors, token }: any) {
  
  const NotificationCard = ({ icon, title, desc, active, onToggle }: any) => (
    <div 
      onClick={onToggle}
      style={{
        display: "flex",
        alignItems: "center",
        padding: 20,
        borderRadius: 16,
        border: `2px solid ${active ? token.colorPrimary : (isDark ? "#333" : "#eee")}`,
        background: active 
           ? (isDark ? `${token.colorPrimary}15` : `${token.colorPrimary}0A`)
           : (isDark ? "rgba(255,255,255,0.02)" : "#fafafa"),
        cursor: "pointer",
        marginBottom: 16,
        transition: "all 0.2s ease"
      }}
    >
      <div style={{
        width: 48,
        height: 48,
        borderRadius: "50%",
        background: active ? token.colorPrimary : (isDark ? "#333" : "#eee"),
        color: active ? "#fff" : (isDark ? "#aaa" : "#999"),
        display: "grid",
        placeItems: "center",
        fontSize: 20,
        marginRight: 16,
        transition: "all 0.2s ease"
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <Text strong style={{ fontSize: 16, color: colors.navText, display: "block" }}>{title}</Text>
        <Text style={{ fontSize: 13, color: colors.navSubText }}>{desc}</Text>
      </div>
      <div style={{
        width: 24,
        height: 24,
        borderRadius: "50%",
        border: `2px solid ${active ? token.colorPrimary : (isDark ? "#555" : "#ddd")}`,
        display: "grid",
        placeItems: "center"
      }}>
        {active && <div style={{ width: 12, height: 12, borderRadius: "50%", background: token.colorPrimary }} />}
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <Title level={4} style={{ margin: 0, color: colors.navText }}>Stay in the loop</Title>
        <Paragraph style={{ color: colors.navSubText }}>
          How should we contact you about community updates?
        </Paragraph>
      </div>

      <NotificationCard 
        icon={<MailOutlined />}
        title="Email Digest"
        desc="Weekly summary of activity in your communities."
        active={email}
        onToggle={() => onEmail(!email)}
      />
      
      <NotificationCard 
        icon={<BellOutlined />}
        title="Push Notifications"
        desc="Real-time alerts for mentions and direct messages."
        active={push}
        onToggle={() => onPush(!push)}
      />
    </div>
  );
}

// -----------------------------------------------------------------------------
// FINAL STEP: DONE
// -----------------------------------------------------------------------------
function StepDone({ onGo, colors }: any) {
  return (
    <div className="animate-fade-in" style={{ textAlign: "center", padding: "40px 0 20px" }}>
      <div style={{ fontSize: 64, marginBottom: 24 }}>🎉</div>
      <Title level={3} style={{ color: colors.navText }}>You're all set!</Title>
      <Paragraph style={{ color: colors.navSubText, maxWidth: 320, margin: "0 auto 32px", fontSize: 16 }}>
        Your profile is ready and your communities are waiting. Welcome to the ecosystem.
      </Paragraph>

      <Button 
        type="primary" 
        size="large" 
        onClick={onGo}
        style={{ 
          height: 52, 
          paddingInline: 48, 
          fontSize: 16, 
          fontWeight: 600,
          borderRadius: 30 
        }}
      >
        Go to Dashboard
      </Button>

      <div style={{ marginTop: 32, opacity: 0.6 }}>
         <SafetyCertificateFilled style={{ color: "#52c41a", marginRight: 8 }} />
         <Text style={{ fontSize: 12, color: colors.navSubText }}>Account verified securely</Text>
      </div>
    </div>
  );
}