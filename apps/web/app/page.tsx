"use client";

import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { Stats } from "./components/Stats";
import { CTA } from "./components/CTA";
import { SignedOut, SignedIn, RequireAuth, RequireRole, RequireAppRole } from "@together/auth-sdk/react/components/index";

export default function Home() {
  return (
    <div>
		  <Hero/>
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
      <RequireAppRole app="main" role="editor" unauthorized={<p>Not an editor.</p>}>
        <p>Editor content</p>
      </RequireAppRole>
    </>
      <Features/>
      <Stats/>
      <CTA/>
    </div>
  );
}
