"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
  { href: "/account", label: "Profile" },
  { href: "/account/security", label: "Security" },
  { href: "/account/connections", label: "Connections" },
  { href: "/account/sessions", label: "Sessions" },
  { href: "/account/roles", label: "Roles" },
];

export default function AccountNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  return (
    <nav>
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={pathname === item.href ? "active" : ""}
        >
          {item.label}
        </Link>
      ))}
      <hr style={{ margin: "1rem 0", border: "none", borderTop: "1px solid #e5e7eb" }} />
      <button
        onClick={handleSignOut}
        style={{
          width: "100%",
          padding: ".5rem .75rem",
          border: "none",
          background: "none",
          cursor: "pointer",
          textAlign: "left",
          fontSize: ".875rem",
          color: "#dc2626",
          borderRadius: "6px",
        }}
      >
        Sign out
      </button>
    </nav>
  );
}
