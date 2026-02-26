"use client";

import { Card, Descriptions, Tag, Skeleton, Badge } from "antd";
import type { CardProps } from "antd";
import { Shield, Mail, Phone, User, CheckCircle, XCircle } from "lucide-react";
import { useAuth, useRoles } from "../hooks";
import { UserAvatar } from "./user-avatar";
import type { AuthUser } from "../types";

export interface ProfileInfoCardProps extends Omit<CardProps, "title"> {
  /** Override user data */
  user?: AuthUser | null;
  /** Show roles section. Requires `roles` scope. */
  showRoles?: boolean;
  /** Show extra custom fields from the user object */
  extraFields?: Array<{ label: string; key: string }>;
}

/**
 * A rich card displaying user profile information.
 *
 * @example
 * <ProfileInfoCard />
 * <ProfileInfoCard showRoles extraFields={[{ label: "Department", key: "department" }]} />
 */
export function ProfileInfoCard({
  user: userProp,
  showRoles = true,
  extraFields = [],
  style,
  ...cardProps
}: ProfileInfoCardProps) {
  const { user: contextUser, isLoading } = useAuth();
  const roles = useRoles();
  const user = userProp ?? contextUser;

  if (isLoading) {
    return (
      <Card style={{ maxWidth: 480, ...style }} {...cardProps}>
        <Skeleton avatar active paragraph={{ rows: 4 }} />
      </Card>
    );
  }

  if (!user) return null;

  const displayName = user.name ?? user.username ?? user.email ?? "User";

  return (
    <Card
      style={{ maxWidth: 480, ...style }}
      styles={{
        header: { borderBottom: "1px solid #f0f0f0" },
      }}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0" }}>
          <UserAvatar user={user} size={52} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{displayName}</div>
            <div style={{ fontSize: 12, color: "#8c8c8c", marginTop: 2 }}>
              ID: <code style={{ fontSize: 11 }}>{user.sub}</code>
            </div>
          </div>
        </div>
      }
      {...cardProps}
    >
      <Descriptions column={1} size="small" styles={{ label: { color: "#8c8c8c", width: 120 } }}>
        {user.name && (
          <Descriptions.Item label={<span><User size={12} style={{ marginRight: 4 }} />Full Name</span>}>
            {user.name}
          </Descriptions.Item>
        )}

        {user.username && (
          <Descriptions.Item label="Username">
            @{user.username}
          </Descriptions.Item>
        )}

        {user.email && (
          <Descriptions.Item label={<span><Mail size={12} style={{ marginRight: 4 }} />Email</span>}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {user.email}
              {user.emailVerified ? (
                <CheckCircle size={13} color="#52c41a" />
              ) : (
                <XCircle size={13} color="#ff4d4f" />
              )}
            </span>
          </Descriptions.Item>
        )}

        {user.phoneNumber && (
          <Descriptions.Item label={<span><Phone size={12} style={{ marginRight: 4 }} />Phone</span>}>
            {user.phoneNumber}
          </Descriptions.Item>
        )}

        {extraFields.map(({ label, key }) =>
          user[key] !== undefined ? (
            <Descriptions.Item key={key} label={label}>
              {String(user[key])}
            </Descriptions.Item>
          ) : null
        )}
      </Descriptions>

      {showRoles && roles.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 12, color: "#8c8c8c", marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}>
            <Shield size={12} /> Roles
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {roles.map((role) => (
              <Tag key={role} color="blue" icon={<Shield size={10} />}>
                {role}
              </Tag>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
