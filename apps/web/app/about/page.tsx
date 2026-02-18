"use client";

import React from "react";
import { Typography, Row, Col, Timeline } from "antd";
import { useTheme } from "../ThemeContext";
import { ContentSection } from "../components/ContentSection";
import { CTA } from "../components/CTA";

const { Title, Paragraph } = Typography;

export default function AboutPage() {
  const { colors } = useTheme();

  return (
    <main style={{ paddingTop: 80, background: colors.navBg }}>
      
      <div style={{ textAlign: "center", padding: "80px 24px", maxWidth: 800, margin: "0 auto" }}>
        <Title style={{ fontSize: 56, color: colors.navText }}>Our Mission</Title>
        <Paragraph style={{ fontSize: 20, color: colors.navSubText }}>
          We are building the operating system for a more collaborative world. 
          By combining open-source technology with human-centric design, we empower communities to thrive.
        </Paragraph>
      </div>

      <ContentSection 
        title="From a Script to a Movement"
        subtitle="It started as a simple script to track local air quality. Today, Together is a federation of tools used by thousands of organizations worldwide to preserve history, learn skills, and work asynchronously."
        background="muted"
      />

      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <Title level={2} style={{ textAlign: "center", marginBottom: 64, color: colors.navText }}>
                Project Roadmap
            </Title>
            <Timeline
                mode="alternate"
                items={[
                    { children: '2023: Project Inception & Alpha Release' },
                    { children: '2024: "Preserve" and "Work" modules launched' },
                    { children: '2025: Community Governance DAO activated', color: 'green' },
                    { children: '2026: "Learn" module global rollout', color: 'blue' },
                    { children: 'Future: AI-assisted community management' },
                ]}
            />
        </div>
      </section>

      <CTA />
    </main>
  );
}