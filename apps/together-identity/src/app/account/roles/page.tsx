import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import type { GlobalRole, AppRoles } from "@/types/auth";

export default async function RolesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return null;

  const db = await getDb();
  const userDoc = await db.collection("users").findOne({ id: session.user.id });

  const globalRoles: GlobalRole[] = (userDoc?.roles as GlobalRole[] | undefined) ?? ["user"];
  const appRoles: AppRoles = JSON.parse((userDoc?.appRoles as string | undefined) ?? "{}") as AppRoles;
  const hasAppRoles = Object.keys(appRoles).length > 0;

  return (
    <>
      <h1>Roles</h1>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: ".75rem" }}>Global roles</h2>
        <p style={{ fontSize: ".875rem", color: "#6b7280", marginBottom: "1rem" }}>
          These roles apply across the entire Together ecosystem.
        </p>
        <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
          {globalRoles.map((role) => (
            <span key={role} className="badge badge-blue">{role}</span>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: ".75rem" }}>App-specific roles</h2>
        <p style={{ fontSize: ".875rem", color: "#6b7280", marginBottom: "1rem" }}>
          These roles are granted by individual Together applications.
        </p>

        {!hasAppRoles ? (
          <p style={{ fontSize: ".875rem", color: "#9ca3af" }}>No app-specific roles assigned yet.</p>
        ) : (
          <div style={{ display: "grid", gap: "1rem" }}>
            {Object.entries(appRoles).map(([appId, roles]) => (
              <div key={appId} style={{ padding: ".75rem", background: "#f9fafb", borderRadius: 8 }}>
                <div style={{ fontWeight: 600, fontSize: ".8125rem", color: "#374151", marginBottom: ".5rem" }}>
                  {appId}
                </div>
                <div style={{ display: "flex", gap: ".375rem", flexWrap: "wrap" }}>
                  {roles.map((r) => (
                    <span key={r} className="badge badge-blue">{r}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
