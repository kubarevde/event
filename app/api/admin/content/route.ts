import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import type { SiteContent } from "@/lib/content";
import { discardDraft, getDraft, saveDraft } from "@/lib/store";

/** Черновик контента: читают и пишут оба редактора (на сайте и в админке). */
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return NextResponse.json(getDraft());
}

export async function PUT(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  saveDraft((await req.json()) as SiteContent);
  return NextResponse.json({ ok: true, hasChanges: getDraft().hasChanges });
}

/** Отменить все неопубликованные изменения. */
export async function DELETE() {
  const denied = await requireAdmin();
  if (denied) return denied;
  discardDraft();
  return NextResponse.json(getDraft());
}
