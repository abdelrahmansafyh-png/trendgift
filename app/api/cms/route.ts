import { NextResponse } from "next/server";
import { getCmsData } from "@/lib/cms";

export async function GET() {
  const data = await getCmsData();
  return NextResponse.json(data);
}
