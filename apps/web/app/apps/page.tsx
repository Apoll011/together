"use client";

import React, { useState } from "react";
import { Typography, Button } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useTheme } from "@repo/ui/ThemeContext";
import { appsData } from "@together/apps-repo/data";
import { AppData, AppStatus } from "@together/apps-repo/types"

const { Title, Paragraph, Text } = Typography;

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterKey = "all" | AppStatus;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<AppStatus, string> = {
  launched: "Live",
  beta: "Beta",
  planning: "Coming Soon",
};

const STATUS_DOT_COLOR: Record<AppStatus, string> = {
  launched: "#52c41a",
  beta: "#fa8c16",
  planning: "#8c8c8c",
};

function totalWaitlist(): string {
  let n = 0;
  appsData.forEach((a) => {
    const match = a.communityCount?.replace(/[^0-9]/g, "");
    if (match) n += parseInt(match, 10);
  });
  return n > 1000 ? `${Math.round(n / 1000)}K+` : `${n}+`;
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusPill({ status, color }: { status: AppStatus; color: string }) {
  const isLive = status === "launched";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 10px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.4,
        textTransform: "uppercase",
        background: isLive ? `${color}18` : "rgba(128,128,128,0.08)",
        color: isLive ? color : "#8c8c8c",
        border: `1px solid ${isLive ? `${color}30` : "rgba(128,128,128,0.15)"}`,
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: STATUS_DOT_COLOR[status],
          display: "inline-block",
          boxShadow: isLive ? `0 0 4px ${color}` : "none",
        }}
      />
      {STATUS_LABEL[status]}
    </span>
  );
}

// ─── App Card ─────────────────────────────────────────────────────────────────

function AppCard({
  app,
  isDark,
  featured = false,
}: {
  app: AppData;
  isDark: boolean;
  featured?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link href={`/apps/${app.slug}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          height: "100%",
          borderRadius: featured ? 20 : 16,
          border: `1px solid ${
            hovered
              ? `${app.color}40`
              : isDark
              ? "rgba(255,255,255,0.07)"
              : "rgba(0,0,0,0.07)"
          }`,
          background: isDark ? "rgba(255,255,255,0.02)" : "#fff",
          overflow: "hidden",
          transition: "border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",
          transform: hovered ? "translateY(-3px)" : "translateY(0)",
          boxShadow: hovered ? `0 16px 40px ${app.color}18` : "none",
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
          position: "relative",
        }}
      >
        {/* Card body */}
        <div style={{ padding: featured ? "28px 28px 24px" : "22px 22px 20px", flex: 1, display: "flex", flexDirection: "column" }}>

          {/* Header row */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
            {/* Icon */}
            <div
              style={{
                width: featured ? 52 : 44,
                height: featured ? 52 : 44,
                borderRadius: featured ? 14 : 11,
                background: `${app.color}18`,
                border: `1.5px solid ${app.color}28`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: app.color,
                fontSize: featured ? 24 : 20,
                flexShrink: 0,
                transition: "background 0.2s",
                ...(hovered ? { background: `${app.color}28` } : {}),
              }}
            >
              {app.icon}
            </div>

            <StatusPill status={app.status} color={app.color} />
          </div>

          {/* Name + tagline */}
          <div style={{ flex: 1 }}>
            <Text
              style={{
                display: "block",
                fontWeight: 800,
                fontSize: featured ? 20 : 16,
                letterSpacing: -0.4,
                marginBottom: 6,
                color: "inherit",
                lineHeight: 1.2,
              }}
            >
              {app.label}
            </Text>
            <Text
              style={{
                display: "block",
                fontSize: featured ? 14 : 13,
                opacity: 0.45,
                fontWeight: 500,
                marginBottom: 14,
                lineHeight: 1.4,
              }}
            >
              {app.tagline}
            </Text>
            <Paragraph
              style={{
                margin: 0,
                fontSize: 13,
                opacity: 0.55,
                lineHeight: 1.6,
                display: featured ? "block" : "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: featured ? "visible" : "hidden",
              }}
            >
              {app.description}
            </Paragraph>
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 20,
              paddingTop: 16,
              borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`,
            }}
          >
            {/* Community count or platforms */}
            <Text style={{ fontSize: 12, opacity: 0.35, fontWeight: 500 }}>
              {app.communityCount
                ? app.status === "launched"
                  ? `${app.communityCount} contributors`
                  : app.communityCount
                : ""}
            </Text>

            {/* Arrow */}
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: hovered ? app.color : `${app.color}15`,
                color: hovered ? "#fff" : app.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                transition: "background 0.2s, color 0.2s",
                flexShrink: 0,
              }}
            >
              <ArrowRightOutlined />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Filter Bar ───────────────────────────────────────────────────────────────

function FilterBar({
  active,
  onChange,
  isDark,
  counts,
}: {
  active: FilterKey;
  onChange: (f: FilterKey) => void;
  isDark: boolean;
  counts: Record<FilterKey, number>;
}) {
  const filters: { key: FilterKey; label: string }[] = [
    { key: "all", label: "All" },
    { key: "launched", label: "Live Now" },
    { key: "planning", label: "Coming Soon" },
  ];

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "4px",
        borderRadius: 12,
        background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}`,
      }}
    >
      {filters.map((f) => {
        const isActive = active === f.key;
        return (
          <button
            key={f.key}
            onClick={() => onChange(f.key)}
            style={{
              padding: "7px 16px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: isActive ? 700 : 500,
              background: isActive
                ? isDark
                  ? "rgba(255,255,255,0.1)"
                  : "#fff"
                : "transparent",
              color: isActive ? (isDark ? "#fff" : "#000") : "rgba(128,128,128,0.7)",
              boxShadow: isActive
                ? isDark
                  ? "none"
                  : "0 1px 3px rgba(0,0,0,0.1)"
                : "none",
              transition: "all 0.15s ease",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {f.label}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 18,
                height: 18,
                borderRadius: 999,
                background: isActive
                  ? isDark
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(0,0,0,0.07)"
                  : "transparent",
                fontSize: 10,
                fontWeight: 700,
              }}
            >
              {counts[f.key]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Ecosystem Stats Banner ───────────────────────────────────────────────────

function EcosystemStats({ isDark }: { isDark: boolean }) {
  const stats = [
    { value: "10", label: "Apps" },
    { value: "1", label: "Live Today" },
    { value: totalWaitlist(), label: "Waitlist & Users" },
    { value: "190+", label: "Countries" },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 0,
        borderRadius: 16,
        overflow: "hidden",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}`,
      }}
    >
      {stats.map((s, i) => (
        <div
          key={i}
          style={{
            padding: "24px 20px",
            textAlign: "center",
            borderRight:
              i < stats.length - 1
                ? `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}`
                : "none",
            background: isDark ? "rgba(255,255,255,0.02)" : "#fff",
          }}
        >
          <div
            style={{
              fontSize: "clamp(22px, 2.5vw, 32px)",
              fontWeight: 800,
              letterSpacing: -1,
              lineHeight: 1,
              marginBottom: 6,
            }}
          >
            {s.value}
          </div>
          <div style={{ fontSize: 12, opacity: 0.4, fontWeight: 500 }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AllAppsPage() {
  const { colors, mode } = useTheme();
  const isDark = mode === "dark";
  const [filter, setFilter] = useState<FilterKey>("all");

  const counts: Record<FilterKey, number> = {
    all: appsData.length,
    launched: appsData.filter((a) => a.status === "launched").length,
    beta: appsData.filter((a) => a.status === "beta").length,
    planning: appsData.filter((a) => a.status === "planning").length,
  };

  const filtered =
    filter === "all" ? appsData : appsData.filter((a) => a.status === filter);

  // Preserve (launched) gets featured treatment
  const featuredApp = appsData.find((a) => a.status === "launched");
  const gridApps =
    filter === "all"
      ? appsData.filter((a) => a.status !== "launched")
      : filtered;
  const showFeatured = filter === "all" || filter === "launched";

  return (
    <main
      style={{
        background: colors.navBg,
        minHeight: "100vh",
        color: colors.navText,
      }}
    >
      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "100px 24px 72px",
          background: isDark
            ? "radial-gradient(ellipse 100% 60% at 50% -20%, rgba(255,255,255,0.04) 0%, transparent 70%)"
            : "radial-gradient(ellipse 100% 60% at 50% -20%, rgba(0,0,0,0.02) 0%, transparent 70%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle constellation of app colors in background */}
        {appsData.map((app, i) => (
          <div
            key={app.key}
            style={{
              position: "absolute",
              width: 160,
              height: 160,
              borderRadius: "50%",
              background: app.color,
              opacity: 0.025,
              filter: "blur(60px)",
              top: `${20 + (i % 3) * 30}%`,
              left: `${5 + i * 9}%`,
              pointerEvents: "none",
            }}
          />
        ))}

        <div style={{ maxWidth: 1080, margin: "0 auto", position: "relative" }}>
          {/* Eyebrow */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              borderRadius: 999,
              background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.07)"}`,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 0.5,
              opacity: 0.7,
              marginBottom: 28,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#52c41a",
                boxShadow: "0 0 6px #52c41a",
                display: "inline-block",
              }}
            />
            Together Ecosystem
          </div>

          <Title
            style={{
              fontSize: "clamp(42px, 5.5vw, 72px)",
              fontWeight: 800,
              letterSpacing: -2.5,
              margin: "0 0 20px",
              lineHeight: 1.02,
              color: colors.navText,
            }}
          >
            One mission,<br />
            <span style={{ opacity: 0.35 }}>ten ways to help.</span>
          </Title>

          <Paragraph
            style={{
              fontSize: "clamp(15px, 1.5vw, 18px)",
              opacity: 0.5,
              maxWidth: 520,
              margin: "0 0 48px",
              lineHeight: 1.7,
            }}
          >
            Together is a suite of apps connecting people around shared challenges. From environmental action to mental health, food security, and lifelong learning.
          </Paragraph>

          {/* Ecosystem stats */}
          <div style={{ maxWidth: 640 }}>
            <EcosystemStats isDark={isDark} />
          </div>
        </div>
      </section>

      {/* ── APP GRID ───────────────────────────────────────────────────────── */}
      <section style={{ padding: "0 24px 100px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>

          {/* Filter bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 40,
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <FilterBar
              active={filter}
              onChange={setFilter}
              isDark={isDark}
              counts={counts}
            />
            <Text style={{ opacity: 0.35, fontSize: 13 }}>
              {filtered.length} app{filtered.length !== 1 ? "s" : ""}
            </Text>
          </div>

          {/* Featured — Preserve */}
          {showFeatured && featuredApp && (
            <div style={{ marginBottom: 24 }}>
              {/* Section label */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 16,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    opacity: 0.35,
                  }}
                >
                  Available Now
                </Text>
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
                  }}
                />
              </div>

              {/* Featured card — wide layout */}
              <Link href={`/apps/${featuredApp.slug}`} style={{ textDecoration: "none", display: "block" }}>
                <FeaturedCard app={featuredApp} isDark={isDark} colors={colors} />
              </Link>
            </div>
          )}

          {/* Coming soon grid */}
          {(filter === "all" || filter === "planning") && (
            <div>
              {filter === "all" && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 16,
                    marginTop: filter === "all" ? 40 : 0,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      opacity: 0.35,
                    }}
                  >
                    In Development
                  </Text>
                  <div
                    style={{
                      flex: 1,
                      height: 1,
                      background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
                    }}
                  />
                </div>
              )}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: 16,
                }}
              >
                {gridApps.map((app) => (
                  <AppCard key={app.key} app={app} isDark={isDark} />
                ))}
              </div>
            </div>
          )}

          {/* All-filter: launched only (no planning label) */}
          {filter === "launched" && filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 0", opacity: 0.3 }}>
              No apps in this category yet.
            </div>
          )}
        </div>
      </section>

      {/* ── BOTTOM CTA ─────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "80px 24px",
          borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <Text
            style={{
              display: "block",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              opacity: 0.35,
              marginBottom: 16,
            }}
          >
            Open Ecosystem
          </Text>
          <h2
            style={{
              fontSize: "clamp(24px, 3vw, 36px)",
              fontWeight: 800,
              letterSpacing: -1,
              margin: "0 0 16px",
              color: colors.navText,
            }}
          >
            Want to shape what comes next?
          </h2>
          <p style={{ opacity: 0.45, fontSize: 15, lineHeight: 1.7, margin: "0 0 32px" }}>
            Together is built in the open. Join the community, contribute ideas, or help build the apps that haven't launched yet.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              type="primary"
              size="large"
              style={{
                background: "#000",
                borderColor: "#000",
                borderRadius: 10,
                height: 44,
                paddingInline: 24,
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Join the Community
            </Button>
            <Button
              size="large"
              style={{
                borderRadius: 10,
                height: 44,
                paddingInline: 24,
                fontSize: 14,
              }}
            >
              View on GitHub
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

// ─── Featured Card (large horizontal layout for launched apps) ────────────────

function FeaturedCard({
  app,
  isDark,
  colors,
}: {
  app: AppData;
  isDark: boolean;
  colors: any;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 20,
        border: `1px solid ${hovered ? `${app.color}40` : isDark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.08)"}`,
        background: isDark
          ? `linear-gradient(135deg, ${app.color}10 0%, rgba(255,255,255,0.02) 60%)`
          : `linear-gradient(135deg, ${app.color}08 0%, #fff 60%)`,
        overflow: "hidden",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        boxShadow: hovered ? `0 20px 60px ${app.color}18` : "none",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        cursor: "pointer",
        position: "relative",
      }}
    >
      {/* Left: content */}
      <div style={{ padding: "40px 40px 40px" }}>
        {/* Top row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: app.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 26,
              boxShadow: `0 8px 24px ${app.color}50`,
            }}
          >
            {app.icon}
          </div>
          <div>
            <StatusPill status={app.status} color={app.color} />
          </div>
        </div>

        <h3
          style={{
            fontSize: "clamp(22px, 2.5vw, 30px)",
            fontWeight: 800,
            letterSpacing: -1,
            margin: "0 0 10px",
            color: colors.navText,
          }}
        >
          {app.label}
        </h3>
        <p
          style={{
            fontSize: 15,
            opacity: 0.45,
            margin: "0 0 16px",
            fontWeight: 500,
          }}
        >
          {app.tagline}
        </p>
        <p
          style={{
            fontSize: 14,
            opacity: 0.6,
            margin: "0 0 32px",
            lineHeight: 1.7,
          }}
        >
          {app.description}
        </p>

        {/* Mini stats */}
        {app.stats && (
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 32 }}>
            {app.stats.slice(0, 3).map((s, i) => (
              <div key={i}>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 18,
                    color: app.color,
                    letterSpacing: -0.5,
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </div>
                <div style={{ fontSize: 11, opacity: 0.4, marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            borderRadius: 10,
            background: app.color,
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
            transition: "opacity 0.2s",
            opacity: hovered ? 1 : 0.9,
          }}
        >
          Explore {app.label} <ArrowRightOutlined />
        </div>
      </div>

      {/* Right: visual */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 280,
          background: isDark
            ? `linear-gradient(135deg, ${app.color}12 0%, ${app.color}06 100%)`
            : `linear-gradient(135deg, ${app.color}08 0%, ${app.color}03 100%)`,
        }}
      >
        {/* Dotgrid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `radial-gradient(${app.color}18 1.5px, transparent 1.5px)`,
            backgroundSize: "24px 24px",
          }}
        />

        {/* Feature list */}
        <div style={{ position: "relative", zIndex: 1, padding: 32, width: "100%" }}>
          {(app.features || []).slice(0, 4).map((f, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                marginBottom: 16,
                opacity: 1 - i * 0.12,
                transform: hovered ? `translateX(${i * -2}px)` : "none",
                transition: `transform 0.3s ease ${i * 0.05}s`,
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 6,
                  background: `${app.color}22`,
                  border: `1px solid ${app.color}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 2,
                    background: app.color,
                  }}
                />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 1 }}>
                  {f.title}
                </div>
                <div style={{ fontSize: 12, opacity: 0.45, lineHeight: 1.4 }}>
                  {f.desc.length > 60 ? f.desc.slice(0, 60) + "…" : f.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}