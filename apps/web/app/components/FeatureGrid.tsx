"use client";
import React from "react";
import { Row, Col, Typography, Card } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import { useTheme } from "../ThemeContext";

const { Title, Paragraph } = Typography;

interface FeatureItem {
  title: string;
  desc: string;
}

export const FeatureGrid: React.FC<{ features: FeatureItem[]; accentColor: string }> = ({ features, accentColor }) => {
  const { colors, mode } = useTheme();
  const isDark = mode === "dark";

  return (
    <section style={{ padding: "100px 24px", background: colors.navBg }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
           <Title level={2} style={{ color: colors.navText }}>Key Capabilities</Title>
        </div>
        <Row gutter={[32, 32]}>
          {features.map((f, i) => (
            <Col xs={24} sm={12} md={8} key={i}>
              <Card 
                bordered={false}
                style={{ 
                  height: "100%", 
                  background: isDark ? "rgba(255,255,255,0.03)" : "#fff",
                  boxShadow: isDark ? "none" : "0 4px 12px rgba(0,0,0,0.05)"
                }}
              >
                <div style={{ marginBottom: 16, color: accentColor, fontSize: 24 }}>
                  <CheckCircleFilled />
                </div>
                <Title level={4} style={{ color: colors.navText, marginTop: 0 }}>{f.title}</Title>
                <Paragraph style={{ color: colors.navSubText }}>{f.desc}</Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};