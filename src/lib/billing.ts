import { prisma } from "@/lib/prisma";

const PAID_STATUSES = ["APPROVED", "DELIVERED"] as const;

function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function startOfWeek(d = new Date()) {
  const x = startOfDay(d);
  const day = x.getDay();
  x.setDate(x.getDate() - day);
  return x;
}

function startOfMonth(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export async function getBillingSummary() {
  const [totalRevenue, todayRevenue, weekRevenue, monthRevenue, paidOrders, withdrawals] =
    await Promise.all([
      prisma.order.aggregate({
        where: { status: { in: [...PAID_STATUSES] } },
        _sum: { total: true },
      }),
      prisma.order.aggregate({
        where: { status: { in: [...PAID_STATUSES] }, paidAt: { gte: startOfDay() } },
        _sum: { total: true },
      }),
      prisma.order.aggregate({
        where: { status: { in: [...PAID_STATUSES] }, paidAt: { gte: startOfWeek() } },
        _sum: { total: true },
      }),
      prisma.order.aggregate({
        where: { status: { in: [...PAID_STATUSES] }, paidAt: { gte: startOfMonth() } },
        _sum: { total: true },
      }),
      prisma.order.findMany({
        where: { status: { in: [...PAID_STATUSES] } },
        orderBy: { paidAt: "desc" },
        take: 20,
        include: { items: true },
      }),
      prisma.withdrawal.findMany({ orderBy: { createdAt: "desc" } }),
    ]);

  const totalEarned = totalRevenue._sum.total || 0;
  const totalWithdrawn = withdrawals
    .filter((w) => w.status === "COMPLETED")
    .reduce((s, w) => s + w.amount, 0);
  const pendingWithdrawals = withdrawals
    .filter((w) => w.status === "PENDING")
    .reduce((s, w) => s + w.amount, 0);
  const availableBalance = Math.max(0, totalEarned - totalWithdrawn - pendingWithdrawals);

  const monthlyMap = new Map<string, number>();
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthlyMap.set(key, 0);
  }

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const monthlyOrders = await prisma.order.findMany({
    where: {
      status: { in: [...PAID_STATUSES] },
      paidAt: { gte: sixMonthsAgo },
    },
    select: { total: true, paidAt: true },
  });

  for (const o of monthlyOrders) {
    if (!o.paidAt) continue;
    const key = `${o.paidAt.getFullYear()}-${String(o.paidAt.getMonth() + 1).padStart(2, "0")}`;
    if (monthlyMap.has(key)) monthlyMap.set(key, (monthlyMap.get(key) || 0) + o.total);
  }

  const monthlyRevenue = Array.from(monthlyMap.entries()).map(([month, revenue]) => ({ month, revenue }));

  return {
    totalEarned,
    todayEarned: todayRevenue._sum.total || 0,
    weekEarned: weekRevenue._sum.total || 0,
    monthEarned: monthRevenue._sum.total || 0,
    totalWithdrawn,
    pendingWithdrawals,
    availableBalance,
    paidOrdersCount: paidOrders.length,
    recentPaidOrders: paidOrders,
    withdrawals,
    monthlyRevenue,
  };
}
