import React, { useState } from "react";
import { Popover, Typography, Divider, Avatar, Tooltip } from "antd";
import { useUser } from "@clerk/nextjs";
import { useTheme } from "@repo/ui/ThemeContext";
import { AppData, appsData } from "@repo/together-apps/data";
import { GridIcon, LayoutGrid } from "lucide-react";

const { Text } = Typography;

interface AppLauncherProps {
  usedAppKeys: string[];
}

const WaffleIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg
    viewBox="0 0 24 24"
    fill="#000000"
  >
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      {" "}
      <title>dot_grid_fill</title>{" "}
      <g
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        {" "}
        <g
          id="System"
          transform="translate(-528.000000, -336.000000)"
          fillRule="nonzero"
        >
          {" "}
          <g id="dot_grid_fill" transform="translate(528.000000, 336.000000)">
            {" "}
            <path
              d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z"
              id="MingCute"
              fillRule="nonzero"
            >
              {" "}
            </path>{" "}
            <path
              d="M5.5,16.5 C6.60457,16.5 7.5,17.3954 7.5,18.5 C7.5,19.6046 6.60457,20.5 5.5,20.5 C4.39543,20.5 3.5,19.6046 3.5,18.5 C3.5,17.3954 4.39543,16.5 5.5,16.5 Z M12,16.5 C13.1046,16.5 14,17.3954 14,18.5 C14,19.6046 13.1046,20.5 12,20.5 C10.8954,20.5 10,19.6046 10,18.5 C10,17.3954 10.8954,16.5 12,16.5 Z M18.5,16.5 C19.6046,16.5 20.5,17.3954 20.5,18.5 C20.5,19.6046 19.6046,20.5 18.5,20.5 C17.3954,20.5 16.5,19.6046 16.5,18.5 C16.5,17.3954 17.3954,16.5 18.5,16.5 Z M5.5,10 C6.60457,10 7.5,10.8954 7.5,12 C7.5,13.1046 6.60457,14 5.5,14 C4.39543,14 3.5,13.1046 3.5,12 C3.5,10.8954 4.39543,10 5.5,10 Z M12,10 C13.1046,10 14,10.8954 14,12 C14,13.1046 13.1046,14 12,14 C10.8954,14 10,13.1046 10,12 C10,10.8954 10.8954,10 12,10 Z M18.5,10 C19.6046,10 20.5,10.8954 20.5,12 C20.5,13.1046 19.6046,14 18.5,14 C17.3954,14 16.5,13.1046 16.5,12 C16.5,10.8954 17.3954,10 18.5,10 Z M5.5,3.5 C6.60457,3.5 7.5,4.39543 7.5,5.5 C7.5,6.60457 6.60457,7.5 5.5,7.5 C4.39543,7.5 3.5,6.60457 3.5,5.5 C3.5,4.39543 4.39543,3.5 5.5,3.5 Z M12,3.5 C13.1046,3.5 14,4.39543 14,5.5 C14,6.60457 13.1046,7.5 12,7.5 C10.8954,7.5 10,6.60457 10,5.5 C10,4.39543 10.8954,3.5 12,3.5 Z M18.5,3.5 C19.6046,3.5 20.5,4.39543 20.5,5.5 C20.5,6.60457 19.6046,7.5 18.5,7.5 C17.3954,7.5 16.5,6.60457 16.5,5.5 C16.5,4.39543 17.3954,3.5 18.5,3.5 Z"
              fill={color}
            >
              {" "}
            </path>{" "}
          </g>{" "}
        </g>{" "}
      </g>{" "}
    </g>
  </svg>
);

// ─── App Grid Item ─────────────────────────────────────────────────────────────

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

// ─── Section Label ─────────────────────────────────────────────────────────────

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

// ─── App Grid ──────────────────────────────────────────────────────────────────

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

// ─── User Header ───────────────────────────────────────────────────────────────

interface UserHeaderProps {
  textColor: string;
  subTextColor: string;
  borderColor: string;
}

const UserHeader: React.FC<UserHeaderProps> = ({
  textColor,
  subTextColor,
  borderColor,
}) => {
  const { user, isLoaded } = useUser();

  if (!isLoaded || !user) return null;

  const fullName = user.fullName ?? user.username ?? "User";
  const email = user.primaryEmailAddress?.emailAddress ?? "";

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
        src={user.imageUrl}
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
  usedAppKeys: string[];
  apps: AppData[];
  isDark: boolean;
}

const LauncherOverlay: React.FC<LauncherOverlayProps> = ({
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

const AppLauncher: React.FC<AppLauncherProps> = ({ usedAppKeys }) => {
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
