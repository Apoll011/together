"use client";

import { useState } from "react";
import { authClient, useSession } from "@/lib/auth-client";

export default function AccountPage() {
  const { data: session, isPending } = useSession();
  const [username, setUsername] = useState(session?.user.username ?? "");
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [usernameError, setUsernameError] = useState("");

  if (isPending) return <p style={{ color: "#6b7280" }}>Loading…</p>;
  if (!session) return null;

  const user = session.user;

  async function handleUsernameChange(e: React.FormEvent) {
    e.preventDefault();
    setUsernameStatus("saving");
    setUsernameError("");

    const { data, error } = await authClient.updateUser({
      username,
    });

    if (!data?.status) {
      setUsernameError(error?.message ?? "Failed to update username");
      setUsernameStatus("error");
    } else {
      setUsernameStatus("saved");
      setTimeout(() => setUsernameStatus("idle"), 3000);
    }
  }

  return (
    <>
      <h1>Profile</h1>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem" }}>
          Account information
        </h2>
        <div style={{ display: "grid", gap: ".75rem" }}>
          <Row label="Name" value={user.name ?? "—"} />
          <Row
            label="Email"
            value={user.email}
            badge={user.emailVerified ? "Verified" : "Unverified"}
            badgeColor={user.emailVerified ? "badge-green" : "badge-gray"}
          />
          <Row label="User ID" value={user.id} mono />
        </div>
      </div>

      <div className="card">
        <h2
          style={{ fontSize: "1rem", fontWeight: 600, marginBottom: ".25rem" }}
        >
          Username
        </h2>
        <p
          style={{
            fontSize: ".875rem",
            color: "#6b7280",
            marginBottom: "1rem",
          }}
        >
          Can be changed once every 30 days.
        </p>

        {usernameStatus === "saved" && (
          <div className="alert alert-success">Username updated!</div>
        )}
        {usernameError && (
          <div className="alert alert-error">{usernameError}</div>
        )}

        <form
          onSubmit={handleUsernameChange}
          style={{ display: "flex", gap: ".75rem" }}
        >
          <input
            className="input"
            type="text"
            placeholder="your-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            pattern="^[a-zA-Z0-9_-]+$"
            minLength={3}
            maxLength={32}
            required
            style={{ flex: 1 }}
          />
          <button
            className="btn btn-primary"
            type="submit"
            disabled={usernameStatus === "saving"}
          >
            {usernameStatus === "saving" ? "Saving…" : "Save"}
          </button>
        </form>
      </div>
    </>
  );
}

function Row({
  label,
  value,
  badge,
  badgeColor = "badge-gray",
  mono = false,
}: {
  label: string;
  value: string;
  badge?: string;
  badgeColor?: string;
  mono?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: ".5rem 0",
        borderBottom: "1px solid #f3f4f6",
      }}
    >
      <span style={{ fontSize: ".8125rem", color: "#6b7280", minWidth: 80 }}>
        {label}
      </span>
      <span
        style={{
          fontSize: ".875rem",
          fontFamily: mono ? "monospace" : undefined,
          color: "#111827",
        }}
      >
        {value}
        {badge && (
          <span
            className={`badge ${badgeColor}`}
            style={{ marginLeft: ".5rem" }}
          >
            {badge}
          </span>
        )}
      </span>
    </div>
  );
}
