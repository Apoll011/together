"use client";

import { Button, Result, Spin } from "antd";
import { LockKeyhole } from "lucide-react";
import type { ReactNode } from "react";
import { useAuth } from "../hooks";

export interface AuthWallProps {
  children: ReactNode;
  /** Custom title shown on the sign-in prompt */
  title?: string;
  /** Custom subtitle */
  subtitle?: string;
  /** Custom sign-in button label */
  signInLabel?: string;
}

/**
 * Full-area gate — shows a sign-in prompt if the user is not authenticated.
 * Great for wrapping entire page areas or layout sections.
 *
 * @example
 * <AuthWall title="Members Only" subtitle="Sign in to access the dashboard">
 *   <Dashboard />
 * </AuthWall>
 */
export function AuthWall({
  children,
  title = "Sign in to continue",
  subtitle = "You need to be signed in to access this content.",
  signInLabel = "Sign In",
}: AuthWallProps) {
  const { isAuthenticated, isLoading, signIn } = useAuth();

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 300,
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Result
        icon={<LockKeyhole size={52} color="#1677ff" />}
        title={title}
        subTitle={subtitle}
        extra={
          <Button type="primary" size="large" onClick={() => signIn()}>
            {signInLabel}
          </Button>
        }
      />
    );
  }

  return <>{children}</>;
}
