"use client";

import React from "react";
import { Button, Typography } from "antd";
import { useTheme } from "../ThemeContext";
import { motion } from "framer-motion";
import { ArrowRightOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

export const CTA = () => {
  const { colors, mode } = useTheme();
  const isDark = mode === "dark";

  return (
    <section style={{ padding: "80px 24px 120px", background: colors.navBg }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <motion.div
          whileHover={{ scale: 1.01 }}
          style={{
            background: isDark
              ? "linear-gradient(135deg, #001529 0%, #003a8c 100%)"
              : "linear-gradient(135deg, #002766 0%, #1890ff 100%)",
            borderRadius: 32,
            padding: "60px 24px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -50,
              left: -50,
              width: 200,
              height: 200,
              background: "rgba(255,255,255,0.1)",
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -50,
              right: -50,
              width: 300,
              height: 300,
              background: "rgba(255,255,255,0.05)",
              borderRadius: "50%",
            }}
          />

          <Title
            level={2}
            style={{
              color: "#fff",
              fontSize: "clamp(28px, 4vw, 48px)",
              marginBottom: 24,
            }}
          >
            Ready to join the movement?
          </Title>
          <Paragraph
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: 18,
              maxWidth: 600,
              margin: "0 auto 40px",
            }}
          >
            Start preserving data, learning together, and building tools for a
            sustainable future today.
          </Paragraph>

          <Button
            size="large"
            ghost={isDark}
            style={{
              borderColor: "rgba(255,255,255,0.2)",
              height: 56,
              padding: "0 40px",
              fontSize: 16,
            }}
          >
            Create Free Account <ArrowRightOutlined />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
