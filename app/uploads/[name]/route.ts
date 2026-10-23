import fs from "fs/promises";
import path from "path";
import { UPLOADS_DIR } from "@/lib/db";
import { UPLOAD_TYPES } from "@/lib/uploads";

export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const ext = path.extname(name).slice(1).toLowerCase();
  const type = UPLOAD_TYPES[ext];
  if (!type || !/^[a-zA-Z0-9_-]+\.[a-z0-9]+$/.test(name)) return new Response("Not found", { status: 404 });

  try {
    const file = await fs.readFile(path.join(UPLOADS_DIR, name));
    return new Response(new Uint8Array(file), {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
