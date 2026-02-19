"use client";
import React from "react";
import { Collapse, Typography } from "antd";
import { useTheme } from "@repo/ui/ThemeContext";

const { Title } = Typography;

export const FAQSection: React.FC<{ items: { question: string; answer: string }[] }> = ({ items }) => {
  const { colors, mode } = useTheme();

  if (!items || items.length === 0) return null;

  return (
    <section style={{ padding: "80px 24px", background: colors.navBg }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: 48, color: colors.navText }}>
          Frequently Asked Questions
        </Title>
        <Collapse
          accordion
          ghost
          items={items.map((item, i) => ({
            key: i,
            label: <span style={{ fontSize: 16, fontWeight: 500, color: colors.navText }}>{item.question}</span>,
            children: <p style={{ color: colors.navSubText }}>{item.answer}</p>,
          }))}
        />
      </div>
    </section>
  );
};