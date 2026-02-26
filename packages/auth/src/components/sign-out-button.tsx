"use client";

import { Button } from "antd";
import type { ButtonProps } from "antd";
import { LogOut } from "lucide-react";
import { useAuth } from "../hooks";

export interface SignOutButtonProps extends Omit<ButtonProps, "onClick" | "loading"> {
  label?: string;
}

/**
 * A button that triggers the Logto sign-out flow.
 *
 * @example
 * <SignOutButton />
 * <SignOutButton type="text" danger label="Logout" />
 */
export function SignOutButton({
  label = "Sign Out",
  icon = <LogOut size={16} />,
  ...props
}: SignOutButtonProps) {
  const { signOut, isLoading } = useAuth();

  return (
    <Button
      icon={icon}
      loading={isLoading}
      onClick={() => signOut()}
      {...props}
    >
      {label}
    </Button>
  );
}
