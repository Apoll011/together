"use client";

import { useState } from "react";
import { useSession, linkSocial, unlinkAccount } from "@/lib/auth-client";

interface LinkedAccount {
  id: string;
  provider: string;
  createdAt: string;
}

const SUPPORTED_PROVIDERS = [
  { id: "google", label: "Google" },
  { id: "github", label: "GitHub" },
] as const;

export default function ConnectionsPage() {
  const { data: session, isPending } = useSession();
  const [accounts, setAccounts] = useState<LinkedAccount[]>([]);
  const [accountsLoaded, setAccountsLoaded] = useState(false);
  const [error, setError] = useState("");
  const [unlinking, setUnlinking] = useState<string | null>(null);

  if (isPending) return <p style={{ color: "#6b7280" }}>Loading…</p>;
  if (!session) return null;

  // Load linked accounts lazily
  if (!accountsLoaded) {
    fetch("/api/auth/list-accounts", { credentials: "include" })
      .then((r) => r.json())
      .then((data: { data?: { accounts?: LinkedAccount[] } }) => {
        setAccounts(data.data?.accounts ?? []);
        setAccountsLoaded(true);
      })
      .catch(() => setAccountsLoaded(true));
  }

  const linkedProviderIds = new Set(accounts.map((a) => a.provider));

  async function handleLink(provider: "google" | "github") {
    await linkSocial({
      provider,
      callbackURL: "/account/connections",
    });
  }

  async function handleUnlink(accountId: string, provider: string) {
    setUnlinking(accountId);
    setError("");
    const result = await unlinkAccount({ accountId });
    if (result.error) {
      setError(result.error.message ?? "Failed to unlink");
    } else {
      setAccounts((prev) => prev.filter((a) => a.id !== accountId));
    }
    setUnlinking(null);
  }

  return (
    <>
      <h1>Connected accounts</h1>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <p style={{ fontSize: ".875rem", color: "#6b7280", marginBottom: "1.25rem" }}>
          Link OAuth providers to sign in without a password. If your OAuth email matches this account, it is linked automatically.
        </p>

        {SUPPORTED_PROVIDERS.map(({ id, label }) => {
          const linkedAccount = accounts.find((a) => a.provider === id);
          const isLinked = linkedProviderIds.has(id);

          return (
            <div key={id} className="session-item">
              <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                <ProviderIcon provider={id} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: ".875rem" }}>{label}</div>
                  {isLinked && linkedAccount && (
                    <div style={{ fontSize: ".75rem", color: "#6b7280" }}>
                      Connected {new Date(linkedAccount.createdAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
              {isLinked && linkedAccount ? (
                <button
                  className="btn btn-secondary"
                  style={{ fontSize: ".75rem", padding: ".35rem .75rem" }}
                  onClick={() => handleUnlink(linkedAccount.id, id)}
                  disabled={unlinking === linkedAccount.id || accounts.length === 1}
                  title={accounts.length === 1 ? "Cannot unlink your only login method" : undefined}
                >
                  {unlinking === linkedAccount.id ? "Unlinking…" : "Unlink"}
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  style={{ fontSize: ".75rem", padding: ".35rem .75rem" }}
                  onClick={() => handleLink(id as "google" | "github")}
                >
                  Connect
                </button>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

function ProviderIcon({ provider }: { provider: string }) {
  if (provider === "google") {
    return (
      <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        <path fill="#FBBC05" d="M10.53 28.59c-.5-1.45-.79-3-.79-4.59s.29-3.14.79-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
}
