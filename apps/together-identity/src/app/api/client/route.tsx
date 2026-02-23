import { NextResponse } from "next/server";

let bootstrapped = false;

export async function GET() {
    const { seedOAuthClients } = await import("@/lib/seed-oauth-clients");
    await seedOAuthClients();

  return NextResponse.json({ ok: true });
}