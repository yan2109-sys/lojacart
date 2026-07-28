import { prisma } from "@/lib/prisma";
import { jsonOk, jsonErr, requireAdmin } from "@/lib/api";

export async function GET() {
  if (!(await requireAdmin())) return jsonErr("Não autorizado", 401);

  const [totalOrders, approvedOrders, totalRevenue, pendingDeliveries, products, recentOrders] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: { in: ["APPROVED", "DELIVERED"] } } }),
      prisma.order.aggregate({
        where: { status: { in: ["APPROVED", "DELIVERED"] } },
        _sum: { total: true },
      }),
      prisma.delivery.count({ where: { status: "PENDING" } }),
      prisma.product.count({ where: { enabled: true } }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { items: true },
      }),
    ]);

  return jsonOk({
    stats: {
      totalOrders,
      approvedOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      pendingDeliveries,
      products,
    },
    recentOrders,
  });
}
