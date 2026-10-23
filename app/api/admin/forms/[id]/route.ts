import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import type { FormSchema } from "@/lib/forms";
import { deleteForm, getContent, getForm, updateForm } from "@/lib/store";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  if (!getForm(id)) return NextResponse.json({ error: "not found" }, { status: 404 });
  const { name, schema } = (await req.json()) as { name: string; schema: FormSchema };
  const ids = schema.fields.map((f) => f.id);
  if (ids.some((v) => !/^[a-zA-Z0-9_]+$/.test(v)) || new Set(ids).size !== ids.length) {
    return NextResponse.json({ error: "Ключи полей должны быть уникальными (латиница, цифры, _)" }, { status: 400 });
  }
  updateForm(id, name || "Форма", schema);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  if (getContent().registration.formId === id) {
    return NextResponse.json(
      { error: "Эта форма показывается на лендинге. Сначала выберите другую форму в разделе «Контент»." },
      { status: 400 }
    );
  }
  deleteForm(id);
  return NextResponse.json({ ok: true });
}
