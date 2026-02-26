"use client";

import { Dropdown, Space, Typography, Spin, Skeleton } from "antd";
import type { MenuProps } from "antd";
import {
  User,
  LogOut,
  Settings,
  ChevronDown,
  Shield,
} from "lucide-react";
import { useAuth, useRoles } from "../hooks";
import { UserAvatar } from "./user-avatar";

const { Text } = Typography;

export interface ProfileButtonMenuItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  danger?: boolean;
  onClick?: () => void;
}

export interface ProfileButtonProps {
  /** Show the user's display name next to the avatar */
  showName?: boolean;
  /** Extra items injected into the dropdown menu, before Sign Out */
  extraMenuItems?: ProfileButtonMenuItem[];
  /** Link to your profile page */
  profileHref?: string;
  /** Link to your settings page */
  settingsHref?: string;
  /** Hide the "Sign Out" option */
  hideSignOut?: boolean;
  /** Hide the roles badge in the dropdown */
  hideRoles?: boolean;
  avatarSize?: number;
}

/**
 * Avatar (+ optional name) that expands into a profile dropdown menu.
 * Shows a skeleton while loading.
 *
 * @example
 * <ProfileButton showName />
 * <ProfileButton profileHref="/account" settingsHref="/settings" />
 * <ProfileButton extraMenuItems={[{ key: "billing", label: "Billing", icon: <CreditCard /> }]} />
 */
export function ProfileButton({
  showName = false,
  extraMenuItems = [],
  profileHref = "/profile",
  settingsHref,
  hideSignOut = false,
  hideRoles = false,
  avatarSize = 36,
}: ProfileButtonProps) {
  const { user, isLoading, isAuthenticated, signOut } = useAuth();
  const roles = useRoles();

  if (isLoading) return <Skeleton.Avatar active size={avatarSize} />;
  if (!isAuthenticated || !user) return null;

  const displayName = user.name ?? user.username ?? user.email ?? "User";

  const menuItems: MenuProps["items"] = [
    // ── Header info ──────────────────────────────────────────
    {
      key: "__header__",
      label: (
        <div style={{ padding: "4px 0 8px", minWidth: 180 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <UserAvatar user={user} size={42} />
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontWeight: 600, fontSize: 14, lineHeight: "20px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {displayName}
              </div>
              {user.email && (
                <div style={{ fontSize: 12, color: "#8c8c8c", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {user.email}
                </div>
              )}
              {!hideRoles && roles.length > 0 && (
                <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
                  {roles.map((role) => (
                    <span
                      key={role}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 3,
                        fontSize: 11,
                        background: "#f0f5ff",
                        color: "#2f54eb",
                        borderRadius: 4,
                        padding: "0 6px",
                        lineHeight: "18px",
                      }}
                    >
                      <Shield size={10} />
                      {role}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ),
      disabled: true,
    },
    { type: "divider" },

    // ── Navigation items ─────────────────────────────────────
    {
      key: "profile",
      icon: <User size={14} />,
      label: <a href={profileHref}>Profile</a>,
    },

    ...(settingsHref
      ? [
          {
            key: "settings",
            icon: <Settings size={14} />,
            label: <a href={settingsHref}>Settings</a>,
          },
        ]
      : []),

    // ── Extra items from props ────────────────────────────────
    ...(extraMenuItems.length > 0 ? [{ type: "divider" as const }] : []),
    ...extraMenuItems.map(({ onClick, ...item }) => ({
      ...item,
      onClick,
    })),

    // ── Sign out ─────────────────────────────────────────────
    ...(!hideSignOut
      ? [
          { type: "divider" as const },
          {
            key: "sign-out",
            icon: <LogOut size={14} />,
            label: "Sign Out",
            danger: true,
            onClick: () => signOut(),
          },
        ]
      : []),
  ];

  return (
    <Dropdown menu={{ items: menuItems }} trigger={["click"]} placement="bottomRight">
      <Space
        style={{
          cursor: "pointer",
          padding: "4px 8px",
          borderRadius: 8,
          transition: "background 0.15s",
          userSelect: "none",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = "#f5f5f5";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = "transparent";
        }}
      >
        <UserAvatar user={user} size={avatarSize} />
        {showName && (
          <Text strong style={{ fontSize: 14, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {displayName}
          </Text>
        )}
        <ChevronDown size={14} style={{ color: "#8c8c8c" }} />
      </Space>
    </Dropdown>
  );
}
