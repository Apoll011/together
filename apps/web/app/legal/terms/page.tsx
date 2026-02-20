"use client";

import React from "react";
import { Typography, Divider, Anchor, Row, Col, Alert } from "antd";
import { useTheme } from "@repo/ui/ThemeContext";

const { Title, Paragraph, Text } = Typography;

export default function TermsOfServicePage() {
  const { colors, mode } = useTheme();
  const isDark = mode === "dark";

  return (
    <main style={{ background: colors.navBg, minHeight: "100vh", padding: "40px 24px 80px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        
        {/* Page Header */}
        <div style={{ marginBottom: 60, textAlign: "center" }}>
          <Title level={1} style={{ color: colors.navText, marginBottom: 8 }}>Terms of Service</Title>
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
                  { key: "1", href: "#acceptance", title: "1. Acceptance of Terms" },
                  { key: "2", href: "#eligibility", title: "2. Eligibility & Age" },
                  { key: "3", href: "#accounts", title: "3. User Accounts" },
                  { key: "4", href: "#modules", title: "4. Specific Modules" },
                  { key: "5", href: "#content", title: "5. User Content" },
                  { key: "6", href: "#payments", title: "6. Payments & Finance" },
                  { key: "7", href: "#termination", title: "7. Termination" },
                  { key: "8", href: "#disclaimers", title: "8. Disclaimers" },
                ]}
                style={{ background: "transparent" }}
              />
            </div>
          </Col>

          {/* Legal Content */}
          <Col xs={24} md={18}>
            <div style={{ color: colors.navText }}>
              
              <section id="acceptance" style={{ marginBottom: 48 }}>
                <Title level={3} style={{ color: colors.navText }}>1. Acceptance of Terms</Title>
                <Paragraph style={{ color: colors.navSubText, fontSize: 16 }}>
                  Welcome to Together. These Terms of Service ("Terms") constitute a binding legal agreement between you and <strong>Embrace Inc.</strong> ("we," "us," or "our"). By accessing or using our platform, website, or mobile applications (collectively, the "Services"), you agree to be bound by these Terms.
                </Paragraph>
                <Alert 
                  title="TL;DR" 
                  description="By using Together, you agree to these rules. If you don't agree, please don't use our services." 
                  type="info" 
                  showIcon 
                />
              </section>

              <section id="eligibility" style={{ marginBottom: 48 }}>
                <Title level={3} style={{ color: colors.navText }}>2. Eligibility & Age Restrictions</Title>
                <Paragraph style={{ color: colors.navSubText }}>
                  You must be at least <strong>13 years old</strong> to use the general Services (such as "Learn" or "Preserve").
                </Paragraph>
                <Paragraph style={{ color: colors.navSubText }}>
                  However, specific modules that involve financial transactions, contracts, or employment (specifically the <strong>"Work"</strong> module) are strictly limited to users who are <strong>18 years of age or older</strong>. By accessing the "Work" module, you represent and warrant that you are of legal age to form a binding contract.
                </Paragraph>
              </section>

              <section id="accounts" style={{ marginBottom: 48 }}>
                <Title level={3} style={{ color: colors.navText }}>3. User Accounts</Title>
                <Paragraph style={{ color: colors.navSubText }}>
                  To access certain features, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account. Embrace Inc. is not liable for any loss or damage arising from your failure to protect your password.
                </Paragraph>
              </section>

              <section id="modules" style={{ marginBottom: 48 }}>
                <Title level={3} style={{ color: colors.navText }}>4. Module-Specific Terms</Title>
                
                <Title level={4} style={{ color: colors.navText, marginTop: 24 }}>A. Together Preserve</Title>
                <Paragraph style={{ color: colors.navSubText }}>
                  The "Preserve" module allows users to upload environmental data. By uploading data to Preserve, you acknowledge that this data is contributed to the <strong>Public Domain (CC0)</strong>. You waive all copyright and related rights to this specific data to ensure it can be freely used by scientists and activists worldwide.
                </Paragraph>

                <Title level={4} style={{ color: colors.navText, marginTop: 24 }}>B. Together Help</Title>
                <Paragraph style={{ color: colors.navSubText }}>
                  The "Help" module is for mutual aid. You agree not to misuse emergency alerts. We do not guarantee that aid will be provided by other users. In a life-threatening emergency, always contact local emergency services (e.g., 911 or 112) immediately.
                </Paragraph>
              </section>

              <section id="content" style={{ marginBottom: 48 }}>
                <Title level={3} style={{ color: colors.navText }}>5. User Content & Licensing</Title>
                <Paragraph style={{ color: colors.navSubText }}>
                  Except for data uploaded to "Preserve" (see Section 4A), you retain ownership of the content you create, including course materials in "Learn" or code in "Code."
                </Paragraph>
                <Paragraph style={{ color: colors.navSubText }}>
                  However, by posting content, you grant Embrace Inc. a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content solely for the purpose of operating and improving the Services.
                </Paragraph>
              </section>

              <section id="payments" style={{ marginBottom: 48 }}>
                <Title level={3} style={{ color: colors.navText }}>6. Payments & Financial Transactions</Title>
                <Paragraph style={{ color: colors.navSubText }}>
                  The "Work" module may facilitate payments between users (e.g., bounties or payroll). Embrace Inc. is <strong>not a bank, money transmitter, or financial institution</strong>.
                </Paragraph>
                <Paragraph style={{ color: colors.navSubText }}>
                  All financial transactions are processed by third-party providers (such as Stripe). We do not hold funds on your behalf. You agree to comply with the terms of service of our payment processors. We are not responsible for errors or delays caused by these third-party payment providers.
                </Paragraph>
              </section>

              <section id="termination" style={{ marginBottom: 48 }}>
                <Title level={3} style={{ color: colors.navText }}>7. Termination</Title>
                <Paragraph style={{ color: colors.navSubText }}>
                  We reserve the right to suspend or terminate your account at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users of the Services, us, or third parties, or for any other reason.
                </Paragraph>
              </section>

              <section id="disclaimers" style={{ marginBottom: 48 }}>
                <Title level={3} style={{ color: colors.navText }}>8. Disclaimers & Limitation of Liability</Title>
                <Paragraph style={{ color: colors.navSubText }}>
                  THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE." EMBRACE INC. DISCLAIMS ALL REPRESENTATIONS AND WARRANTIES, EXPRESS, IMPLIED, OR STATUTORY, NOT EXPRESSLY SET OUT IN THESE TERMS.
                </Paragraph>
                <Paragraph style={{ color: colors.navSubText }}>
                  IN NO EVENT SHALL EMBRACE INC. BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, PUNITIVE, OR CONSEQUENTIAL DAMAGES.
                </Paragraph>
              </section>

              <Divider />
              
              <Text type="secondary" style={{ display: "block", marginTop: 40 }}>
                If you have questions about these Terms, please contact us at <a href="mailto:legal@embrace.inc">legal@embrace.inc</a>.
              </Text>
            </div>
          </Col>
        </Row>
      </div>
    </main>
  );
}