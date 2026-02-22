"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";

interface Session {
  id: string;
  userAgent: string | null;
  ipAddress: string | null;
  expiresAt: string;
  createdAt: string;
  current?: boolean;
}

export default function SessionsPage() {
  const { data: activeSession } = useSession();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/list-sessions", { credentials: "include" })
      .then((r) => r.json())
      .then((data: { data?: { sessions?: Session[] } }) => {
        const list = data.data?.sessions ?? [];
        // Mark the current session
        const tagged = list.map((s) => ({
          ...s,
          current: s.id === activeSession?.session?.id,
        }));
        setSessions(tagged.sort((a, b) => (b.current ? 1 : 0) - (a.current ? 1 : 0)));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [activeSession]);

  async function revokeSession(sessionId: string) {
    setRevoking(sessionId);
    await fetch("/api/auth/revoke-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ sessionId }),
    });
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    setRevoking(null);
  }

  async function revokeOtherSessions() {
    await fetch("/api/auth/revoke-other-sessions", {
      method: "POST",
      credentials: "include",
    });
    setSessions((prev) => prev.filter((s) => s.current));
  }

  return (
    <>
      <h1>Active sessions</h1>

      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <p style={{ fontSize: ".875rem", color: "#6b7280" }}>
            {sessions.length} active session{sessions.length !== 1 ? "s" : ""}
          </p>
          {sessions.length > 1 && (
            <button className="btn btn-danger" style={{ fontSize: ".8rem" }} onClick={revokeOtherSessions}>
              Sign out other sessions
            </button>
          )}
        </div>

        {loading ? (
          <p style={{ color: "#6b7280", fontSize: ".875rem" }}>Loading…</p>
        ) : sessions.length === 0 ? (
          <p style={{ color: "#9ca3af", fontSize: ".875rem" }}>No active sessions found.</p>
        ) : (
          sessions.map((s) => (
            <div key={s.id} className="session-item">
              <div>
                <div style={{ fontSize: ".875rem", fontWeight: 500 }}>
                  {parseUA(s.userAgent)}
                  {s.current && (
                    <span className="badge badge-green" style={{ marginLeft: ".5rem", fontSize: ".7rem" }}>
                      Current
                    </span>
                  )}
                </div>
                <div style={{ fontSize: ".75rem", color: "#9ca3af", marginTop: ".2rem" }}>
                  {s.ipAddress ?? "Unknown IP"} · Expires {new Date(s.expiresAt).toLocaleDateString()}
                </div>
              </div>
              {!s.current && (
                <button
                  className="btn btn-secondary"
                  style={{ fontSize: ".75rem", padding: ".35rem .75rem" }}
                  onClick={() => revokeSession(s.id)}
                  disabled={revoking === s.id}
                >
                  {revoking === s.id ? "Revoking…" : "Revoke"}
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
}

function parseUA(ua: string | null): string {
  if (!ua) return "Unknown device";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Safari")) return "Safari";
  if (ua.includes("Edge")) return "Edge";
  return "Browser";
}
