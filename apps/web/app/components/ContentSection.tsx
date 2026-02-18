"use client";
import React from "react";
import { Row, Col, Typography, Button } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useTheme } from "../ThemeContext";
import { motion } from "framer-motion";

const { Title, Paragraph } = Typography;

interface ContentSectionProps {
  title: string;
  subtitle: string;
  image?: React.ReactNode; // Can be an <img> or a <div>
  reversed?: boolean;
  background?: "default" | "muted";
}

export const ContentSection: React.FC<ContentSectionProps> = ({
  title,
  subtitle,
  image,
  reversed = false,
  background = "default",
}) => {
  const { colors, mode } = useTheme();
  const isDark = mode === "dark";
  
  const bgColor = background === "muted" 
    ? (mode === 'dark' ? 'rgba(255,255,255,0.02)' : '#f9f9f9')
    : colors.navBg;

  return (
    <section style={{ padding: "100px 24px", background: bgColor }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <Row 
          gutter={[64, 48]} 
          align="middle" 
          style={{ flexDirection: reversed ? "row-reverse" : "row" }}
        >
          {/* Text Side */}
          <Col xs={24} md={12}>
            <motion.div
              initial={{ opacity: 0, x: reversed ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Title level={2} style={{ color: colors.navText, marginBottom: 24 }}>
                {title}
              </Title>
              <Paragraph style={{ fontSize: 18, lineHeight: 1.8, color: colors.navSubText, marginBottom: 32 }}>
                {subtitle}
              </Paragraph>
              <Button type="default" size="large" ghost={isDark}
            style={{
              borderColor: "rgba(255,255,255,0.2)",
              height: 56,
              padding: "0 40px",
              fontSize: 16,
            }} icon={<ArrowRightOutlined />}>
                Learn more
              </Button>
            </motion.div>
          </Col>

          {/* Visual Side */}
          <Col xs={24} md={12}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{
                background: mode === 'dark' ? '#1f1f1f' : '#e6f7ff',
                height: 400,
                borderRadius: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}
            >
              {image || <span style={{ opacity: 0.2, fontSize: 100 }}>🖼️</span>}
            </motion.div>
          </Col>
        </Row>
      </div>
    </section>
  );
};