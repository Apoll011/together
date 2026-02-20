import React from "react";

type Platform = "ios" | "android" | "web";
type Theme = "light" | "dark";

interface DownloadButtonProps {
  platform: Platform;
  url: string;
  theme?: Theme;
  accentColor?: string; // used for web variant
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: { height: 40, minWidth: 130, fontSize: 10, logoSize: 20, subSize: 7 },
  md: { height: 48, minWidth: 155, fontSize: 12, logoSize: 24, subSize: 8 },
  lg: { height: 56, minWidth: 180, fontSize: 14, logoSize: 28, subSize: 9 },
};

// ── SVG Logos ────────────────────────────────────────────────────────────────

const AppleLogo = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

const GooglePlayLogo = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M3,20.5v-17c0-0.83,0.94-1.3,1.6-0.8l14,8.5c0.6,0.37,0.6,1.23,0,1.6l-14,8.5C3.94,21.8,3,21.33,3,20.5z" />
    <path
      fill={color === "#fff" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.25)"}
      d="M3.5,4.34l8.49,8.49L3.5,21.32V4.34z"
    />
    <path
      fill={color === "#fff" ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.18)"}
      d="M3.5,4.34l8.49,8.49l3.17-3.17L3.5,4.34z"
    />
  </svg>
);

const GlobeLogo = ({ size, color }: { size: number; color: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

// ── Config per platform ───────────────────────────────────────────────────────

const PLATFORM_CONFIG = {
  ios: {
    superscript: "Download on the",
    label: "App Store",
    Logo: AppleLogo,
  },
  android: {
    superscript: "Get it on",
    label: "Google Play",
    Logo: GooglePlayLogo,
  },
  web: {
    superscript: "Open the",
    label: "Web App",
    Logo: GlobeLogo,
  },
};

// ── Component ─────────────────────────────────────────────────────────────────

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  platform,
  url,
  theme = "dark",
  accentColor,
  size = "md",
}) => {
  const s = SIZES[size];
  const config = PLATFORM_CONFIG[platform];
  const isDark = theme === "dark";

  // Web uses accent color; store buttons use classic black/white
  const bg =
    platform === "web"
      ? accentColor ?? "#000"
      : isDark
        ? "#000"
        : "#fff";

  const fg =
    platform === "web"
      ? "#fff"
      : isDark
        ? "#fff"
        : "#000";

  const border =
    platform === "web"
      ? "none"
      : isDark
        ? "1.5px solid #333"
        : "1.5px solid #a6a6a6";

  return (
<a
  href={url}
  target="_blank"
  rel="noopener noreferrer"
  style={{
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: 10,
    height: s.height,
    minWidth: s.minWidth,
    borderRadius: 10,
    background: bg, // ← your original background logic
    color: isDark ? "#fff" : "#000",
    textDecoration: "none",
    cursor: "pointer",
    userSelect: "none",
    boxShadow: isDark
      ? "0 2px 8px rgba(0,0,0,0.35)"
      : "0 2px 8px rgba(0,0,0,0.12)",
    transition: "opacity 0.15s ease, transform 0.15s ease",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.opacity = "0.85";
    e.currentTarget.style.transform = "scale(1.02)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.opacity = "1";
    e.currentTarget.style.transform = "scale(1)";
  }}
>
  <config.Logo size={s.logoSize} color={isDark ? "#fff" : "#000"} />

  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      fontFamily: '"Outfit", sans-serif',
      lineHeight: 1,
    }}
  >
    <span style={{ fontSize: 12 }}>{config.superscript}</span>
    <span style={{ fontSize: 20, fontWeight: "bold" }}>
      {config.label}
    </span>
  </div>
</a>
  );
};