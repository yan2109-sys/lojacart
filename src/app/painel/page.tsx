"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ShoppingBag, DollarSign, Package, Truck, ArrowRight } from "lucide-react";

export default function PainelDashboard() {
  const [data, setData] = useState<{
    stats: { totalOrders: number; approvedOrders: number; totalRevenue: number; pendingDeliveries: number; products: number };
    recentOrders: { id: string; clientEmail: string; total: number; status: string; createdAt: string }[];
  } | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats").then((r) => r.json()).then((d) => d.success && setData(d.data));
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  const cards = [
    { label: "Receita total", value: formatCurrency(data.stats.totalRevenue), icon: DollarSign, color: "text-blue-400 bg-blue-950" },
    { label: "Pedidos aprovados", value: String(data.stats.approvedOrders), icon: ShoppingBag, color: "text-blue-300 bg-blue-950" },
    { label: "Entregas pendentes", value: String(data.stats.pendingDeliveries), icon: Truck, color: "text-amber-400 bg-amber-950" },
    { label: "Produtos ativos", value: String(data.stats.products), icon: Package, color: "text-zinc-300 bg-zinc-800" },
  ];

  const statusStyle: Record<string, string> = {
    DELIVERED: "bg-blue-950 text-blue-400",
    APPROVED: "bg-blue-900 text-blue-300",
    PENDING: "bg-amber-950 text-amber-400",
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100">Dashboard</h1>
        <p className="text-zinc-500 text-sm mt-1">Visão geral da sua loja FiveM</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-zinc-500">{c.label}</span>
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${c.color}`}>
                <c.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-zinc-100">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-zinc-100">Pedidos recentes</h2>
        <div className="flex gap-4">
          <Link href="/painel/faturamento" className="text-sm text-blue-400 hover:underline flex items-center gap-1">
            Faturamento <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link href="/painel/pedidos" className="text-sm text-blue-400 hover:underline flex items-center gap-1">
            Ver todos <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-950 text-zinc-500">
            <tr>
              <th className="px-4 py-3 text-left font-medium">E-mail</th>
              <th className="px-4 py-3 text-left font-medium">Total</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Data</th>
            </tr>
          </thead>
          <tbody>
            {data.recentOrders.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-zinc-600">Nenhum pedido ainda</td></tr>
            ) : data.recentOrders.map((o) => (
              <tr key={o.id} className="border-t border-zinc-800">
                <td className="px-4 py-3 text-zinc-200">{o.clientEmail}</td>
                <td className="px-4 py-3 font-medium text-blue-400">{formatCurrency(o.total)}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle[o.status] || "bg-zinc-800 text-zinc-400"}`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-500">{formatDate(o.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
