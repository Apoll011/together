"use client";

import React, { useState } from "react";
import {
  Typography,
  Button,
  Tag,
  Collapse,
  Steps,
  Row,
  Col,
  Divider,
  Badge,
} from "antd";
import {
  ArrowLeftOutlined,
  CloudDownloadOutlined,
  AppleOutlined,
  AndroidOutlined,
  GlobalOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  CalendarOutlined,
  TeamOutlined,
  UserOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useTheme } from "@repo/ui/ThemeContext";
import { AppData } from "@repo/together-apps/data";
import Link from "next/link";

const { Title, Paragraph, Text } = Typography;

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status, color }: { status: AppData["status"]; color: string }) {
  const configs = {
    launched: { label: "Live", bg: color, text: "#fff" },
    beta: { label: "Beta", bg: "#fa8c16", text: "#fff" },
    planning: { label: "In Planning", bg: "transparent", text: color },
  };
  const cfg = configs[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 14px",
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: 0.3,
        background: cfg.bg,
        color: cfg.text,
        border: status === "planning" ? `1.5px solid ${color}` : "none",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: status === "planning" ? color : "#fff",
          display: "inline-block",
        }}
      />
      {cfg.label}
    </span>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <Text
      style={{
        display: "block",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 2,
        textTransform: "uppercase",
        opacity: 0.45,
        marginBottom: 16,
      }}
    >
      {label}
    </Text>
  );
}

function StatCard({
  value,
  label,
  color,
  isDark,
}: {
  value: string;
  label: string;
  color: string;
  isDark: boolean;
}) {
  return (
    <div
      style={{
        padding: "28px 24px",
        borderRadius: 12,
        background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: "clamp(26px, 3vw, 36px)",
          fontWeight: 800,
          color: color,
          lineHeight: 1,
          marginBottom: 8,
          letterSpacing: -1,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 13, opacity: 0.55, fontWeight: 500 }}>{label}</div>
    </div>
  );
}

function MockupCard({
  title,
  description,
  color,
  index,
  isDark,
}: {
  title: string;
  description: string;
  color: string;
  index: number;
  isDark: boolean;
}) {
  return (
    <div
      style={{
        borderRadius: 16,
        overflow: "hidden",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
        background: isDark ? "rgba(255,255,255,0.03)" : "#fff",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 20px 40px ${color}20`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      {/* Mockup Preview Area */}
      <div
        style={{
          height: 200,
          background: `linear-gradient(135deg, ${color}18 0%, ${color}08 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative grid lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(${color}12 1px, transparent 1px),
              linear-gradient(90deg, ${color}12 1px, transparent 1px)
            `,
            backgroundSize: "24px 24px",
          }}
        />
        {/* Screen frame placeholder */}
        <div
          style={{
            width: 120,
            height: 140,
            borderRadius: 12,
            background: isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.9)",
            border: `1.5px solid ${color}40`,
            display: "flex",
            flexDirection: "column",
            padding: 10,
            gap: 6,
            boxShadow: `0 8px 24px ${color}30`,
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Fake UI bars */}
          <div
            style={{
              height: 8,
              borderRadius: 4,
              background: color,
              width: "70%",
              opacity: 0.7,
            }}
          />
          {[80, 60, 90, 50, 75].map((w, i) => (
            <div
              key={i}
              style={{
                height: 6,
                borderRadius: 3,
                background: color,
                width: `${w}%`,
                opacity: 0.15 + i * 0.05,
              }}
            />
          ))}
          <div
            style={{
              marginTop: "auto",
              height: 28,
              borderRadius: 6,
              background: color,
              opacity: 0.9,
            }}
          />
        </div>
        {/* Screen number */}
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 14,
            fontSize: 11,
            fontWeight: 700,
            color: color,
            opacity: 0.5,
            letterSpacing: 1,
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>
      </div>
      {/* Caption */}
      <div style={{ padding: "16px 20px 20px" }}>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 13, opacity: 0.55, lineHeight: 1.5 }}>{description}</div>
      </div>
    </div>
  );
}

function TestimonialCard({
  testimonial,
  color,
  isDark,
}: {
  testimonial: AppData["testimonials"][0];
  color: string;
  isDark: boolean;
}) {
  return (
    <div
      style={{
        padding: "28px",
        borderRadius: 16,
        background: isDark ? "rgba(255,255,255,0.03)" : "#fff",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
        display: "flex",
        flexDirection: "column",
        gap: 20,
        height: "100%",
      }}
    >
      {/* Quote mark */}
      <div style={{ fontSize: 48, color: color, lineHeight: 1, opacity: 0.3, fontFamily: "Georgia, serif" }}>
        "
      </div>
      <Paragraph
        style={{
          fontSize: 15,
          lineHeight: 1.7,
          margin: 0,
          opacity: 0.8,
          flex: 1,
          fontStyle: "italic",
        }}
      >
        {testimonial.quote}
      </Paragraph>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: testimonial.avatarColor || color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 14,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {testimonial.initials}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{testimonial.name}</div>
          <div style={{ fontSize: 12, opacity: 0.5 }}>
            {testimonial.role} · {testimonial.location}
          </div>
        </div>
      </div>
    </div>
  );
}

function RoadmapItem({
  item,
  color,
  isDark,
}: {
  item: AppData["roadmap"][0];
  color: string;
  isDark: boolean;
}) {
  const statusConfig = {
    done: { icon: <CheckCircleFilled style={{ color: "#52c41a", fontSize: 16 }} />, label: "Completed" },
    "in-progress": { icon: <ClockCircleOutlined style={{ color: color, fontSize: 16 }} />, label: "In Progress" },
    planned: { icon: <CalendarOutlined style={{ color: "rgba(128,128,128,0.5)", fontSize: 16 }} />, label: "Planned" },
  };
  const cfg = statusConfig[item.status];

  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        padding: "20px 0",
        borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`,
      }}
    >
      <div style={{ paddingTop: 2, flexShrink: 0 }}>{cfg.icon}</div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
            marginBottom: 4,
          }}
        >
          <Text style={{ fontWeight: 700, fontSize: 15 }}>{item.title}</Text>
          <Text
            style={{
              fontSize: 11,
              fontWeight: 600,
              opacity: 0.4,
              letterSpacing: 0.5,
            }}
          >
            {item.quarter}
          </Text>
        </div>
        <Paragraph style={{ margin: 0, opacity: 0.55, fontSize: 14 }}>{item.desc}</Paragraph>
      </div>
      <div style={{ flexShrink: 0, paddingTop: 2 }}>
        <span
          style={{
            fontSize: 11,
            padding: "2px 10px",
            borderRadius: 999,
            background:
              item.status === "done"
                ? "rgba(82,196,26,0.1)"
                : item.status === "in-progress"
                ? `${color}15`
                : isDark
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.04)",
            color:
              item.status === "done"
                ? "#52c41a"
                : item.status === "in-progress"
                ? color
                : "rgba(128,128,128,0.6)",
            fontWeight: 600,
          }}
        >
          {cfg.label}
        </span>
      </div>
    </div>
  );
}

// ─── Section Wrapper ───────────────────────────────────────────────────────────

function Section({
  children,
  style,
  muted,
  isDark,
  colors,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  muted?: boolean;
  isDark: boolean;
  colors: any;
}) {
  return (
    <section
      style={{
        padding: "80px 24px",
        background: muted
          ? isDark
            ? "rgba(255,255,255,0.02)"
            : "rgba(0,0,0,0.015)"
          : colors.navBg,
        ...style,
      }}
    >
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>{children}</div>
    </section>
  );
}

// ─── Platform Buttons ──────────────────────────────────────────────────────────

function PlatformButtons({
  app,
  size = "large",
}: {
  app: AppData;
  size?: "large" | "middle";
}) {
  if (app.status === "launched") {
    return (
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {app.platforms.web && (
          <Button
            type="primary"
            size={size}
            icon={<GlobalOutlined />}
            style={{ background: app.color, borderColor: app.color, borderRadius: 8 }}
          >
            Open Web App
          </Button>
        )}
        {app.platforms.ios && (
          <Button
            size={size}
            icon={<AppleOutlined />}
            style={{ borderRadius: 8 }}
          >
            App Store
          </Button>
        )}
        {app.platforms.android && (
          <Button
            size={size}
            icon={<AndroidOutlined />}
            style={{ borderRadius: 8 }}
          >
            Google Play
          </Button>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
      <Button
        type="primary"
        size={size}
        style={{
          background: app.color,
          borderColor: app.color,
          borderRadius: 8,
        }}
        href={app.waitlistUrl || "#waitlist"}
      >
        Join the Waitlist <ArrowRightOutlined />
      </Button>
      {app.communityCount && (
        <Text style={{ opacity: 0.45, fontSize: 13 }}>
          {app.communityCount}
        </Text>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function AppPageClient({ app }: { app: AppData }) {
  const { colors, mode } = useTheme();
  const isDark = mode === "dark";
  const [faqOpen, setFaqOpen] = useState<string[]>([]);

  const hasTestimonials = app.testimonials && app.testimonials.length > 0;
  const hasTeam = app.team && app.team.length > 0;
  const hasRoadmap = app.roadmap && app.roadmap.length > 0;
  const hasFaqs = app.faqs && app.faqs.length > 0;
  const hasStats = app.stats && app.stats.length > 0;
  const hasMockups = app.mockups && app.mockups.length > 0;
  const hasHowItWorks = app.howItWorks && app.howItWorks.length > 0;

  return (
    <main style={{ background: colors.navBg, minHeight: "100vh", color: colors.navText }}>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "120px 24px 100px",
          background: isDark
            ? `radial-gradient(ellipse 80% 50% at 50% -10%, ${app.color}20 0%, transparent 70%)`
            : `radial-gradient(ellipse 80% 50% at 50% -10%, ${app.color}12 0%, transparent 70%)`,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Back link */}
        <div style={{ position: "absolute", top: 24, left: 24 }}>
          <Link href="/apps">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              style={{ opacity: 0.55 }}
            >
              All Apps
            </Button>
          </Link>
        </div>

        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          {/* App Icon */}
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: app.color,
              color: "#fff",
              fontSize: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
              boxShadow: `0 12px 32px ${app.color}45`,
            }}
          >
            {app.icon}
          </div>

          {/* Status */}
          <div style={{ marginBottom: 16 }}>
            <StatusBadge status={app.status} color={app.color} />
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: "clamp(40px, 5vw, 64px)",
              fontWeight: 800,
              letterSpacing: -2,
              margin: "0 0 16px",
              lineHeight: 1.05,
              color: colors.navText,
            }}
          >
            Together{" "}
            <span style={{ color: app.color }}>{app.label}</span>
          </h1>

          {/* Tagline */}
          <p
            style={{
              fontSize: "clamp(16px, 2vw, 20px)",
              opacity: 0.55,
              margin: "0 0 40px",
              lineHeight: 1.5,
            }}
          >
            {app.tagline}
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <PlatformButtons app={app} />
          </div>

          {/* Community count */}
          {app.communityCount && app.status !== "launched" && null}
          {app.communityCount && app.status === "launched" && (
            <p style={{ marginTop: 24, opacity: 0.35, fontSize: 13 }}>
              Trusted by {app.communityCount} contributors worldwide
            </p>
          )}
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────────── */}
      {hasStats && (
        <Section isDark={isDark} colors={colors} muted>
          <Row gutter={[16, 16]}>
            {app.stats.map((stat, i) => (
              <Col key={i} xs={12} sm={12} md={6}>
                <StatCard {...stat} color={app.color} isDark={isDark} />
              </Col>
            ))}
          </Row>
        </Section>
      )}

      {/* ── WHAT IS IT ───────────────────────────────────────────────────────── */}
      <Section isDark={isDark} colors={colors}>
        <Row gutter={[64, 48]} align="middle">
          <Col xs={24} md={12}>
            <SectionLabel label="About" />
            <Title
              level={2}
              style={{
                fontSize: "clamp(28px, 3vw, 40px)",
                fontWeight: 800,
                letterSpacing: -1,
                margin: "0 0 20px",
                color: colors.navText,
              }}
            >
              What is Together {app.label}?
            </Title>
            <Paragraph
              style={{
                fontSize: 17,
                lineHeight: 1.75,
                opacity: 0.65,
                margin: 0,
              }}
            >
              {app.longDescription}
            </Paragraph>
            <div style={{ marginTop: 32 }}>
              <PlatformButtons app={app} size="middle" />
            </div>
          </Col>
          <Col xs={24} md={12}>
            {/* Visual placeholder */}
            <div
              style={{
                borderRadius: 20,
                background: isDark
                  ? `linear-gradient(135deg, ${app.color}15, ${app.color}06)`
                  : `linear-gradient(135deg, ${app.color}10, ${app.color}04)`,
                border: `1px solid ${app.color}20`,
                height: 320,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: app.color,
                fontSize: 96,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Background pattern */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `radial-gradient(${app.color}15 1.5px, transparent 1.5px)`,
                  backgroundSize: "28px 28px",
                }}
              />
              <span style={{ position: "relative", zIndex: 1, opacity: 0.7 }}>
                {app.icon}
              </span>
            </div>
          </Col>
        </Row>
      </Section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────────── */}
      {hasHowItWorks && (
        <Section isDark={isDark} colors={colors} muted>
          <SectionLabel label="Process" />
          <Title
            level={2}
            style={{
              fontSize: "clamp(26px, 3vw, 38px)",
              fontWeight: 800,
              letterSpacing: -1,
              marginBottom: 52,
              color: colors.navText,
            }}
          >
            How it works
          </Title>
          <Row gutter={[32, 40]}>
            {app.howItWorks.map((step, i) => (
              <Col key={i} xs={24} sm={12} md={6}>
                <div>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: `${app.color}18`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 16,
                      fontWeight: 800,
                      fontSize: 18,
                      color: app.color,
                    }}
                  >
                    {step.step}
                  </div>
                  <Text
                    style={{
                      display: "block",
                      fontWeight: 700,
                      fontSize: 16,
                      marginBottom: 8,
                      color: colors.navText,
                    }}
                  >
                    {step.title}
                  </Text>
                  <Paragraph
                    style={{ margin: 0, opacity: 0.55, fontSize: 14, lineHeight: 1.6 }}
                  >
                    {step.desc}
                  </Paragraph>
                </div>
              </Col>
            ))}
          </Row>
        </Section>
      )}

      {/* ── FEATURES ─────────────────────────────────────────────────────────── */}
      {app.features && app.features.length > 0 && (
        <Section isDark={isDark} colors={colors}>
          <SectionLabel label="Features" />
          <Title
            level={2}
            style={{
              fontSize: "clamp(26px, 3vw, 38px)",
              fontWeight: 800,
              letterSpacing: -1,
              marginBottom: 52,
              color: colors.navText,
            }}
          >
            Everything you need
          </Title>
          <Row gutter={[24, 24]}>
            {app.features.map((feature, i) => (
              <Col key={i} xs={24} sm={12} md={8}>
                <div
                  style={{
                    padding: "24px",
                    borderRadius: 14,
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}`,
                    background: isDark ? "rgba(255,255,255,0.02)" : "#fff",
                    height: "100%",
                    transition: "border-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = `${app.color}50`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = isDark
                      ? "rgba(255,255,255,0.07)"
                      : "rgba(0,0,0,0.06)";
                  }}
                >
                  {/* Feature accent line */}
                  <div
                    style={{
                      width: 32,
                      height: 3,
                      borderRadius: 2,
                      background: app.color,
                      marginBottom: 16,
                      opacity: 0.8,
                    }}
                  />
                  <Text
                    style={{
                      display: "block",
                      fontWeight: 700,
                      fontSize: 15,
                      marginBottom: 8,
                      color: colors.navText,
                    }}
                  >
                    {feature.title}
                  </Text>
                  <Paragraph
                    style={{ margin: 0, opacity: 0.55, fontSize: 14, lineHeight: 1.6 }}
                  >
                    {feature.desc}
                  </Paragraph>
                </div>
              </Col>
            ))}
          </Row>
        </Section>
      )}

      {/* ── MOCKUP GALLERY ───────────────────────────────────────────────────── */}
      {hasMockups && (
        <Section isDark={isDark} colors={colors} muted>
          <SectionLabel label="Preview" />
          <Title
            level={2}
            style={{
              fontSize: "clamp(26px, 3vw, 38px)",
              fontWeight: 800,
              letterSpacing: -1,
              marginBottom: 52,
              color: colors.navText,
            }}
          >
            A look inside
          </Title>
          <Row gutter={[24, 24]}>
            {app.mockups.map((mockup, i) => (
              <Col key={i} xs={24} sm={12} md={6}>
                <MockupCard
                  {...mockup}
                  index={i}
                  color={app.color}
                  isDark={isDark}
                />
              </Col>
            ))}
          </Row>
        </Section>
      )}

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────────── */}
      {hasTestimonials && (
        <Section isDark={isDark} colors={colors}>
          <SectionLabel label="Community" />
          <Title
            level={2}
            style={{
              fontSize: "clamp(26px, 3vw, 38px)",
              fontWeight: 800,
              letterSpacing: -1,
              marginBottom: 52,
              color: colors.navText,
            }}
          >
            What people are saying
          </Title>
          <Row gutter={[24, 24]}>
            {app.testimonials.map((t, i) => (
              <Col key={i} xs={24} md={app.testimonials.length === 2 ? 12 : 8}>
                <TestimonialCard
                  testimonial={t}
                  color={app.color}
                  isDark={isDark}
                />
              </Col>
            ))}
          </Row>
        </Section>
      )}

      {/* ── ROADMAP ──────────────────────────────────────────────────────────── */}
      {hasRoadmap && (
        <Section isDark={isDark} colors={colors} muted>
          <Row gutter={[64, 48]}>
            <Col xs={24} md={8}>
              <SectionLabel label="Roadmap" />
              <Title
                level={2}
                style={{
                  fontSize: "clamp(26px, 3vw, 38px)",
                  fontWeight: 800,
                  letterSpacing: -1,
                  margin: "0 0 16px",
                  color: colors.navText,
                }}
              >
                What we're building
              </Title>
              <Paragraph style={{ opacity: 0.5, fontSize: 15, lineHeight: 1.7 }}>
                Our public roadmap. We build in the open and welcome community feedback at every stage.
              </Paragraph>
              {app.status !== "launched" && (
                <div style={{ marginTop: 24 }}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "10px 16px",
                      borderRadius: 10,
                      background: `${app.color}12`,
                      border: `1px solid ${app.color}25`,
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{app.icon}</span>
                    <div>
                      <div style={{ fontSize: 12, opacity: 0.5 }}>In planning</div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: app.color }}>
                        Together {app.label}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Col>
            <Col xs={24} md={16}>
              {app.roadmap.map((item, i) => (
                <RoadmapItem key={i} item={item} color={app.color} isDark={isDark} />
              ))}
            </Col>
          </Row>
        </Section>
      )}

      {/* ── TEAM ─────────────────────────────────────────────────────────────── */}
      {hasTeam && (
        <Section isDark={isDark} colors={colors}>
          <SectionLabel label="Team" />
          <Title
            level={2}
            style={{
              fontSize: "clamp(26px, 3vw, 38px)",
              fontWeight: 800,
              letterSpacing: -1,
              marginBottom: 48,
              color: colors.navText,
            }}
          >
            The people behind {app.label}
          </Title>
          <Row gutter={[20, 20]}>
            {app.team.map((member, i) => (
              <Col key={i} xs={12} sm={8} md={6} lg={4}>
                <div
                  style={{
                    padding: "20px 16px",
                    borderRadius: 14,
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}`,
                    textAlign: "center",
                    background: isDark ? "rgba(255,255,255,0.02)" : "#fff",
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      background: `${app.color}20`,
                      border: `2px solid ${app.color}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 12px",
                      fontSize: 15,
                      fontWeight: 800,
                      color: app.color,
                    }}
                  >
                    {member.initials}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>
                    {member.name}
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.45 }}>{member.role}</div>
                </div>
              </Col>
            ))}

            {/* Open roles card */}
            <Col xs={12} sm={8} md={6} lg={4}>
              <div
                style={{
                  padding: "20px 16px",
                  borderRadius: 14,
                  border: `1.5px dashed ${app.color}30`,
                  textAlign: "center",
                  background: "transparent",
                  cursor: "pointer",
                  opacity: 0.6,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <div style={{ fontSize: 24, color: app.color }}>+</div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>Join us</div>
              </div>
            </Col>
          </Row>
        </Section>
      )}

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      {hasFaqs && (
        <Section isDark={isDark} colors={colors} muted>
          <Row gutter={[64, 48]}>
            <Col xs={24} md={8}>
              <SectionLabel label="FAQ" />
              <Title
                level={2}
                style={{
                  fontSize: "clamp(26px, 3vw, 38px)",
                  fontWeight: 800,
                  letterSpacing: -1,
                  margin: "0 0 16px",
                  color: colors.navText,
                }}
              >
                Common questions
              </Title>
              <Paragraph style={{ opacity: 0.5, fontSize: 15 }}>
                Can't find what you're looking for?{" "}
                <a style={{ color: app.color }}>Reach out to us.</a>
              </Paragraph>
            </Col>
            <Col xs={24} md={16}>
              <Collapse
                variant={"borderless"}
                activeKey={faqOpen}
                onChange={(keys) => setFaqOpen(keys as string[])}
                style={{ background: "transparent" }}
                items={app.faqs.map((faq, i) => ({
                  key: String(i),
                  label: (
                    <Text style={{ fontWeight: 600, fontSize: 15 }}>{faq.question}</Text>
                  ),
                  children: (
                    <Paragraph style={{ opacity: 0.6, margin: 0, lineHeight: 1.7 }}>
                      {faq.answer}
                    </Paragraph>
                  ),
                  style: {
                    marginBottom: 8,
                    borderRadius: "10px !important",
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}`,
                    overflow: "hidden",
                    background: isDark ? "rgba(255,255,255,0.02)" : "#fff",
                  },
                }))}
              />
            </Col>
          </Row>
        </Section>
      )}

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "100px 24px",
          textAlign: "center",
          background: isDark
            ? `radial-gradient(ellipse 60% 60% at 50% 100%, ${app.color}18 0%, transparent 70%)`
            : `radial-gradient(ellipse 60% 60% at 50% 100%, ${app.color}10 0%, transparent 70%)`,
        }}
      >
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: app.color,
              color: "#fff",
              fontSize: 26,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
              boxShadow: `0 8px 24px ${app.color}40`,
            }}
          >
            {app.icon}
          </div>

          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 800,
              letterSpacing: -1.5,
              margin: "0 0 16px",
              color: colors.navText,
            }}
          >
            {app.status === "launched"
              ? `Start using Together ${app.label}`
              : `Be the first to experience Together ${app.label}`}
          </h2>

          <p
            style={{
              fontSize: 17,
              opacity: 0.5,
              margin: "0 0 36px",
              lineHeight: 1.6,
            }}
          >
            {app.status === "launched"
              ? "Free to use. Open to everyone. Part of a bigger mission."
              : `${app.communityCount || "Thousands"} already waiting. Join the community shaping what comes next.`}
          </p>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <PlatformButtons app={app} />
          </div>

          <p style={{ marginTop: 28, opacity: 0.3, fontSize: 13 }}>
            Part of the{" "}
            <Link href="/" style={{ color: colors.navText, opacity: 1 }}>
              Together ecosystem
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}