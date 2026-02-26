"use client";

import { Button } from "antd";
import type { ButtonProps } from "antd";
import { LogIn } from "lucide-react";
import { useAuth } from "../hooks";

export interface SignInButtonProps extends Omit<ButtonProps, "onClick" | "loading"> {
  /** Where to redirect after sign-in. Defaults to current path */
  redirectTo?: string;
  label?: string;
}

/**
 * A button that triggers the Logto sign-in flow.
 *
 * @example
 * <SignInButton type="primary" size="large" />
 * <SignInButton label="Login" redirectTo="/dashboard" />
 */
export function SignInButton({
  redirectTo,
  label = "Sign In",
  icon = <LogIn size={16} />,
  ...props
}: SignInButtonProps) {
  const { signIn, isLoading } = useAuth();

  return (
    <Button
      icon={icon}
      loading={isLoading}
      onClick={() => signIn(redirectTo)}
      {...props}
    >
      {label}
    </Button>
  );
}
