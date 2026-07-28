import { verifyPassword, createAdminToken, setAdminCookie, clearAdminCookie } from "@/lib/auth";
import { getStoreSettings } from "@/lib/store";
import { jsonOk, jsonErr } from "@/lib/api";

export async function POST(request: Request) {
  const { password } = await request.json();
  if (!password) return jsonErr("Senha obrigatória");

  const settings = await getStoreSettings();
  const valid = await verifyPassword(password, settings.adminPasswordHash);
  if (!valid) return jsonErr("Senha incorreta", 401);

  const token = await createAdminToken();
  await setAdminCookie(token);
  return jsonOk({ message: "Login OK" });
}

export async function DELETE() {
  await clearAdminCookie();
  return jsonOk({ message: "Logout OK" });
}
