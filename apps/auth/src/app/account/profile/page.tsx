"use client";

import React, { useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Col,
  ConfigProvider,
  Divider,
  Form,
  Input,
  Layout,
  Row,
  Select,
  Tag,
  Tooltip,
  Typography,
  Upload,
  message,
} from "antd";
import {
  CameraOutlined,
  DeleteOutlined,
  SaveOutlined,
  UserOutlined,
} from "@ant-design/icons";
import DashboardLayout from "../layout";
import { AppKey, appsData } from "@repo/together-apps/data";

const { Title, Text, Paragraph } = Typography;

interface ProfileFormValues {
  displayName: string;
  username: string;
  bio: string;
  country: string;
  language: string;
  website: string;
}

export default function ProfilePage() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [selectedApps, setSelectedApps] = useState<AppKey[]>(["learn", "support"]);
  const [form] = Form.useForm<ProfileFormValues>();

  function beforeUpload(file: File) {
    if (!file.type.startsWith("image/")) { message.error("Only images are allowed."); return false; }
    if (file.size / 1024 / 1024 > 5) { message.error("Max size is 5 MB."); return false; }
    const reader = new FileReader();
    reader.onload = (e) => setAvatarUrl(e.target?.result as string);
    reader.readAsDataURL(file);
    return false;
  }

  async function handleSave(values: ProfileFormValues) {
    setSaving(true);
    try {
      await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, apps: selectedApps, avatarUrl }),
      });
      message.success("Profile saved!");
    } catch {
      message.error("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  }

  function toggleApp(key: AppKey) {
    setSelectedApps((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <Title level={4} style={styles.pageTitle}>Profile Settings</Title>
          <Text type="secondary" style={{ display: "block", marginBottom: 28 }}>
            Manage how you appear across all Together communities.
          </Text>

          {/* Avatar section */}
          <Card style={styles.card} variant={"borderless"}>
            <Title level={5} style={styles.sectionTitle}>Profile photo</Title>
            <div style={styles.avatarSection}>
              <div style={{ position: "relative", display: "inline-block" }}>
                <Avatar
                  size={88}
                  src={avatarUrl}
                  icon={<UserOutlined />}
                  style={{ background: "#B7E4C7" }}
                />
                <Upload beforeUpload={beforeUpload} showUploadList={false} accept="image/*">
                  <Tooltip title="Change photo">
                    <div style={styles.cameraBtn}>
                      <CameraOutlined style={{ color: "#fff", fontSize: 15 }} />
                    </div>
                  </Tooltip>
                </Upload>
              </div>
              <div>
                <Upload beforeUpload={beforeUpload} showUploadList={false} accept="image/*">
                  <Button icon={<CameraOutlined />}>Upload new photo</Button>
                </Upload>
                {avatarUrl && (
                  <Button
                    icon={<DeleteOutlined />}
                    danger
                    type="text"
                    style={{ marginLeft: 8 }}
                    onClick={() => setAvatarUrl(null)}
                  >
                    Remove
                  </Button>
                )}
                <Paragraph type="secondary" style={{ fontSize: 12, marginTop: 8, marginBottom: 0 }}>
                  JPG, PNG, or GIF · Max 5 MB · Recommended 400×400 px
                </Paragraph>
              </div>
            </div>
          </Card>

          {/* Basic info */}
          <Card style={styles.card} variant={"borderless"}>
            <Title level={5} style={styles.sectionTitle}>Basic information</Title>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSave}
              requiredMark={false}
              initialValues={{
                displayName: "Jane Doe",
                username: "janedoe",
                language: "en",
                country: "BR",
              }}
            >
              <Row gutter={16}>
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
                      { pattern: /^[a-z0-9_]{3,24}$/, message: "3–24 chars, lowercase" },
                    ]}
                  >
                    <Input prefix="@" placeholder="janedoe" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Bio" name="bio">
                <Input.TextArea
                  placeholder="Tell communities about yourself…"
                  maxLength={180}
                  showCount
                  autoSize={{ minRows: 3, maxRows: 5 }}
                />
              </Form.Item>

              <Form.Item label="Website" name="website">
                <Input prefix="https://" placeholder="yoursite.com" />
              </Form.Item>

              <Row gutter={16}>
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
                  <Form.Item label="Language" name="language">
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

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={saving}
                  icon={<SaveOutlined />}
                  style={styles.saveBtn}
                >
                  Save changes
                </Button>
              </div>
            </Form>
          </Card>

          {/* Community interests */}
          <Card style={styles.card} variant={"borderless"}>
            <Title level={5} style={styles.sectionTitle}>My communities</Title>
            <Paragraph type="secondary" style={{ marginBottom: 16, fontSize: 14 }}>
              These apps will appear prominently on your profile. Click to toggle.
            </Paragraph>

            <div style={styles.appGrid}>
              {appsData.map((app) => {
                const active = selectedApps.includes(app.key);
                return (
                  <Tooltip key={app.key} title={app.description}>
                    <div
                      onClick={() => toggleApp(app.key)}
                      style={{
                        ...styles.appChip,
                        background: active ? `${app.color}18` : "#F5F4F0",
                        border: active ? `1.5px solid ${app.color}` : "1.5px solid #E8E4DC",
                        color: active ? app.color : "#888",
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
                        </div> 
                       {app.label.replace("Together We ", "")}
                    </div>
                  </Tooltip>
                );
              })}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
              <Button
                type="primary"
                loading={saving}
                icon={<SaveOutlined />}
                style={styles.saveBtn}
                onClick={() => handleSave(form.getFieldsValue())}
              >
                Save communities
              </Button>
            </div>
          </Card>

          {/* Danger zone */}
          <Card
            style={{ ...styles.card, borderColor: "#FECACA" }}
            bordered
          >
            <Title level={5} style={{ ...styles.sectionTitle, color: "#E76F51" }}>
              Danger zone
            </Title>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <Text strong>Delete account</Text>
                <Paragraph type="secondary" style={{ margin: 0, fontSize: 13 }}>
                  Permanently delete your Together account and all associated data. This cannot be undone.
                </Paragraph>
              </div>
              <Button danger>Delete account</Button>
            </div>
          </Card>
    </div>     
  );
}

const styles: Record<string, React.CSSProperties> = {
  pageTitle: { margin: "0 0 4px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700 },
  card: { borderRadius: 16, boxShadow: "0 1px 8px rgba(0,0,0,0.06)", marginBottom: 20 },
  sectionTitle: { marginBottom: 16, fontFamily: "'DM Sans', sans-serif" },
  avatarSection: { display: "flex", alignItems: "center", gap: 24 },
  cameraBtn: {
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
    cursor: "pointer",
  },
  saveBtn: {
    height: 40,
    paddingInline: 20,
    fontWeight: 600,
    background: "linear-gradient(135deg, #2D6A4F, #40916C)",
    border: "none",
    boxShadow: "0 3px 10px rgba(45,106,79,0.2)",
  },
  appGrid: { display: "flex", flexWrap: "wrap", gap: 8 },
  appChip: {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 14px",
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    userSelect: "none",
    transition: "all 0.15s ease",
  },
};

const COUNTRIES = [
  { value: "BR", label: "Brazil" },
  { value: "US", label: "United States" },
  { value: "PT", label: "Portugal" },
  { value: "AR", label: "Argentina" },
  { value: "MX", label: "Mexico" },
  { value: "GB", label: "United Kingdom" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "NG", label: "Nigeria" },
  { value: "IN", label: "India" },
];