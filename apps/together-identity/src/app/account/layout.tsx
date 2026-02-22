import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import AccountNav from "./AccountNav";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/login?callbackUrl=/account");
  }

  return (
    <div className="account-layout">
      <aside className="account-sidebar">
        <span className="logo" style={{ fontSize: "1rem", marginBottom: "2rem", display: "block" }}>Together</span>
        <AccountNav />
      </aside>
      <main className="account-main">{children}</main>
    </div>
  );
}
