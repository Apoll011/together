"use client";

import React from "react";
import { Row, Col, Typography, Divider } from "antd";
import { useTheme } from "@repo/ui/ThemeContext";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

const stats = [
  { label: "Active Contributors", value: "12k+" },
  { label: "Data Points Mapped", value: "8.5M" },
  { label: "Communities", value: "450+" },
  { label: "Open Source Repos", value: "99%" },
];

export const Stats = () => {
  const { colors, mode } = useTheme();
  
  return (
    <section style={{ background: colors.navBg, padding: "60px 24px" }}>
       <Divider style={{ borderColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)', margin: "0 auto 60px", maxWidth: 1280 }} />
      
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <Row gutter={[32, 32]} justify="center">
          {stats.map((stat, i) => (
            <Col key={stat.label} xs={12} md={6} style={{ textAlign: "center" }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Title level={2} style={{ margin: 0, fontSize: 42, color: colors.navText }}>
                  {stat.value}
                </Title>
                <Text style={{ color: colors.navSubText, textTransform: "uppercase", fontSize: 12, letterSpacing: "1px", fontWeight: 600 }}>
                  {stat.label}
                </Text>
              </motion.div>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};