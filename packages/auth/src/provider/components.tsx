"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
  ClerkProvider,
  AuthenticateWithRedirectCallback
} from "@clerk/nextjs";

export {
  SignedIn,
  SignedOut,
  SignUpButton,
  SignInButton,
  SignOutButton,
  UserButton,
  AuthenticateWithRedirectCallback as AuthAndRedirect
};

interface Props {
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function Captcha() {
  return (<div id="clerk-captcha" />);
}

export function AuthProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
    >
      {children}
    </ClerkProvider>
  );
}

export function RequireAuth({ fallback = null, children }: Props) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  if (!user) return <>{fallback}</>;

  return <>{children}</>;
}