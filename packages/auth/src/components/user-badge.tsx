"use client";

import { Space, Typography } from "antd";
import type { AuthUser } from "../types";
import { useAuth } from "../hooks";
import { UserAvatar } from "./user-avatar";

const { Text } = Typography;

export interface UserBadgeProps {
  /** Override user — useful in table rows where you already have user data */
  user?: AuthUser | null;
  /** Show email below the name */
  showEmail?: boolean;
  avatarSize?: number;
}

/**
 * Compact inline display of avatar + name (+ optional email).
 * Perfect for table cells, list items, comment headers.
 *
 * @example
 * // In a table column
 * render: (_, record) => <UserBadge user={record.user} />
 *
 * // Current user
 * <UserBadge showEmail />
 */
export function UserBadge({ user: userProp, showEmail = false, avatarSize = 28 }: UserBadgeProps) {
  const { user: contextUser } = useAuth();
  const user = userProp ?? contextUser;

  if (!user) return null;

  const displayName = user.name ?? user.username ?? user.email ?? "User";

  return (
    <Space size={8} align="center">
      <UserAvatar user={user} size={avatarSize} />
      <div style={{ lineHeight: 1.3 }}>
        <Text strong style={{ fontSize: 14, display: "block" }}>
          {displayName}
        </Text>
        {showEmail && user.email && (
          <Text type="secondary" style={{ fontSize: 12 }}>
            {user.email}
          </Text>
        )}
      </div>
    </Space>
  );
}
