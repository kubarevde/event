import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { UPLOADS_DIR } from "@/lib/db";
import { MAX_UPLOAD_BYTES, UPLOAD_TYPES } from "@/lib/uploads";

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const file = (await req.formData()).get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Файл не передан" }, { status: 400 });

  const ext = path.extname(file.name).slice(1).toLowerCase();
  if (!UPLOAD_TYPES[ext]) {
    return NextResponse.json({ error: "Допустимы PNG, JPG, WEBP, GIF, SVG, PDF" }, { status: 400 });
  }
  if (file.size > MAX_UPLOAD_BYTES) return NextResponse.json({ error: "Файл больше 10 МБ" }, { status: 400 });

  const name = `${randomUUID().slice(0, 12)}.${ext === "jpeg" ? "jpg" : ext}`;
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOADS_DIR, name), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ url: `/uploads/${name}` });
}
