"use client";

import React from "react";
import { Typography, Button, Tag } from "antd";
import { ArrowLeftOutlined, CloudDownloadOutlined } from "@ant-design/icons";
import { useTheme } from "../../ThemeContext"; 
import { AppData, appsData } from "../../data/apps"; // Import our data
import { ContentSection } from "../../components/ContentSection";
import { FeatureGrid } from "../../components/FeatureGrid";
import { FAQSection } from "../../components/FAQSection";
import { CTA } from "../../components/CTA"; // Reuse your existing CTA
import Link from "next/link";

const { Title, Paragraph, Text } = Typography;

export default function AppPageClient({ app }: { app: AppData }) {
  const { colors, mode } = useTheme();

  const isDark = mode === "dark";

  return (
    <main style={{ background: colors.navBg, minHeight: "100vh" }}>
      
      <section
        style={{
          padding: "120px 24px 80px",
          background: isDark 
            ? `linear-gradient(180deg, ${app.color}15 0%, ${colors.navBg} 100%)`
            : `linear-gradient(180deg, ${app.color}15 0%, #fff 100%)`,
          textAlign: "center"
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ marginBottom: 24 }}>
                <Link href="/">
                    <Button type="text" icon={<ArrowLeftOutlined />}>Back to Ecosystem</Button>
                </Link>
            </div>

          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              background: app.color,
              color: "#fff",
              fontSize: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
              boxShadow: `0 10px 30px ${app.color}60`
            }}
          >
            {app.icon}
          </div>

          <Tag color={app.color} style={{ marginBottom: 16, padding: "4px 12px", fontSize: 14 }}>
            Module
          </Tag>

          <Title style={{ fontSize: "clamp(36px, 4vw, 56px)", marginBottom: 16, color: colors.navText }}>
            Together {app.label}
          </Title>
          
          <Paragraph style={{ fontSize: 20, color: colors.navSubText, maxWidth: 600, margin: "0 auto 32px" }}>
            {app.tagline}
          </Paragraph>

          <Button type="primary" size="large" icon={<CloudDownloadOutlined />} style={{ background: app.color }}>
            Launch {app.label}
          </Button>
        </div>
      </section>

      <ContentSection 
        title={`What is ${app.label}?`}
        subtitle={app.longDescription}
        background="muted"
        image={
            <div style={{ color: app.color, fontSize: 120 }}>
                {app.icon}
            </div>
        }
      />

      <FeatureGrid features={app.features} accentColor={app.color} />

      <FAQSection items={app.faqs} />

      <CTA />
      
    </main>
  );
}