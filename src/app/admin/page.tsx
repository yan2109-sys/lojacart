"use client";

import { useEffect, useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ShoppingBag, DollarSign, Package, Truck } from "lucide-react";

export default function AdminDashboard() {
  const [data, setData] = useState<{
    stats: { totalOrders: number; approvedOrders: number; totalRevenue: number; pendingDeliveries: number; products: number };
    recentOrders: { id: string; clientEmail: string; total: number; status: string; createdAt: string }[];
  } | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats").then((r) => r.json()).then((d) => d.success && setData(d.data));
  }, []);

  if (!data) return <div className="text-zinc-400">Carregando...</div>;

  const cards = [
    { label: "Receita total", value: formatCurrency(data.stats.totalRevenue), icon: DollarSign, color: "text-green-400" },
    { label: "Pedidos aprovados", value: data.stats.approvedOrders, icon: ShoppingBag, color: "text-blue-400" },
    { label: "Entregas pendentes", value: data.stats.pendingDeliveries, icon: Truck, color: "text-yellow-400" },
    { label: "Produtos ativos", value: data.stats.products, icon: Package, color: "text-purple-400" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-[var(--border)] p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-zinc-400">{c.label}</span>
              <c.icon className={`h-5 w-5 ${c.color}`} />
            </div>
            <p className="text-2xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      <h2 className="font-semibold mb-4">Pedidos recentes</h2>
      <div className="rounded-xl border border-[var(--border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--card)] text-zinc-400">
            <tr>
              <th className="px-4 py-3 text-left">E-mail</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Data</th>
            </tr>
          </thead>
          <tbody>
            {data.recentOrders.map((o) => (
              <tr key={o.id} className="border-t border-[var(--border)]">
                <td className="px-4 py-3">{o.clientEmail}</td>
                <td className="px-4 py-3 text-green-400">{formatCurrency(o.total)}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${
                    o.status === "DELIVERED" ? "bg-green-500/20 text-green-400" :
                    o.status === "APPROVED" ? "bg-blue-500/20 text-blue-400" :
                    o.status === "PENDING" ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-zinc-500/20 text-zinc-400"
                  }`}>{o.status}</span>
                </td>
                <td className="px-4 py-3 text-zinc-400">{formatDate(o.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
