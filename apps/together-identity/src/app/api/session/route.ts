import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import type { TogetherSessionPayload, AppRoles, GlobalRole } from "@/types/auth";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });

  if (!session?.user) {
    return NextResponse.json({ ok: false, error: "Unauthenticated" }, { status: 401 });
  }

  const db = await getDb();
  const userDoc = await db.collection("users").findOne({ id: session.user.id });

  const payload: TogetherSessionPayload = {
    sessionId: session.session.id,
    userId: session.user.id,
    email: session.user.email,
    emailVerified: session.user.emailVerified,
    name: session.user.name ?? null,
    username: (userDoc?.username as string | undefined) ?? null,
    image: session.user.image ?? null,
    roles: ((userDoc?.roles as GlobalRole[] | undefined) ?? ["user"]),
    appRoles: JSON.parse((userDoc?.appRoles as string | undefined) ?? "{}") as AppRoles,
    expiresAt: session.session.expiresAt.toISOString(),
  };

  return NextResponse.json({ ok: true, data: payload });
}
