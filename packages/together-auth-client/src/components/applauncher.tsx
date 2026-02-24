import React, { useState } from "react";
import { Popover, Typography, Divider, Avatar, Tooltip } from "antd";
import { useTheme } from "@repo/ui/ThemeContext";
import { appsData } from "@together/apps-repo/data";
import { AppData } from "@together/apps-repo/types"
import { LayoutGrid } from "lucide-react";
import { TogetherUser } from "../types";

const { Text } = Typography;

interface AppLauncherProps {
  user: TogetherUser
  usedAppKeys: string[];
}

interface AppItemProps {
  app: AppData;
  dimmed?: boolean;
  textColor: string;
  subTextColor: string;
  hoverBg: string;
}

const AppItem: React.FC<AppItemProps> = ({
  app,
  textColor,
  subTextColor,
  hoverBg,
}) => {
  const [hovered, setHovered] = useState(false);

  const handleLaunch = () => {
    window.open(
      app.platforms.urls?.web ?? "#",
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <Tooltip title={app.description} placement="bottom" mouseEnterDelay={0.6}>
      <button
        onClick={handleLaunch}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          padding: "12px 8px",
          borderRadius: 10,
          border: "none",
          background: hovered ? hoverBg : "transparent",
          cursor: "pointer",
          transition: "background 0.15s",
          opacity: 1,
          width: "100%",
        }}
      >
        {/* App Icon */}
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: app.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            color: "#fff",
            flexShrink: 0,
            boxShadow: `0 2px 8px ${app.color}55`,
          }}
        >
          {app.icon}
        </div>

        {/* App Name */}
        <Text
          style={{
            fontSize: 11,
            color: textColor,
            textAlign: "center",
            lineHeight: "1.1",
            wordBreak: "break-word",
            maxWidth: 80,
          }}
        >
          {app.label}
        </Text>
      </button>
    </Tooltip>
  );
};

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <Text
    style={{
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "#8c8c8c",
      display: "block",
      marginBottom: 4,
      paddingLeft: 4,
    }}
  >
    {children}
  </Text>
);

interface AppGridProps {
  apps: AppData[];
  textColor: string;
  subTextColor: string;
  hoverBg: string;
}

const AppGrid: React.FC<AppGridProps> = ({
  apps,
  textColor,
  subTextColor,
  hoverBg,
}) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 2,
    }}
  >
    {apps.map((app) => (
      <AppItem
        key={app.key}
        app={app}
        textColor={textColor}
        subTextColor={subTextColor}
        hoverBg={hoverBg}
      />
    ))}
  </div>
);

interface UserHeaderProps {
  user: TogetherUser
  textColor: string;
  subTextColor: string;
  borderColor: string;
}

const UserHeader: React.FC<UserHeaderProps> = ({
  user,
  textColor,
  subTextColor,
  borderColor,
}) => {
  if (!user) return null;

  const fullName = user.name ?? user.username ?? "User";
  const email = user.email;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "4px 4px 16px",
        borderBottom: `1px solid ${borderColor}`,
        marginBottom: 16,
      }}
    >
      <Avatar
        src={user.image}
        size={40}
        style={{
          flexShrink: 0,
          border: `2px solid ${borderColor}`,
        }}
      >
        {fullName[0]?.toUpperCase()}
      </Avatar>

      <div style={{ minWidth: 0 }}>
        <Text
          strong
          style={{
            fontSize: 14,
            color: textColor,
            display: "block",
            lineHeight: 1.3,
          }}
        >
          {fullName}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: subTextColor,
            display: "block",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {email}
        </Text>
      </div>
    </div>
  );
};

// ─── Launcher Overlay ──────────────────────────────────────────────────────────

interface LauncherOverlayProps {
  user: TogetherUser
  usedAppKeys: string[];
  apps: AppData[];
  isDark: boolean;
}

const LauncherOverlay: React.FC<LauncherOverlayProps> = ({
  user,
  usedAppKeys,
  apps,
  isDark,
}) => {
  const { colors } = useTheme();

  const bg = isDark ? "#1e1e1e" : "#ffffff";
  const textColor = isDark ? "#e8e8e8" : colors.navText;
  const subText = isDark ? "#888" : colors.navSubText;
  const borderColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const hoverBg = isDark ? "rgba(255,255,255,0.07)" : "#f3f3f3";

  // Only expose web-enabled apps
  const webApps = apps.filter((a) => a.platforms.web);
  const myApps =
    usedAppKeys.length > 0
      ? webApps.filter((a) => usedAppKeys.includes(a.key))
      : [];
  const discoverApps = webApps.filter((a) => !usedAppKeys.includes(a.key));

  const hasMyApps = myApps.length > 0;
  const hasDiscover = discoverApps.length > 0;

  return (
    <div
      style={{
        width: 340,
        background: bg,
        borderRadius: 16,
        boxShadow: isDark
          ? "0 8px 32px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.3)"
          : "0 8px 32px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06)",
        padding: "20px 16px 16px",
        border: `1px solid ${borderColor}`,
      }}
    >
      {/* User */}
      <UserHeader
        user={user}
        textColor={textColor}
        subTextColor={subText}
        borderColor={borderColor}
      />

      {/* My Apps */}
      {hasMyApps && (
        <>
          <SectionLabel>Your Apps</SectionLabel>
          <AppGrid
            apps={myApps}
            textColor={textColor}
            subTextColor={subText}
            hoverBg={hoverBg}
          />
        </>
      )}

      {/* Discover */}
      {hasDiscover && (
        <>
          {hasMyApps && <Divider style={{ margin: "12px 0", borderColor }} />}
          <SectionLabel>
            {hasMyApps ? "Discover More" : "All Apps"}
          </SectionLabel>
          <AppGrid
            apps={discoverApps}
            textColor={textColor}
            subTextColor={subText}
            hoverBg={hoverBg}
          />
        </>
      )}
    </div>
  );
};

// ─── Main Export ───────────────────────────────────────────────────────────────

const AppLauncher: React.FC<AppLauncherProps> = ({ user, usedAppKeys }) => {
  const { colors, mode } = useTheme();
  const [open, setOpen] = useState(false);

  const isDark = mode === "dark";
  const hoverBg = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      trigger="click"
      placement="bottomRight"
      arrow={false}
      styles={{
        root: { zIndex: 1100 },
        container: { padding: 0, background: "transparent", boxShadow: "none" },
      }}
      content={
        <LauncherOverlay
          user={user}
          usedAppKeys={usedAppKeys}
          apps={appsData}
          isDark={isDark}
        />
      }
    >
      <button
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 36,
          height: 36,
          borderRadius: 8,
          border: "none",
          background: open ? hoverBg : "transparent",
          cursor: "pointer",
          transition: "background 0.15s",
          padding: 0,
          color: colors.navText
        }}
        onMouseEnter={(e) => {
          if (!open) e.currentTarget.style.background = hoverBg;
        }}
        onMouseLeave={(e) => {
          if (!open) e.currentTarget.style.background = "transparent";
        }}
        aria-label="Open app launcher"
      >
        <LayoutGrid/>
      </button>
    </Popover>
  );
};

export default AppLauncher;
