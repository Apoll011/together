"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "@repo/ui/ThemeContext";

// ─── Manifesto Copy ────────────────────────────────────────────────────────────
// Tone: A trusted friend. Apple sharpness. Obama warmth.
// Anchored in the specific moment: we got connected to the internet,
// and somehow disconnected from each other.
// ──────────────────────────────────────────────────────────────────────────────

export default function ManifestoPage() {
  const { colors, mode } = useTheme();
  const isDark = mode === "dark";
  const containerRef = useRef<HTMLDivElement>(null);

  // Fade-in on scroll for each section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = "1";
            (entry.target as HTMLElement).style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.15 }
    );
    const sections = containerRef.current?.querySelectorAll(".manifesto-section");
    sections?.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const sectionStyle: React.CSSProperties = {
    opacity: 0,
    transform: "translateY(28px)",
    transition: "opacity 0.8s ease, transform 0.8s ease",
  };

  const bg = isDark ? "#0d0d0d" : "#faf8f4";
  const ink = isDark ? "#e8e4dc" : "#1a1814";
  const sub = colors.navSubText;
  const accent = colors.accentText;
  const dividerColor = isDark ? "#2a2824" : "#e0dbd2";

  return (
    <main
      ref={containerRef}
      style={{
        minHeight: "100vh",
        background: bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "140px 24px 180px",
        textAlign: "center",
        fontFamily: "'Georgia', 'Cambria', serif",
      }}
    >
      {/* ── Eyebrow ── */}
      <div
        className="manifesto-section"
        style={{
          ...sectionStyle,
          marginBottom: 80,
          letterSpacing: "0.25em",
          fontSize: 11,
          textTransform: "uppercase",
          color: sub,
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          fontWeight: 500,
        }}
      >
        A Statement of Belief
      </div>

      {/* ── Act I: The Paradox ── */}
      <div
        className="manifesto-section"
        style={{ ...sectionStyle, maxWidth: 680, marginBottom: 24 }}
      >
        <p
          style={{
            fontSize: "clamp(32px, 5.5vw, 58px)",
            lineHeight: 1.15,
            color: ink,
            fontWeight: 400,
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          We have never been more connected.
        </p>
      </div>

      <div
        className="manifesto-section"
        style={{ ...sectionStyle, maxWidth: 680, marginBottom: 72 }}
      >
        <p
          style={{
            fontSize: "clamp(32px, 5.5vw, 58px)",
            lineHeight: 1.15,
            color: accent,
            fontWeight: 400,
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          And we have never felt more alone.
        </p>
      </div>

      <div
        className="manifesto-section"
        style={{ ...sectionStyle, maxWidth: 620, marginBottom: 96 }}
      >
        <p
          style={{
            fontSize: "clamp(17px, 2.2vw, 21px)",
            lineHeight: 1.85,
            color: sub,
            margin: 0,
          }}
        >
          Your phone can reach a billion people right now. But when did you last
          have a real conversation with your neighbor? When did you last ask for
          help, and actually mean it?
          <br />
          <br />
          We built roads between every corner of the earth.
          <br />
          Then we stopped walking them.
        </p>
      </div>

      {/* ── Divider ── */}
      <div
        className="manifesto-section"
        style={{
          ...sectionStyle,
          width: 2,
          height: 80,
          background: `linear-gradient(to bottom, transparent, ${dividerColor}, transparent)`,
          marginBottom: 96,
        }}
      />

      {/* ── Act II: The Belief ── */}
      <div
        className="manifesto-section"
        style={{
          ...sectionStyle,
          maxWidth: 160,
          marginBottom: 40,
          letterSpacing: "0.2em",
          fontSize: 11,
          textTransform: "uppercase",
          color: sub,
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          fontWeight: 500,
        }}
      >
        What we believe
      </div>

      <div
        className="manifesto-section"
        style={{ ...sectionStyle, maxWidth: 700, marginBottom: 40 }}
      >
        <p
          style={{
            fontSize: "clamp(22px, 3.5vw, 38px)",
            lineHeight: 1.4,
            color: ink,
            fontWeight: 400,
            letterSpacing: "-0.01em",
            margin: 0,
          }}
        >
          No one builds anything great alone.
        </p>
      </div>

      <div
        className="manifesto-section"
        style={{ ...sectionStyle, maxWidth: 600, marginBottom: 96 }}
      >
        <p
          style={{
            fontSize: "clamp(17px, 2.2vw, 21px)",
            lineHeight: 1.85,
            color: sub,
            margin: 0,
          }}
        >
          Behind every person who made it, there were people who helped them
          get there. A teacher who stayed late. A stranger who shared what they
          knew. A community that held someone up when they couldn't stand alone.
          <br />
          <br />
          That truth hasn't changed. We just built a world that made it easy to
          forget.
        </p>
      </div>

      {/* ── Divider ── */}
      <div
        className="manifesto-section"
        style={{
          ...sectionStyle,
          width: 2,
          height: 80,
          background: `linear-gradient(to bottom, transparent, ${dividerColor}, transparent)`,
          marginBottom: 96,
        }}
      />

      {/* ── Act III: The Idea ── */}
      <div
        className="manifesto-section"
        style={{
          ...sectionStyle,
          maxWidth: 160,
          marginBottom: 40,
          letterSpacing: "0.2em",
          fontSize: 11,
          textTransform: "uppercase",
          color: sub,
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          fontWeight: 500,
        }}
      >
        What Together is
      </div>

      <div
        className="manifesto-section"
        style={{ ...sectionStyle, maxWidth: 720, marginBottom: 40 }}
      >
        <p
          style={{
            fontSize: "clamp(22px, 3.5vw, 38px)",
            lineHeight: 1.4,
            color: ink,
            fontWeight: 400,
            letterSpacing: "-0.01em",
            margin: 0,
          }}
        >
          Together is a place built around that truth.
        </p>
      </div>

      <div
        className="manifesto-section"
        style={{ ...sectionStyle, maxWidth: 620, marginBottom: 56 }}
      >
        <p
          style={{
            fontSize: "clamp(17px, 2.2vw, 21px)",
            lineHeight: 1.85,
            color: sub,
            margin: 0,
          }}
        >
          A place to find work that matters. To learn from someone who has
          walked your road. To feed a neighbor, support someone who is
          struggling, explore somewhere new with someone you haven't met yet.
        </p>
      </div>

      <div
        className="manifesto-section"
        style={{ ...sectionStyle, maxWidth: 640, marginBottom: 96 }}
      >
        <p
          style={{
            fontSize: "clamp(19px, 2.8vw, 28px)",
            lineHeight: 1.6,
            color: ink,
            fontStyle: "italic",
            margin: 0,
            borderLeft: `3px solid ${accent}`,
            paddingLeft: 28,
            textAlign: "left",
          }}
        >
          Your flourishing and mine are not separate things.
          <br />
          They are the same thing.
        </p>
      </div>

      {/* ── Divider ── */}
      <div
        className="manifesto-section"
        style={{
          ...sectionStyle,
          width: 2,
          height: 80,
          background: `linear-gradient(to bottom, transparent, ${dividerColor}, transparent)`,
          marginBottom: 96,
        }}
      />

      {/* ── Act IV: The Call ── */}
      <div
        className="manifesto-section"
        style={{ ...sectionStyle, maxWidth: 640, marginBottom: 48 }}
      >
        <p
          style={{
            fontSize: "clamp(17px, 2.2vw, 21px)",
            lineHeight: 1.85,
            color: sub,
            margin: 0,
          }}
        >
          The world doesn't need more noise.
          <br />
          It needs more of us, talking, building, showing up.
        </p>
      </div>

      <div
        className="manifesto-section"
        style={{ ...sectionStyle, maxWidth: 640, marginBottom: 64 }}
      >
        <p
          style={{
            fontSize: "clamp(26px, 4vw, 44px)",
            lineHeight: 1.25,
            color: ink,
            fontWeight: 400,
            letterSpacing: "-0.015em",
            margin: 0,
          }}
        >
          Bring what you know.
          <br />
          Bring what you need.
          <br />
          Bring who you are.
        </p>
      </div>

      {/* ── CTA ── */}
      <div
        className="manifesto-section"
        style={{ ...sectionStyle, marginBottom: 100 }}
      >
        <a
          href="/join"
          style={{
            display: "inline-block",
            padding: "18px 52px",
            background: accent,
            color: "#fff",
            fontSize: 15,
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            textDecoration: "none",
            borderRadius: 2,
            transition: "opacity 0.2s ease, transform 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.opacity = "0.85";
            (e.target as HTMLElement).style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.opacity = "1";
            (e.target as HTMLElement).style.transform = "translateY(0)";
          }}
        >
          We'll meet you there
        </a>
      </div>

      {/* ── Footer stamp ── */}
      <div
        className="manifesto-section"
        style={{
          ...sectionStyle,
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          fontSize: 11,
          letterSpacing: "0.18em",
          color: sub,
          opacity: 0.5,
        }}
      >
        2026 — THE WORLD
      </div>
      <div
        className="manifesto-section"
        style={{
          ...sectionStyle,
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          fontSize: 11,
          letterSpacing: "0.18em",
          color: sub,
          opacity: 0.5,
        }}
      >
        From T&E S2
      </div>
    </main>
  );
}