import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { defaultFormSchema } from "@/lib/forms";
import { createForm, getContent, getForm } from "@/lib/store";

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { name, copyFrom } = (await req.json().catch(() => ({}))) as { name?: string; copyFrom?: string };
  const source = copyFrom ? getForm(copyFrom) : undefined;
  const schema = source?.schema ?? defaultFormSchema(getContent().event.privacyPolicyUrl);
  const form = createForm(name?.trim() || (source ? `${source.name} (копия)` : "Новая форма"), schema);
  return NextResponse.json(form);
}
