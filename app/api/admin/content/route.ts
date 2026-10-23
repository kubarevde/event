import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import type { SiteContent } from "@/lib/content";
import { saveContent } from "@/lib/store";

export async function PUT(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const content = (await req.json()) as SiteContent;
  saveContent(content);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
