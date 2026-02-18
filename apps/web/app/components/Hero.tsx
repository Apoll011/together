"use client";

import React from "react";
import { Typography, Button, Space, Row, Col, Card, Avatar, Tag } from "antd";
import {
  ArrowRightOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { useTheme } from "../ThemeContext";
import { motion } from "framer-motion";
import { appsData } from "../data/apps";

const { Title, Paragraph, Text } = Typography;

const ecosystemNodes = appsData.map(app => ({
  key: app.key,
  icon: app.icon,
  label: app.label,
  color: app.color,
  x: app.heroConfig.x,
  y: app.heroConfig.y,
}));

export const Hero = () => {
  const { colors, mode } = useTheme();
  const isDark = mode === "dark";

  const backgroundGradient = isDark
    ? "radial-gradient(circle at 50% 50%, rgba(0, 80, 179, 0.15), rgba(10, 15, 30, 0) 60%)"
    : "radial-gradient(circle at 60% 40%, rgba(24, 144, 255, 0.08), rgba(255, 255, 255, 0) 60%)";

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "140px 24px 100px",
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        background: colors.navBg,
      }}
    >
      {/* Background Ambience */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: backgroundGradient,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%", position: "relative", zIndex: 1 }}>
        <Row gutter={[64, 48]} align="middle">
          <Col xs={24} lg={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 16px",
                  borderRadius: 100,
                  background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
                  marginBottom: 24,
                }}
              >
                <Tag color="blue" style={{ margin: 0, border: "none" }}>v2.0</Tag>
                <Text strong style={{ fontSize: 13, color: colors.navSubText }}>
                  The ecosystem is live
                </Text>
              </div>

              <Title
                level={1}
                style={{
                  fontSize: "clamp(40px, 5vw, 64px)",
                  lineHeight: 1.1,
                  margin: "0 0 24px",
                  color: colors.navText,
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                }}
              >
                Building a better <br />
                future, <span style={{ color: colors.accentText }}>Together.</span>
              </Title>

              <Paragraph
                style={{
                  fontSize: "18px",
                  lineHeight: 1.6,
                  color: colors.navSubText,
                  maxWidth: 540,
                  marginBottom: 32,
                }}
              >
                A modular platform designed to foster community, preservation, and
                learning. Join thousands of creators and activists.
              </Paragraph>

              <Space size="middle" wrap>
                <Button
                  type="primary"
                  size="large"
                  style={{ height: 52, padding: "0 32px", borderRadius: 8 }}
                  icon={<ArrowRightOutlined />}
                >
                  Get Started
                </Button>
                <Button
                  size="large"
                  type="text"
                  style={{ height: 52, color: colors.navText }}
                  icon={<PlayCircleOutlined />}
                >
                  How it works
                </Button>
              </Space>

              <div style={{ marginTop: 40 }}>
                <Text type="secondary" style={{ fontSize: 13, display: "block", marginBottom: 12 }}>
                  Trusted by forward-thinking teams
                </Text>
                <Avatar.Group maxCount={4}>
                  <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=1" />
                  <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=2" />
                  <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=3" />
                  <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=4" />
                </Avatar.Group>
                <span style={{ marginLeft: 12, color: colors.navSubText, fontSize: 13, fontWeight: 500 }}>
                  +2,000 others
                </span>
              </div>
            </motion.div>
          </Col>

          <Col xs={24} lg={12} style={{ height: 500, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
              
              {/* Central Core */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  background: isDark 
                    ? "linear-gradient(135deg, #1d39c4 0%, #0050B3 100%)" 
                    : "linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: isDark 
                    ? "0 0 60px rgba(29, 57, 196, 0.4)" 
                    : "0 20px 40px rgba(24, 144, 255, 0.2)",
                  zIndex: 2,
                  position: "absolute",
                }}
              >
                <span style={{ fontSize: 40 }}>✦</span>
              </motion.div>

              {/* Orbit Rings */}
              <div style={{
                position: "absolute", width: 300, height: 300, borderRadius: "50%",
                border: `1px dashed ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
              }} />
               <div style={{
                position: "absolute", width: 500, height: 500, borderRadius: "50%",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
              }} />

              {/* Floating Cards */}
              {ecosystemNodes.map((node, i) => (
                <FloatingCard key={node.key} node={node} isDark={isDark} colors={colors} delay={i} />
              ))}
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
};

// Fixed Floating Card using Framer Motion
const FloatingCard = ({ node, isDark, colors, delay }: any) => {
  return (
    <motion.div
      initial={{ x: node.x, y: node.y, opacity: 0 }}
      animate={{ 
        opacity: 1,
        y: [node.y, node.y - 15, node.y], // Bobbing effect relative to initial Y
      }}
      transition={{ 
        opacity: { duration: 0.5, delay: delay * 0.1 },
        y: { 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut", 
          delay: delay * 0.5
        }
      }}
      style={{
        position: "absolute",
        zIndex: 10,
      }}
    >
      <Card
        variant={"borderless"}
        style={{
          width: 140,
          background: isDark ? "rgba(30,30,30,0.6)" : "rgba(255,255,255,0.8)",
          backdropFilter: "blur(12px)",
          borderRadius: 12,
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(255,255,255,0.8)",
        }}
        styles={{body: { padding: 12, display: 'flex', alignItems: 'center', gap: 12 }}}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: node.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 16,
          }}
        >
          {node.icon}
        </div>
        <div>
          <Text strong style={{ display: 'block', fontSize: 13, lineHeight: 1, marginBottom: 4, color: colors.navText }}>
            {node.label}
          </Text>
          <Text style={{ fontSize: 10, color: colors.navSubText }}>Module</Text>
        </div>
      </Card>
    </motion.div>
  );
};