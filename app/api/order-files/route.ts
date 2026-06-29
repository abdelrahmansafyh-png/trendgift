import { NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";

export const runtime = "nodejs";

const BUCKET = process.env.SUPABASE_ORDER_FILES_BUCKET || "order-files";
const MAX_FILES = 8;
const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB per file

function safeFileName(name: string) {
  const cleaned = name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 90);
  return cleaned || "file";
}

async function ensureBucket(supabase: NonNullable<ReturnType<typeof getAdminSupabase>>) {
  const bucket = await supabase.storage.getBucket(BUCKET);
  if (!bucket.error) return;

  const created = await supabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: MAX_FILE_SIZE,
  });

  if (created.error && !String(created.error.message).toLowerCase().includes("already")) {
    throw created.error;
  }
}

export async function POST(request: Request) {
  const supabase = getAdminSupabase();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase service role is not configured." },
      { status: 500 }
    );
  }

  try {
    await ensureBucket(supabase);

    const formData = await request.formData();
    const files = formData
      .getAll("files")
      .filter((item): item is File => item instanceof File && item.size > 0)
      .slice(0, MAX_FILES);

    if (!files.length) return NextResponse.json({ files: [] });

    const dateFolder = new Date().toISOString().slice(0, 10);
    const uploaded = [];

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File is too large: ${file.name}` },
          { status: 413 }
        );
      }

      const fileName = safeFileName(file.name);
      const path = `orders/${dateFolder}/${Date.now()}-${crypto.randomUUID()}-${fileName}`;
      const bytes = Buffer.from(await file.arrayBuffer());

      const { error } = await supabase.storage.from(BUCKET).upload(path, bytes, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

      if (error) throw error;

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      uploaded.push({
        name: file.name,
        url: data.publicUrl,
        path,
        size: file.size,
        type: file.type,
      });
    }

    return NextResponse.json({ files: uploaded });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Upload failed" },
      { status: 500 }
    );
  }
}
