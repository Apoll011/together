"use client";

import { Result, Button, Spin } from "antd";
import { Shield } from "lucide-react";
import { useAuth, useHasAllRoles, useHasAnyRole } from "../hooks";
import type { RoleGateProps } from "../types";

/**
 * Renders children only when the user has the required role(s).
 * Shows an "Unauthorized" Result by default when access is denied.
 *
 * @example
 * // User must have the "admin" role
 * <RequireRole roles="admin">
 *   <AdminPanel />
 * </RequireRole>
 *
 * // User must have either "editor" OR "admin"
 * <RequireRole roles={["editor", "admin"]} any>
 *   <EditButton />
 * </RequireRole>
 *
 * // Custom fallback
 * <RequireRole roles="superadmin" fallback={<p>Admins only.</p>}>
 *   <SuperAdminTools />
 * </RequireRole>
 */
export function RequireRole({ roles, any = false, children, fallback }: RoleGateProps) {
  const { isLoading, isAuthenticated } = useAuth();
  const normalizedRoles = Array.isArray(roles) ? roles : [roles];

  const hasAll = useHasAllRoles(normalizedRoles);
  const hasAny = useHasAnyRole(normalizedRoles);
  const allowed = any ? hasAny : hasAll;

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
        <Spin />
      </div>
    );
  }

  if (!isAuthenticated || !allowed) {
    if (fallback !== undefined) return <>{fallback}</>;

    return (
      <Result
        icon={<Shield size={48} color="#faad14" />}
        title="Access Restricted"
        subTitle={`This area requires the ${normalizedRoles.join(any ? " or " : " and ")} role${normalizedRoles.length > 1 ? "s" : ""}.`}
        extra={
          <Button type="primary" href="/">
            Go Home
          </Button>
        }
      />
    );
  }

  return <>{children}</>;
}
