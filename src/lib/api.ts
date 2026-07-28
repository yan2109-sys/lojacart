import { NextResponse } from "next/server";

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function jsonErr(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, { status });
}

export async function requireAdmin() {
  const { isAdminAuthenticated } = await import("@/lib/auth");
  const ok = await isAdminAuthenticated();
  if (!ok) return null;
  return true;
}
