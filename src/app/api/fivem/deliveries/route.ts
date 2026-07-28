import { prisma } from "@/lib/prisma";
import { getStoreSettings } from "@/lib/store";
import { markOrderDelivered } from "@/lib/delivery";
import { jsonOk, jsonErr } from "@/lib/api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const identifier = searchParams.get("identifier");

  const settings = await getStoreSettings();
  if (!token || token !== settings.apiSecret) {
    return jsonErr("Token inválido", 401);
  }

  const where: { status: "PENDING" | "SCHEDULED"; clientIdentifier?: string } = {
    status: "PENDING",
  };
  if (identifier) where.clientIdentifier = identifier;

  const deliveries = await prisma.delivery.findMany({
    where,
    orderBy: { createdAt: "asc" },
    take: 50,
    include: { order: { select: { internalId: true, clientEmail: true } } },
  });

  return jsonOk(
    deliveries.map((d) => {
      let args: unknown[] = [];
      try {
        args = JSON.parse(d.args);
      } catch {
        args = [d.clientIdentifier];
      }
      return {
        id: d.id,
        command: d.command,
        args,
        clientIdentifier: d.clientIdentifier,
        orderId: d.order.internalId,
      };
    })
  );
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const settings = await getStoreSettings();
  if (!token || token !== settings.apiSecret) return jsonErr("Token inválido", 401);

  const body = await request.json();
  const { deliveryId, success, result } = body;

  const delivery = await prisma.delivery.findUnique({ where: { id: deliveryId } });
  if (!delivery) return jsonErr("Entrega não encontrada", 404);

  await prisma.delivery.update({
    where: { id: deliveryId },
    data: {
      status: success ? "EXECUTED" : "FAILED",
      result: result || null,
      executedAt: new Date(),
    },
  });

  if (success) await markOrderDelivered(delivery.orderId);

  return jsonOk({ ok: true });
}
