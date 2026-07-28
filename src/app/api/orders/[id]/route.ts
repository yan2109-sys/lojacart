import { prisma } from "@/lib/prisma";
import { createDeliveriesForOrder } from "@/lib/delivery";
import { jsonOk, jsonErr } from "@/lib/api";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) return jsonErr("Pedido não encontrado", 404);
  return jsonOk(order);
}

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return jsonErr("Pedido não encontrado", 404);
  if (order.status !== "PENDING") return jsonErr("Pedido já processado");

  await prisma.order.update({
    where: { id },
    data: { status: "APPROVED", paidAt: new Date() },
  });

  for (const item of await prisma.orderItem.findMany({ where: { orderId: id } })) {
    if (item.productId) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (product && product.stock !== null && product.stock !== undefined) {
        await prisma.product.update({
          where: { id: product.id },
          data: { stock: Math.max(0, product.stock - item.quantity) },
        });
      }
    }
  }

  await createDeliveriesForOrder(id);

  const updated = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  return jsonOk(updated);
}
