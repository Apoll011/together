"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
} from "@clerk/nextjs";

export {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
};

interface Props {
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function RequireAuth({ fallback = null, children }: Props) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  if (!user) return <>{fallback}</>;

  return <>{children}</>;
}