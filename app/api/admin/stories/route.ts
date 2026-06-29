import { NextResponse } from "next/server";
import { getStoryPages } from "@/lib/story/cms";

export async function GET() {
  const pages = await getStoryPages();
  return NextResponse.json({ pages });
}
