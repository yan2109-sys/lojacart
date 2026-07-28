import { prisma } from "@/lib/prisma";

export async function createDeliveriesForOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) return;

  for (const item of order.items) {
    for (let i = 0; i < item.quantity; i++) {
      let argsStr = item.commandArgs;
      try {
        const parsed = JSON.parse(item.commandArgs) as unknown[];
        argsStr = JSON.stringify(
          parsed.map((arg) =>
            typeof arg === "string"
              ? arg
                  .replace("{client_identifier}", order.clientIdentifier)
                  .replace("{client_email}", order.clientEmail)
                  .replace("{order_id}", order.internalId)
              : arg
          )
        );
      } catch {
        argsStr = item.commandArgs
          .replace("{client_identifier}", order.clientIdentifier)
          .replace("{client_email}", order.clientEmail)
          .replace("{order_id}", order.internalId);
      }

      await prisma.delivery.create({
        data: {
          orderId: order.id,
          clientIdentifier: order.clientIdentifier,
          command: item.command,
          args: argsStr,
          status: "PENDING",
        },
      });
    }
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "APPROVED" },
  });
}

export async function markOrderDelivered(orderId: string) {
  const pending = await prisma.delivery.count({
    where: { orderId, status: { in: ["PENDING", "SCHEDULED"] } },
  });
  if (pending === 0) {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "DELIVERED", deliveredAt: new Date() },
    });
  }
}
