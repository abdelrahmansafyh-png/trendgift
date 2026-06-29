import { NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";

const BUCKET = "trend-media";
const allowedFolders = new Set(["products", "heroes", "interactive", "orders", "stories", "general"]);

function cleanName(name: string) {
  const ext = name.includes(".") ? name.split(".").pop() : "bin";
  const base = name
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "file";
  return `${base}.${ext}`;
}

export async function POST(req: Request) {
  const supabase = getAdminSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase service role is not configured" }, { status: 500 });
  }

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Invalid form data" }, { status: 400 });

  const file = form.get("file");
  const folderRaw = String(form.get("folder") || "general");
  const folder = allowedFolders.has(folderRaw) ? folderRaw : "general";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file was uploaded" }, { status: 400 });
  }

  const maxSize = 50 * 1024 * 1024;
  if (file.size > maxSize) {
    return NextResponse.json({ error: "File is larger than 50MB" }, { status: 400 });
  }

  const safeName = cleanName(file.name);
  const path = `${folder}/${Date.now()}-${safeName}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || "application/octet-stream",
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return NextResponse.json({
    ok: true,
    bucket: BUCKET,
    path,
    url: data.publicUrl,
  });
}
