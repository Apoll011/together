import { NextResponse } from "next/server";
import { ensureIndexes } from "@/lib/db";

let bootstrapped = false;

export async function GET() {
  if (!bootstrapped) {
    await ensureIndexes();
    bootstrapped = true;
  }
  return NextResponse.json({ ok: true, service: "together-identity" });
}
