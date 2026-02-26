"use client";

import { Tag, Tooltip } from "antd";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import { useAuth, useRoles } from "../hooks";

/**
 * Compact auth status badge — useful in dev toolbars or admin panels.
 *
 * @example
 * <AuthStatus />
 */
export function AuthStatus() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const roles = useRoles();

  if (isLoading) {
    return (
      <Tag icon={<Loader size={12} />} color="processing">
        Loading...
      </Tag>
    );
  }

  if (!isAuthenticated) {
    return (
      <Tag icon={<XCircle size={12} />} color="default">
        Not signed in
      </Tag>
    );
  }

  return (
    <Tooltip
      title={
        <div>
          <div><strong>ID:</strong> {user?.sub}</div>
          {user?.email && <div><strong>Email:</strong> {user.email}</div>}
          {roles.length > 0 && <div><strong>Roles:</strong> {roles.join(", ")}</div>}
        </div>
      }
    >
      <Tag icon={<CheckCircle size={12} />} color="success" style={{ cursor: "default" }}>
        {user?.name ?? user?.email ?? "Signed in"}
      </Tag>
    </Tooltip>
  );
}
