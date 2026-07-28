import { NextResponse } from "next/server";
import { getPublicStore } from "@/lib/store";
import { jsonOk } from "@/lib/api";

export async function GET() {
  const store = await getPublicStore();
  return jsonOk(store);
}
