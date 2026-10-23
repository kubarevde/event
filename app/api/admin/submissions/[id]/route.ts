import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { SUBMISSION_STATUSES } from "@/lib/forms";
import { deleteSubmission, updateSubmission } from "@/lib/store";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  const { status, note } = (await req.json()) as { status?: string; note?: string };
  if (status !== undefined && !SUBMISSION_STATUSES.some((s) => s.value === status)) {
    return NextResponse.json({ error: "bad status" }, { status: 400 });
  }
  updateSubmission(Number(id), { status, note: note?.slice(0, 2000) });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  deleteSubmission(Number((await params).id));
  return NextResponse.json({ ok: true });
}
