import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import type { SiteContent } from "@/lib/content";
import { publishDraft, saveDraft } from "@/lib/store";

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  // Редактор может прислать последнее состояние, чтобы не потерять несохранённую правку
  const body = await req.text();
  if (body) saveDraft(JSON.parse(body) as SiteContent);
  publishDraft();
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
