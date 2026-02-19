"use client";

import React from "react";
import { Row, Col, Typography, Card, theme } from "antd";
import { useTheme } from "@repo/ui/ThemeContext";
import { motion } from "framer-motion";
import { GlobalOutlined, TeamOutlined, RocketOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

export const Features = () => {
  const { colors, mode } = useTheme();
  const isDark = mode === "dark";
  const { token } = theme.useToken();

  const cardStyle: React.CSSProperties = {
    height: "100%",
    borderRadius: 24,
    border: "none",
    background: isDark ? "#141414" : "#f5f5f5",
    overflow: "hidden",
  };

  return (
    <section style={{ padding: "100px 24px", background: colors.navBg }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Title level={2} style={{ color: colors.navText, fontSize: 36, marginBottom: 16 }}>
              A Complete Ecosystem
            </Title>
            <Paragraph style={{ fontSize: 18, color: colors.navSubText, maxWidth: 600, margin: "0 auto" }}>
              Everything you need to organize, preserve, and collaborate in one modular platform.
            </Paragraph>
          </motion.div>
        </div>

        {/* Bento Grid */}
        <Row gutter={[24, 24]}>
          {/* Large Left Card */}
          <Col xs={24} md={14}>
            <motion.div whileHover={{ y: -5 }} style={{ height: "100%" }}>
              <Card style={{ ...cardStyle, background: isDark ? "#1f1f1f" : "#fff", border: `1px solid ${token.colorBorderSecondary}` }}>
                <div style={{ padding: 24, height: 340, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: "#52c41a", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                      <GlobalOutlined style={{ fontSize: 24, color: "#fff" }} />
                    </div>
                    <Title level={3} style={{ margin: 0 }}>We Preserve</Title>
                    <Paragraph type="secondary">Map environmental data and track conservation efforts globally.</Paragraph>
                  </div>
                  <div style={{ 
                      height: 120, 
                      background: isDark ? "rgba(82,196,26,0.1)" : "rgba(82,196,26,0.1)", 
                      borderRadius: 16, 
                      backgroundImage: "radial-gradient(#52c41a 1px, transparent 1px)", 
                      backgroundSize: "20px 20px" 
                  }} />
                </div>
              </Card>
            </motion.div>
          </Col>

          {/* Right Column Stack */}
          <Col xs={24} md={10}>
            <Row gutter={[24, 24]} style={{ height: "100%" }}>
              <Col span={24}>
                <motion.div whileHover={{ y: -5 }} style={{ height: "100%" }}>
                  <Card style={{ ...cardStyle, background: "#fa8c16", color: "white" }} styles={{body: { padding: 32 }}}>
                    <TeamOutlined style={{ fontSize: 32, marginBottom: 16, opacity: 0.9 }} />
                    <Title level={3} style={{ color: "white", marginTop: 0 }}>We Learn</Title>
                    <Paragraph style={{ color: "rgba(255,255,255,0.8)" }}>Collaborative courses and wikis for community knowledge sharing.</Paragraph>
                  </Card>
                </motion.div>
              </Col>
              <Col span={24}>
                <motion.div whileHover={{ y: -5 }} style={{ height: "100%" }}>
                  <Card style={{ ...cardStyle, background: isDark ? "#003a8c" : "#e6f7ff" }} styles={{body: { padding: 32 }}}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                      <div>
                        <Title level={3} style={{ color: isDark ? "#fff" : "#0050B3", marginTop: 0 }}>We Work</Title>
                        <Paragraph style={{ color: isDark ? "rgba(255,255,255,0.7)" : "#0050B3" }}>Async tools for distributed teams.</Paragraph>
                      </div>
                      <RocketOutlined style={{ fontSize: 32, color: isDark ? "#fff" : "#0050B3" }} />
                    </div>
                  </Card>
                </motion.div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </section>
  );
};