"use client";

import React from "react";
import { Typography, Divider, Anchor, Row, Col, Alert } from "antd";
import { useTheme } from "@repo/ui/ThemeContext";

const { Title, Paragraph, Text } = Typography;

export default function PrivacyPolicyPage() {
  const { colors, mode } = useTheme();
  const isDark = mode === "dark";

  return (
    <main style={{ background: colors.navBg, minHeight: "100vh", padding: "40px 24px 80px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        
        {/* Page Header */}
        <div style={{ marginBottom: 60, textAlign: "center" }}>
          <Title level={1} style={{ color: colors.navText, marginBottom: 8 }}>Privacy Policy</Title>
          <Text style={{ color: colors.navSubText, fontSize: 16 }}>
            Last Updated: February 20, 2026
          </Text>
        </div>

        <Row gutter={[48, 24]}>
          {/* Sidebar Navigation */}
          <Col xs={0} md={6}>
            <div style={{ position: "sticky", top: 100 }}>
              <Anchor
                targetOffset={100}
                items={[
                  { key: "1", href: "#collection", title: "1. Information We Collect" },
                  { key: "2", href: "#location", title: "2. Location Data" },
                  { key: "3", href: "#public", title: "3. Public Data (Preserve)" },
                  { key: "4", href: "#usage", title: "4. How We Use Data" },
                  { key: "5", href: "#sharing", title: "5. Data Sharing" },
                  { key: "6", href: "#security", title: "6. Security" },
                  { key: "7", href: "#rights", title: "7. Your Rights" },
                ]}
                style={{ background: "transparent" }}
              />
            </div>
          </Col>

          {/* Legal Content */}
          <Col xs={24} md={18}>
            <div style={{ color: colors.navText }}>
              
              <section id="collection" style={{ marginBottom: 48 }}>
                <Title level={3} style={{ color: colors.navText }}>1. Information We Collect</Title>
                <Paragraph style={{ color: colors.navSubText }}>
                  We collect information you provide directly to us, such as when you create an account, update your profile, or communicate with us. This may include:
                </Paragraph>
                <ul style={{ color: colors.navSubText, fontSize: 16, lineHeight: 1.8 }}>
                  <li><strong>Account Info:</strong> Name, email address, username, and password.</li>
                  <li><strong>Profile Info:</strong> Bio, profile photo, and links to social media.</li>
                  <li><strong>Usage Data:</strong> Information about how you interact with our Services.</li>
                </ul>
              </section>

              <section id="location" style={{ marginBottom: 48 }}>
                <Title level={3} style={{ color: colors.navText }}>2. Location Data (Together Help)</Title>
                <Alert 
                  message="Location Privacy" 
                  description="We never track your location without your explicit permission. You are in control." 
                  type="success" 
                  showIcon 
                  style={{ marginBottom: 16 }}
                />
                <Paragraph style={{ color: colors.navSubText }}>
                  The <strong>"Help"</strong> and <strong>"Preserve"</strong> modules may request access to your precise geolocation.
                </Paragraph>
                <Paragraph style={{ color: colors.navSubText }}>
                  <strong>Consent:</strong> We will always ask for your explicit consent before collecting location data.
                </Paragraph>
                <Paragraph style={{ color: colors.navSubText }}>
                  <strong>Storage:</strong> If you use "Together Help" to request aid, your location is stored on our servers to alert nearby users. This data is retained only as long as the request is active. For "Preserve," location metadata attached to environmental reports is stored permanently as part of the public record.
                </Paragraph>
              </section>

              <section id="public" style={{ marginBottom: 48 }}>
                <Title level={3} style={{ color: colors.navText }}>3. Public Data (Together Preserve)</Title>
                <Paragraph style={{ color: colors.navSubText }}>
                  Please be aware that any data uploaded to the <strong>"Preserve"</strong> module (including environmental metrics, photos, and associated coordinates) is intended for the public domain. 
                </Paragraph>
                <Paragraph style={{ color: colors.navSubText }}>
                  <strong>Do not upload personal or sensitive information to Preserve.</strong> Once uploaded, this data is accessible to the public and cannot be easily restricted.
                </Paragraph>
              </section>

              <section id="usage" style={{ marginBottom: 48 }}>
                <Title level={3} style={{ color: colors.navText }}>4. How We Use Your Information</Title>
                <Paragraph style={{ color: colors.navSubText }}>
                  We use the information we collect to:
                </Paragraph>
                <ul style={{ color: colors.navSubText, fontSize: 16, lineHeight: 1.8 }}>
                  <li>Provide, maintain, and improve our Services.</li>
                  <li>Process transactions and send related information (for "Work").</li>
                  <li>Monitor and analyze trends, usage, and activities.</li>
                  <li>Detect, investigate, and prevent fraudulent transactions and illegal activities.</li>
                </ul>
              </section>

              <section id="sharing" style={{ marginBottom: 48 }}>
                <Title level={3} style={{ color: colors.navText }}>5. Data Sharing</Title>
                <Paragraph style={{ color: colors.navSubText }}>
                  We do not sell your personal data. We may share your information in the following circumstances:
                </Paragraph>
                <ul style={{ color: colors.navSubText, fontSize: 16, lineHeight: 1.8 }}>
                  <li><strong>With Consent:</strong> When you specifically agree to share data (e.g., sharing your location in "Help").</li>
                  <li><strong>Service Providers:</strong> With third-party vendors (like Stripe for payments or AWS for hosting) who need access to perform work for us.</li>
                  <li><strong>Legal Compliance:</strong> If required by law or to protect the rights of Embrace Inc. and our users.</li>
                </ul>
              </section>

              <section id="security" style={{ marginBottom: 48 }}>
                <Title level={3} style={{ color: colors.navText }}>6. Security</Title>
                <Paragraph style={{ color: colors.navSubText }}>
                  We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access. However, no internet transmission is completely secure, and we cannot guarantee the security of your data.
                </Paragraph>
              </section>

              <section id="rights" style={{ marginBottom: 48 }}>
                <Title level={3} style={{ color: colors.navText }}>7. Your Rights</Title>
                <Paragraph style={{ color: colors.navSubText }}>
                  Depending on your location (including users in the EEA/UK), you may have rights to access, correct, delete, or restrict use of your personal data.
                </Paragraph>
                <Paragraph style={{ color: colors.navSubText }}>
                  To exercise these rights, please visit your Account Settings or contact us at <a href="mailto:privacy@embrace.inc">privacy@embrace.inc</a>.
                </Paragraph>
              </section>

              <Divider />
              
              <Text type="secondary" style={{ display: "block", marginTop: 40 }}>
                <strong>Embrace Inc.</strong><br />
                Lisbon, Portugal<br />
                <a href="mailto:legal@embrace.inc">legal@embrace.inc</a>
              </Text>
            </div>
          </Col>
        </Row>
      </div>
    </main>
  );
}