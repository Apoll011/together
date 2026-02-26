"use client";

import { Result, Button, Spin } from "antd";
import { Lock } from "lucide-react";
import { useAuth, useHasAllScopes, useHasAnyScope } from "../hooks";
import type { PermissionGateProps } from "../types";

/**
 * Renders children only when the user has the required permission/scope(s).
 *
 * @example
 * <RequirePermission permissions="write:invoices">
 *   <CreateInvoiceButton />
 * </RequirePermission>
 *
 * <RequirePermission permissions={["read:reports", "export:reports"]} fallback={<UpgradePrompt />}>
 *   <ReportsPage />
 * </RequirePermission>
 */
export function RequirePermission({
  permissions,
  any = false,
  children,
  fallback,
}: PermissionGateProps) {
  const { isLoading, isAuthenticated } = useAuth();
  const normalizedPerms = Array.isArray(permissions) ? permissions : [permissions];

  const hasAll = useHasAllScopes(normalizedPerms);
  const hasAny = useHasAnyScope(normalizedPerms);
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
        icon={<Lock size={48} color="#faad14" />}
        title="Permission Required"
        subTitle={`This feature requires the ${normalizedPerms.join(any ? " or " : " and ")} permission${normalizedPerms.length > 1 ? "s" : ""}.`}
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
