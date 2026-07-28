import { prisma } from "@/lib/prisma";
import { jsonOk, jsonErr, requireAdmin } from "@/lib/api";

export async function GET() {
  if (!(await requireAdmin())) return jsonErr("Não autorizado", 401);
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true, deliveries: true },
    take: 100,
  });
  return jsonOk(orders);
}
