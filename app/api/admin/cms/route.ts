import { NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";
import path from "path";
import { readFile } from "fs/promises";

const allowedTables = new Set(["products", "hero_slides", "categories", "site_settings", "custom_pages", "contact_settings"]);
const BUCKET = "trend-media";

type SupabaseAdmin = NonNullable<ReturnType<typeof getAdminSupabase>>;

function isRemoteUrl(value: unknown) {
  return typeof value === "string" && /^https?:\/\//i.test(value);
}

function isPublicAsset(value: unknown) {
  return (
    typeof value === "string" &&
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !value.includes("..")
  );
}

function getContentType(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  if ([".jpg", ".jpeg"].includes(ext)) return "image/jpeg";
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  if (ext === ".svg") return "image/svg+xml";
  if (ext === ".mp4") return "video/mp4";
  if (ext === ".webm") return "video/webm";
  if (ext === ".mov") return "video/quicktime";
  if (ext === ".mp3") return "audio/mpeg";
  if (ext === ".wav") return "audio/wav";
  return "application/octet-stream";
}

function storageFolderForPublicPath(publicPath: string) {
  if (publicPath.startsWith("/products/")) return "products";
  if (publicPath.startsWith("/heroes/")) return "heroes";
  if (publicPath.startsWith("/interactive/")) return "interactive";
  if (publicPath.startsWith("/adhkar/")) return "adhkar";
  return "general";
}

async function uploadPublicAssetToSupabase(
  supabase: SupabaseAdmin,
  publicPath: string,
) {
  if (!isPublicAsset(publicPath) || isRemoteUrl(publicPath)) return publicPath;

  const relativePath = publicPath.replace(/^\/+/, "");
  const absolutePath = path.join(process.cwd(), "public", relativePath);
  const fileBuffer = await readFile(absolutePath);
  const folder = storageFolderForPublicPath(publicPath);
  const fileName = path.basename(relativePath).replace(/[^a-zA-Z0-9._-]/g, "-");
  const storagePath = `${folder}/${fileName}`;

  const { error } = await supabase.storage.from(BUCKET).upload(storagePath, fileBuffer, {
    cacheControl: "3600",
    upsert: true,
    contentType: getContentType(fileName),
  });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}

async function normalizeMediaFields(
  supabase: SupabaseAdmin,
  table: string,
  payload: Record<string, unknown>,
) {
  const nextPayload = { ...payload };

  const fieldsByTable: Record<string, string[]> = {
    products: ["image", "interactive_video_url"],
    hero_slides: ["image", "light_image"],
  };

  const fields = fieldsByTable[table] || [];

  for (const field of fields) {
    const value = nextPayload[field];
    if (isPublicAsset(value)) {
      nextPayload[field] = await uploadPublicAssetToSupabase(supabase, value as string);
    }
  }

  return nextPayload;
}

export async function POST(req: Request) {
  const supabase = getAdminSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase service role is not configured" }, { status: 500 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const { table, action, payload, id } = body as {
    table: string;
    action: "upsert" | "delete";
    payload?: Record<string, unknown>;
    id?: string | number;
  };

  if (!allowedTables.has(table)) {
    return NextResponse.json({ error: "Table is not allowed" }, { status: 400 });
  }

  if (action === "delete") {
    const key = table === "site_settings" ? "id" : table === "products" ? "slug" : "id";
    const { error } = await supabase.from(table).delete().eq(key, id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  if (action === "upsert") {
    if (!payload) return NextResponse.json({ error: "Missing payload" }, { status: 400 });

    let normalizedPayload: Record<string, unknown>;
    try {
      normalizedPayload = await normalizeMediaFields(supabase, table, payload);
    } catch (error: any) {
      return NextResponse.json(
        { error: `Failed to upload public asset to Supabase: ${error.message || "Unknown error"}` },
        { status: 500 },
      );
    }

    const { data, error } = await supabase.from(table).upsert(normalizedPayload).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, data });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
