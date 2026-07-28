import { prisma } from "@/lib/prisma";
import { getStoreSettings } from "@/lib/store";
import { jsonOk, jsonErr, requireAdmin } from "@/lib/api";

export async function GET() {
  if (!(await requireAdmin())) return jsonErr("Não autorizado", 401);
  const settings = await getStoreSettings();
  return jsonOk({
    storeName: settings.storeName,
    slogan: settings.slogan,
    serverName: settings.serverName,
    discordUrl: settings.discordUrl,
    pixKey: settings.pixKey,
    pixBeneficiary: settings.pixBeneficiary,
    apiSecret: settings.apiSecret,
  });
}

export async function PATCH(request: Request) {
  if (!(await requireAdmin())) return jsonErr("Não autorizado", 401);
  const body = await request.json();
  const settings = await prisma.storeSettings.update({
    where: { id: 1 },
    data: {
      storeName: body.storeName,
      slogan: body.slogan,
      serverName: body.serverName,
      discordUrl: body.discordUrl,
      pixKey: body.pixKey,
      pixBeneficiary: body.pixBeneficiary,
    },
  });
  return jsonOk(settings);
}
