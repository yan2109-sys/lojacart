import { getBillingSummary } from "@/lib/billing";
import { getStoreSettings } from "@/lib/store";
import { jsonOk, jsonErr, requireAdmin } from "@/lib/api";

export async function GET() {
  if (!(await requireAdmin())) return jsonErr("Não autorizado", 401);
  const [billing, settings] = await Promise.all([getBillingSummary(), getStoreSettings()]);
  return jsonOk({ ...billing, pixKey: settings.pixKey, pixBeneficiary: settings.pixBeneficiary });
}
