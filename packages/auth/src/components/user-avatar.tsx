"use client";

import { Avatar, Tooltip } from "antd";
import type { AvatarProps } from "antd";
import { UserRound } from "lucide-react";
import { useAuth } from "../hooks";
import type { AuthUser } from "../types";

export interface UserAvatarProps extends Omit<AvatarProps, "src" | "alt"> {
  /** Override user — useful when you already have user data */
  user?: AuthUser | null;
  showTooltip?: boolean;
}

function getInitials(user: AuthUser): string {
  if (user.name) {
    return user.name
      .split(" ")
      .slice(0, 2)
      .map((p) => p[0])
      .join("")
      .toUpperCase();
  }
  if (user.username) return user.username.slice(0, 2).toUpperCase();
  if (user.email) return user.email[0].toUpperCase();
  return "?";
}

/**
 * Displays the user's avatar (picture, initials, or fallback icon).
 *
 * @example
 * <UserAvatar size={40} />
 * <UserAvatar size="large" showTooltip />
 */
export function UserAvatar({ user: userProp, showTooltip = false, size = 36, ...props }: UserAvatarProps) {
  const { user: contextUser } = useAuth();
  const user = userProp ?? contextUser;

  const avatar = user ? (
    <Avatar
      src={user.picture}
      size={size}
      style={{
        background: user.picture ? "transparent" : "var(--color-primary, #1677ff)",
        cursor: "default",
        fontSize: typeof size === "number" ? size * 0.38 : undefined,
      }}
      {...props}
    >
      {!user.picture ? getInitials(user) : null}
    </Avatar>
  ) : (
    <Avatar
      size={size}
      icon={<UserRound size={typeof size === "number" ? size * 0.55 : 18} />}
      style={{ background: "#d9d9d9" }}
      {...props}
    />
  );

  if (showTooltip && user) {
    return (
      <Tooltip title={user.name ?? user.email ?? user.username}>
        {avatar}
      </Tooltip>
    );
  }

  return avatar;
}
