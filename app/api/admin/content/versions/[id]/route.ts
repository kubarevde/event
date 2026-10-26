import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { getDraft, restoreVersion } from "@/lib/store";

/** Восстановить версию в черновик. */
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  if (!restoreVersion(Number((await params).id))) {
    return NextResponse.json({ error: "Версия не найдена" }, { status: 404 });
  }
  return NextResponse.json(getDraft());
}
