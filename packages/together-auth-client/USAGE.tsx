/**
 * ─────────────────────────────────────────────────────────────────────────────
 * @together/auth-client — Usage Examples
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. Root layout — configure the provider once
// app/layout.tsx
// ─────────────────────────────────────────────────────────────────────────────

import { TogetherAuthProvider } from "@together/auth-client";
import { getServerSession } from "@together/auth-client/server";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Pre-fetch on the server to avoid client waterfall
  const initialSession = await getServerSession();

  return (
    <html lang="en">
      <body>
        <TogetherAuthProvider
          config={{
            identityBaseUrl: process.env.NEXT_PUBLIC_IDENTITY_URL!,
            autoRedirect: true,
            appName: "my-app", // used for appRoles lookup
          }}
          initialSession={initialSession}
        >
          {children}
        </TogetherAuthProvider>
      </body>
    </html>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Server component — gated page
// app/dashboard/page.tsx
// ─────────────────────────────────────────────────────────────────────────────

import { getServerSession, requireServerSession } from "@together/auth-client/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // Option A: manual guard
  const session = await getServerSession();
  if (!session) redirect(`${process.env.NEXT_PUBLIC_IDENTITY_URL}/login`);

  // Option B: throws + redirects automatically
  // const session = await requireServerSession();

  return <h1>Welcome, {session.user.name}</h1>;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Client component — useTogetherAccount
// components/UserAvatar.tsx
// ─────────────────────────────────────────────────────────────────────────────

"use client";
import { useTogetherAccount } from "@together/auth-client";

export function UserAvatar() {
  const { user, isLoading } = useTogetherAccount();

  if (isLoading) return <div>Loading…</div>;
  if (!user) return null;

  return (
    <div>
      <img src={user.image ?? "/default-avatar.png"} alt={user.name ?? user.email} />
      <span>{user.name}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Role-gated UI
// ─────────────────────────────────────────────────────────────────────────────

"use client";
import {
  SignedIn,
  SignedOut,
  RequireAuth,
  RequireRole,
  RequireAppRole,
  useHasRole,
  useHasAppRole,
} from "@together/auth-client";

export function AdminPanel() {
  return (
    <>
      <SignedOut>
        <p>Please sign in.</p>
      </SignedOut>

      <SignedIn>
        <p>You are signed in.</p>
      </SignedIn>

      {/* Redirects to login if not authenticated */}
      <RequireAuth loading={<p>Checking auth…</p>}>
        <p>Authenticated content</p>
      </RequireAuth>

      {/* Requires global "admin" role */}
      <RequireRole role="admin" unauthorized={<p>Access denied.</p>}>
        <p>Admin-only content</p>
      </RequireRole>

      {/* Requires "editor" role inside "my-app" appRoles */}
      <RequireAppRole app="my-app" role="editor" unauthorized={<p>Not an editor.</p>}>
        <p>Editor content</p>
      </RequireAppRole>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Hook-based role checks
// ─────────────────────────────────────────────────────────────────────────────

"use client";
import { useRoles, useHasRole, useHasAppRole } from "@together/auth-client";

export function RoleAwareNav() {
  const isAdmin = useHasRole("admin");
  const canPublish = useHasAppRole("my-app", "publisher");
  const { roles } = useRoles();

  return (
    <nav>
      {isAdmin && <a href="/admin">Admin</a>}
      {canPublish && <a href="/publish">Publish</a>}
      <pre>{JSON.stringify(roles, null, 2)}</pre>
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. Imperative utilities
// ─────────────────────────────────────────────────────────────────────────────

"use client";
import { logout, redirectToLogin, refreshSession } from "@together/auth-client";

async function handleLogout() {
  await logout("/"); // clears cookie and redirects to "/"
}

async function handleLoginRedirect() {
  redirectToLogin("https://myapp.com/dashboard"); // explicit return URL
}

async function handleRefresh() {
  const session = await refreshSession();
  console.log("Refreshed:", session);
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. Server Action logout
// app/actions/auth.ts
// ─────────────────────────────────────────────────────────────────────────────

"use server";
import { serverLogout } from "@together/auth-client/server";
import { redirect } from "next/navigation";

export async function logoutAction() {
  await serverLogout();
  redirect("/");
}
