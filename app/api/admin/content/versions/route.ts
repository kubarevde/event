import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { listVersions } from "@/lib/store";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return NextResponse.json(listVersions());
}
